import { DomainError } from "@/shared/domain/DomainError";
import type { Availability } from "@/features/availability/domain/entities/Availability";
import type { DateRange } from "@/features/availability/domain/value-objects/DateRange";
import {
  canTransition,
  STATUS_LABEL,
  type ReservationStatus,
} from "../value-objects/ReservationStatus";

export interface ReservationProps {
  code: string;
  userId: string;
  roomId: string;
  roomName: string;
  range: DateRange;
  guests: number;
  nightlyRate: number;
  totalAmount: number;
  status: ReservationStatus;
  notes: string | null;
  createdAt: Date;
}

interface CreateReservationProps {
  userId: string;
  availability: Availability;
  guests: number;
  notes?: string | null;
}

/** Una reserva es de una sola habitación. Se identifica por su código (RES-XXXXXXXX). */
export class Reservation {
  readonly code: string;
  readonly userId: string;
  readonly roomId: string;
  readonly roomName: string;
  readonly range: DateRange;
  readonly guests: number;
  readonly nightlyRate: number;
  readonly totalAmount: number;
  readonly notes: string | null;
  readonly createdAt: Date;
  private _status: ReservationStatus;

  private constructor(props: ReservationProps) {
    this.code = props.code;
    this.userId = props.userId;
    this.roomId = props.roomId;
    this.roomName = props.roomName;
    this.range = props.range;
    this.guests = props.guests;
    this.nightlyRate = props.nightlyRate;
    this.totalAmount = props.totalAmount;
    this.notes = props.notes;
    this.createdAt = props.createdAt;
    this._status = props.status;
  }

  static create({ userId, availability, guests, notes = null }: CreateReservationProps): Reservation {
    const { room } = availability;

    if (!room.isActive) {
      throw new DomainError("La habitación no está habilitada para reservas", "CONFLICT");
    }
    if (guests < 1) {
      throw new DomainError("La reserva debe tener al menos 1 huésped");
    }
    if (guests > room.capacity) {
      const max = room.capacity === 1 ? "1 huésped" : `${room.capacity} huéspedes`;
      throw new DomainError(`La habitación ${room.name} admite como máximo ${max}`);
    }

    return new Reservation({
      code: `RES-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      userId,
      roomId: room.id,
      roomName: room.name,
      range: availability.range,
      guests,
      nightlyRate: room.pricePerNight, // se congela la tarifa del día en que se reserva
      totalAmount: availability.total,
      status: "PENDING",
      notes,
      createdAt: new Date(),
    });
  }

  /** Reconstruye una reserva ya guardada. */
  static restore(props: ReservationProps): Reservation {
    return new Reservation(props);
  }

  get status(): ReservationStatus {
    return this._status;
  }

  get nights(): number {
    return this.range.nights;
  }

  /** Pago registrado. */
  confirm(): void {
    this.transitionTo("CONFIRMED");
  }

  /** Check-out realizado. */
  complete(): void {
    this.transitionTo("COMPLETED");
  }

  cancel(): void {
    this.transitionTo("CANCELLED");
  }

  private transitionTo(next: ReservationStatus): void {
    if (!canTransition(this._status, next)) {
      throw new DomainError(
        `Una reserva ${STATUS_LABEL[this._status]} no puede quedar ${STATUS_LABEL[next]}`,
        "CONFLICT",
      );
    }
    this._status = next;
  }
}
