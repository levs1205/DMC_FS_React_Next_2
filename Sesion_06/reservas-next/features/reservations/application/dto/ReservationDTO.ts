import type { Reservation } from "../../domain/entities/Reservation";
import type { ReservationStatus } from "../../domain/value-objects/ReservationStatus";

export interface CreateReservationInput {
  roomId: string;
  startDate: string;
  endDate: string;
  guests: number;
  notes?: string;
}

export interface ReservationDTO {
  code: string;
  roomId: string;
  roomName: string;
  startDate: string;
  endDate: string;
  guests: number;
  nights: number;
  nightlyRate: number;
  totalAmount: number;
  status: ReservationStatus;
  notes: string | null;
  createdAt: string;
}

export function toReservationDTO(reservation: Reservation): ReservationDTO {
  return {
    code: reservation.code,
    roomId: reservation.roomId,
    roomName: reservation.roomName,
    startDate: reservation.range.start,
    endDate: reservation.range.end,
    guests: reservation.guests,
    nights: reservation.nights,
    nightlyRate: reservation.nightlyRate,
    totalAmount: reservation.totalAmount,
    status: reservation.status,
    notes: reservation.notes,
    createdAt: reservation.createdAt.toISOString(),
  };
}
