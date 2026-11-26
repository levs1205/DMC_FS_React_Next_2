/**
 * Datos de prueba. Se ejecuta con `npx prisma db seed` (o al hacer `prisma migrate reset`).
 * Borra los datos existentes, así se puede ejecutar varias veces.
 * Las fechas de las reservas son relativas a hoy para que la demo siempre tenga
 * reservas pasadas, en curso y futuras.
 */
import "dotenv/config";
import { randomBytes, scryptSync } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  type BookingStatus,
  type PaymentMethod,
  type PaymentStatus,
  type Room,
  type User,
} from "../generated/prisma/client";
import { DEMO_USER } from "../shared/infrastructure/auth/currentUser";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

/** Contraseña de prueba para todos los usuarios (aún no hay login). */
const SEED_PASSWORD = "Hotel123!";

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  return `scrypt$${salt}$${scryptSync(password, salt, 64).toString("hex")}`;
}

/** Fecha @db.Date a `offset` días de hoy. */
function day(offset: number): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + offset));
}

async function createUsers() {
  const users = [
    { id: DEMO_USER.id, email: DEMO_USER.email, fullName: DEMO_USER.fullName, phone: "+51 987 654 321" },
    { email: "maria.torres@correo.pe", fullName: "María Torres", phone: "+51 912 345 678" },
    { email: "recepcion@hotel.pe", fullName: "Carlos Rojas", role: "STAFF" as const },
    { email: "admin@hotel.pe", fullName: "Ana Vega", role: "ADMIN" as const },
  ];

  const [demo, maria] = await Promise.all(
    users.map((user) =>
      prisma.user.create({ data: { ...user, passwordHash: hashPassword(SEED_PASSWORD) } }),
    ),
  );
  return { demo, maria };
}

async function createAmenities() {
  await prisma.amenity.createMany({
    data: [
      { name: "Wi-Fi", icon: "wifi" },
      { name: "TV", icon: "tv" },
      { name: "Aire acondicionado", icon: "snowflake" },
      { name: "Minibar", icon: "wine" },
      { name: "Jacuzzi", icon: "bath" },
      { name: "Vista al mar", icon: "waves" },
    ],
  });
}

async function createRooms() {
  const rooms = [
    { number: "101", name: "Simple Vista Jardín", type: "SINGLE", capacity: 2, pricePerNight: 155, amenities: ["Wi-Fi", "TV"] },
    { number: "102", name: "Simple Estándar", type: "SINGLE", capacity: 1, pricePerNight: 120, amenities: ["Wi-Fi"] },
    { number: "103", name: "Simple Interior", type: "SINGLE", capacity: 2, pricePerNight: 130, amenities: ["Wi-Fi"], isActive: false, description: "En mantenimiento" },
    { number: "201", name: "Doble Superior", type: "DOUBLE", capacity: 3, pricePerNight: 275.5, amenities: ["Wi-Fi", "TV", "Aire acondicionado", "Minibar"] },
    { number: "202", name: "Doble Vista al Mar", type: "DOUBLE", capacity: 2, pricePerNight: 320, amenities: ["Wi-Fi", "TV", "Aire acondicionado", "Vista al mar"] },
    { number: "301", name: "Suite Presidencial", type: "SUITE", capacity: 4, pricePerNight: 480, amenities: ["Wi-Fi", "TV", "Aire acondicionado", "Minibar", "Jacuzzi", "Vista al mar"] },
    { number: "401", name: "Familiar Terraza", type: "FAMILY", capacity: 6, pricePerNight: 390, amenities: ["Wi-Fi", "TV", "Aire acondicionado"] },
  ] as const;

  const created = await Promise.all(
    rooms.map(({ amenities, ...room }) =>
      prisma.room.create({
        data: { ...room, amenities: { connect: amenities.map((name) => ({ name })) } },
      }),
    ),
  );
  return Object.fromEntries(created.map((room) => [room.number, room]));
}

interface SeedBooking {
  code: string;
  user: User;
  room: Room;
  checkInOffset: number;
  nights: number;
  guests: number;
  status: BookingStatus;
  notes?: string;
}

