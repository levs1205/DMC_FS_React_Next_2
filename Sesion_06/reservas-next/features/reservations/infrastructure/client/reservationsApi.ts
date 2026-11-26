import { apiClient } from "@/shared/infrastructure/client/apiClient";
import type { CreateReservationInput, ReservationDTO } from "../../application/dto/ReservationDTO";

export function createReservation(input: CreateReservationInput) {
  return apiClient.post<ReservationDTO>("/api/reservations", input);
}
