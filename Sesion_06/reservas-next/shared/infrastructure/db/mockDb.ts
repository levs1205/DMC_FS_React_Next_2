/**
 * Base de datos en memoria para probar el flujo sin Prisma.
 * Los registros imitan las futuras tablas de prisma/schema.prisma.
 */

export interface RoomRecord {
  id: string;
  name: string;
  type: string;
  capacity: number;
  pricePerNight: number;
}

export interface ReservationRecord {
  id: string;
  userId: string;
  roomId: string;
  roomName: string;
  startDate: string;
  endDate: string;
  total: number;
  createdAt: string;
}

export interface MockDb {
  rooms: RoomRecord[];
  reservations: ReservationRecord[];
}

function seed(): MockDb {
  return {
    rooms: [
      { id: "room-101", name: "Simple Vista Jardín", type: "Simple", capacity: 2, pricePerNight: 155 },
      { id: "room-201", name: "Doble Superior", type: "Doble", capacity: 3, pricePerNight: 275.5 },
      { id: "room-301", name: "Suite Presidencial", type: "Suite", capacity: 4, pricePerNight: 480 },
    ],
    reservations: [
      // Reserva de otro huésped para comprobar que la Suite no aparece en esas fechas.
      {
        id: "RES-SEED0001",
        userId: "user-otro",
        roomId: "room-301",
        roomName: "Suite Presidencial",
        startDate: "2026-12-24",
        endDate: "2026-12-27",
        total: 1440,
        createdAt: "2026-11-01T10:00:00.000Z",
      },
    ],
  };
}

// Singleton en globalThis: cada Route Handler se empaqueta por separado y el
// hot reload recarga módulos; así todos comparten los mismos datos (igual que con PrismaClient).
const globalForDb = globalThis as unknown as { mockDb?: MockDb };

export const mockDb = (globalForDb.mockDb ??= seed());