/** totalAmount = noches × nightlyRate (tarifa de la habitación al reservar). */
function createBooking({ code, user, room, checkInOffset, nights, guests, status, notes }: SeedBooking) {
  const nightlyRate = room.pricePerNight.toNumber();
  return prisma.booking.create({
    data: {
      code,
      userId: user.id,
      roomId: room.id,
      checkIn: day(checkInOffset),
      checkOut: day(checkInOffset + nights),
      guests,
      nightlyRate,
      totalAmount: (Math.round(nightlyRate * 100) * nights) / 100,
      status,
      notes,
    },
  });
}

interface SeedPayment {
  bookingId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  key: string;
  providerRef?: string;
}

function createPayment({ bookingId, amount, method, status, key, providerRef }: SeedPayment) {
  const paid = status === "PAID" || status === "REFUNDED";
  return prisma.payment.create({
    data: {
      bookingId,
      amount,
      method,
      status,
      providerRef,
      idempotencyKey: `seed-${key}`,
      paidAt: paid ? new Date() : null,
    },
  });
}

async function main() {
  // Borra en orden inverso a las claves foráneas.
  await prisma.$transaction([
    prisma.review.deleteMany(),
    prisma.payment.deleteMany(),
    prisma.booking.deleteMany(),
    prisma.room.deleteMany(),
    prisma.amenity.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  const { demo, maria } = await createUsers();
  await createAmenities();
  const rooms = await createRooms();

  // COMPLETED: pagada y con check-out → admite reseña.
  const past = await createBooking({ code: "RES-SEED0001", user: demo, room: rooms["101"], checkInOffset: -20, nights: 3, guests: 2, status: "COMPLETED" });
  await createPayment({ bookingId: past.id, amount: past.totalAmount.toNumber(), method: "YAPE", status: "PAID", key: "0001-1", providerRef: "YAPE-SEED-0001" });
  await prisma.review.create({ data: { bookingId: past.id, userId: demo.id, rating: 5, comment: "Excelente atención y muy limpio." } });

  // CONFIRMED: pagada, estadía futura (la habitación 201 no aparece en esas fechas).
  const upcoming = await createBooking({ code: "RES-SEED0002", user: demo, room: rooms["201"], checkInOffset: 5, nights: 2, guests: 3, status: "CONFIRMED", notes: "Llegada tarde, después de las 22:00" });
  await createPayment({ bookingId: upcoming.id, amount: upcoming.totalAmount.toNumber(), method: "CARD", status: "PAID", key: "0002-1", providerRef: "ch_seed_0002" });

  // PENDING: un pago con tarjeta falló y hay una transferencia por confirmar.
  const pending = await createBooking({ code: "RES-SEED0003", user: maria, room: rooms["301"], checkInOffset: 2, nights: 3, guests: 4, status: "PENDING" });
  await createPayment({ bookingId: pending.id, amount: pending.totalAmount.toNumber(), method: "CARD", status: "FAILED", key: "0003-1", providerRef: "ch_seed_0003" });
  await createPayment({ bookingId: pending.id, amount: pending.totalAmount.toNumber(), method: "TRANSFER", status: "PENDING", key: "0003-2" });

  // CANCELLED: el pago se devolvió; la habitación 202 queda libre en esas fechas.
  const cancelled = await createBooking({ code: "RES-SEED0004", user: maria, room: rooms["202"], checkInOffset: 10, nights: 2, guests: 2, status: "CANCELLED" });
  await createPayment({ bookingId: cancelled.id, amount: cancelled.totalAmount.toNumber(), method: "PLIN", status: "REFUNDED", key: "0004-1", providerRef: "PLIN-SEED-0004" });

  // COMPLETED pagada en efectivo, con reseña.
  const family = await createBooking({ code: "RES-SEED0005", user: maria, room: rooms["401"], checkInOffset: -10, nights: 4, guests: 5, status: "COMPLETED" });
  await createPayment({ bookingId: family.id, amount: family.totalAmount.toNumber(), method: "CASH", status: "PAID", key: "0005-1" });
  await prisma.review.create({ data: { bookingId: family.id, userId: maria.id, rating: 4, comment: "Muy cómoda para la familia." } });

  const counts = {
    usuarios: await prisma.user.count(),
    habitaciones: await prisma.room.count(),
    amenidades: await prisma.amenity.count(),
    reservas: await prisma.booking.count(),
    pagos: await prisma.payment.count(),
    reseñas: await prisma.review.count(),
  };
  console.log("Seed completado:", counts);
  console.log(`Usuario en duro: ${DEMO_USER.email} (id ${DEMO_USER.id}) · contraseña de prueba: ${SEED_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
