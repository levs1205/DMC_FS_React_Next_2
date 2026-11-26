import type { PrismaClient } from "@/generated/prisma/client";
import { AvailabilityMapper } from "@/features/availability/infrastructure/persistence/AvailabilityMapper";
import type { Reservation } from "../../domain/entities/Reservation";
import type { ReservationRepository } from "../../domain/repositories/ReservationRepository";
import { ReservationMapper } from "./ReservationMapper";

const withRoomName = { room: { select: { name: true } } } as const;

export class PrismaReservationRepository implements ReservationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createIfRoomAvailable(reservation: Reservation): Promise<boolean> {
    return this.prisma.$transaction(async (tx) => {
      // Bloquea la fila de la habitación hasta el fin de la transacción: dos reservas
      // simultáneas de la misma habitación se procesan una detrás de otra.
      await tx.$queryRaw`SELECT id FROM rooms WHERE id = ${reservation.roomId} FOR UPDATE`;

      const overlapping = await tx.booking.count({
        where: {
          roomId: reservation.roomId,
          ...AvailabilityMapper.overlappingBookings(reservation.range),
        },
      });
      if (overlapping > 0) return false;

      await tx.booking.create({ data: ReservationMapper.toCreateData(reservation) });
      return true;
    });
  }

  async updateStatus(reservation: Reservation): Promise<void> {
    await this.prisma.booking.update({
      where: { code: reservation.code },
      data: { status: reservation.status },
    });
  }

  async findByUser(userId: string): Promise<Reservation[]> {
    const bookings = await this.prisma.booking.findMany({
      where: { userId },
      include: withRoomName,
      orderBy: { checkIn: "desc" },
    });
    return bookings.map(ReservationMapper.toDomain);
  }

  async findByCodeAndUser(code: string, userId: string): Promise<Reservation | null> {
    const booking = await this.prisma.booking.findFirst({
      where: { code, userId },
      include: withRoomName,
    });
    return booking ? ReservationMapper.toDomain(booking) : null;
  }
}
