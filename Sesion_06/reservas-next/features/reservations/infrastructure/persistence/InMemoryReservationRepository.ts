import type { MockDb, ReservationRecord } from "@/shared/infrastructure/db/mockDb";
import { DateRange } from "@/features/availability/domain/value-objects/DateRange";
import { Reservation } from "../../domain/entities/Reservation";
import type { ReservationRepository } from "../../domain/repositories/ReservationRepository";

/** Implementación temporal del puerto con datos mock (luego: PrismaReservationRepository). */
export class InMemoryReservationRepository implements ReservationRepository {
  constructor(private readonly db: MockDb) {}

  async save(reservation: Reservation): Promise<void> {
    this.db.reservations.push(toRecord(reservation));
  }

  async findByUser(userId: string): Promise<Reservation[]> {
    return this.db.reservations.filter((record) => record.userId === userId).map(toDomain);
  }

  async findByIdAndUser(id: string, userId: string): Promise<Reservation | null> {
    const record = this.db.reservations.find((r) => r.id === id && r.userId === userId);
    return record ? toDomain(record) : null;
  }

  async delete(id: string): Promise<void> {
    const index = this.db.reservations.findIndex((record) => record.id === id);
    if (index !== -1) this.db.reservations.splice(index, 1);
  }
}

function toRecord(reservation: Reservation): ReservationRecord {
  return {
    id: reservation.id,
    userId: reservation.userId,
    roomId: reservation.roomId,
    roomName: reservation.roomName,
    startDate: reservation.range.start,
    endDate: reservation.range.end,
    total: reservation.total,
    createdAt: reservation.createdAt.toISOString(),
  };
}

function toDomain(record: ReservationRecord): Reservation {
  return Reservation.restore({
    id: record.id,
    userId: record.userId,
    roomId: record.roomId,
    roomName: record.roomName,
    range: DateRange.create(record.startDate, record.endDate),
    total: record.total,
    createdAt: new Date(record.createdAt),
  });
}
