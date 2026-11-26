import type { Availability } from "@/features/availability/domain/entities/Availability";
import type { DateRange } from "@/features/availability/domain/value-objects/DateRange";

export interface ReservationProps {
  id: string;
  userId: string;
  roomId: string;
  roomName: string;
  range: DateRange;
  total: number;
  createdAt: Date;
}

/** Una reserva corresponde a una sola habitación para un rango de fechas. */
export class Reservation {
  readonly id: string;
  readonly userId: string;
  readonly roomId: string;
  readonly roomName: string;
  readonly range: DateRange;
  readonly total: number;
  readonly createdAt: Date;

  private constructor(props: ReservationProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.roomId = props.roomId;
    this.roomName = props.roomName;
    this.range = props.range;
    this.total = props.total;
    this.createdAt = props.createdAt;
  }

  static create(userId: string, availability: Availability): Reservation {
    return new Reservation({
      id: `RES-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      userId,
      roomId: availability.room.id,
      roomName: availability.room.name,
      range: availability.range,
      total: availability.total,
      createdAt: new Date(),
    });
  }

  /** Reconstruye una reserva ya guardada. */
  static restore(props: ReservationProps): Reservation {
    return new Reservation(props);
  }

  get nights(): number {
    return this.range.nights;
  }
}
