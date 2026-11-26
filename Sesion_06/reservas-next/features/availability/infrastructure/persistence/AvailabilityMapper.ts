import type { Amenity, Prisma, Room as RoomModel } from "@/generated/prisma/client";
import { toDbDate } from "@/shared/infrastructure/db/dbDate";
import type { Room } from "../../domain/entities/Room";
import type { DateRange } from "../../domain/value-objects/DateRange";

export type RoomWithAmenities = RoomModel & { amenities: Amenity[] };

/** Traducción Prisma ⇄ dominio. */
export const AvailabilityMapper = {
  toRoom(model: RoomWithAmenities): Room {
    return {
      id: model.id,
      number: model.number,
      name: model.name,
      description: model.description,
      type: model.type,
      capacity: model.capacity,
      pricePerNight: model.pricePerNight.toNumber(),
      isActive: model.isActive,
      amenities: model.amenities.map((amenity) => amenity.name),
    };
  },

  /**
   * Reservas vigentes (no canceladas) que se cruzan con el rango.
   * Mismo criterio que DateRange.overlaps: el día de check-out queda libre.
   */
  overlappingBookings(range: DateRange): Prisma.BookingWhereInput {
    return {
      status: { not: "CANCELLED" },
      checkIn: { lt: toDbDate(range.end) },
      checkOut: { gt: toDbDate(range.start) },
    };
  },
};
