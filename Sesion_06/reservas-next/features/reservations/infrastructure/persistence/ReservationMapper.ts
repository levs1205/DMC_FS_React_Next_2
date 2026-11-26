import type { Booking, Prisma } from "@/generated/prisma/client";
import { fromDbDate, toDbDate } from "@/shared/infrastructure/db/dbDate";
import { DateRange } from "@/features/availability/domain/value-objects/DateRange";
import { Reservation } from "../../domain/entities/Reservation";

export type BookingWithRoom = Booking & { room: { name: string } };

/** Traducción Prisma (Booking) ⇄ dominio (Reservation). */
export const ReservationMapper = {
  toDomain(booking: BookingWithRoom): Reservation {
    return Reservation.restore({
      code: booking.code,
      userId: booking.userId,
      roomId: booking.roomId,
      roomName: booking.room.name,
      range: DateRange.create(fromDbDate(booking.checkIn), fromDbDate(booking.checkOut)),
      guests: booking.guests,
      nightlyRate: booking.nightlyRate.toNumber(),
      totalAmount: booking.totalAmount.toNumber(),
      status: booking.status,
      notes: booking.notes,
      createdAt: booking.createdAt,
    });
  },

  toCreateData(reservation: Reservation): Prisma.BookingUncheckedCreateInput {
    return {
      code: reservation.code,
      userId: reservation.userId,
      roomId: reservation.roomId,
      checkIn: toDbDate(reservation.range.start),
      checkOut: toDbDate(reservation.range.end),
      guests: reservation.guests,
      nightlyRate: reservation.nightlyRate,
      totalAmount: reservation.totalAmount,
      status: reservation.status,
      notes: reservation.notes,
      createdAt: reservation.createdAt,
    };
  },
};
