import type { Reservation } from "../../domain/entities/Reservation";

export interface CreateReservationInput {
  roomId: string;
  startDate: string;
  endDate: string;
}

export interface ReservationDTO {
  id: string;
  roomId: string;
  roomName: string;
  startDate: string;
  endDate: string;
  nights: number;
  total: number;
  createdAt: string;
}

export function toReservationDTO(reservation: Reservation): ReservationDTO {
  return {
    id: reservation.id,
    roomId: reservation.roomId,
    roomName: reservation.roomName,
    startDate: reservation.range.start,
    endDate: reservation.range.end,
    nights: reservation.nights,
    total: reservation.total,
    createdAt: reservation.createdAt.toISOString(),
  };
}
