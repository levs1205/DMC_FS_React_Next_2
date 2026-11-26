import type { MockDb } from "@/shared/infrastructure/db/mockDb";
import type { Room, RoomType } from "../../domain/entities/Room";
import { DateRange } from "../../domain/value-objects/DateRange";
import type { AvailabilityRepository } from "../../domain/repositories/AvailabilityRepository";

/** Implementación temporal del puerto con datos mock (luego: PrismaAvailabilityRepository). */
export class InMemoryAvailabilityRepository implements AvailabilityRepository {
  constructor(private readonly db: MockDb) {}

  async findAvailableRooms(range: DateRange): Promise<Room[]> {
    const occupiedRoomIds = new Set(
      this.db.reservations
        .filter((reservation) =>
          DateRange.create(reservation.startDate, reservation.endDate).overlaps(range),
        )
        .map((reservation) => reservation.roomId),
    );

    return this.db.rooms
      .filter((room) => !occupiedRoomIds.has(room.id))
      .map((room) => ({ ...room, type: room.type as RoomType }));
  }
}
