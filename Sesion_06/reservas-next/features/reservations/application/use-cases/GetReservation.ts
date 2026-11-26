import { DomainError } from "@/shared/domain/DomainError";
import type { ReservationRepository } from "../../domain/repositories/ReservationRepository";
import { toReservationDTO, type ReservationDTO } from "../dto/ReservationDTO";

export class GetReservation {
  constructor(private readonly reservations: ReservationRepository) {}

  async execute(userId: string, id: string): Promise<ReservationDTO> {
    const reservation = await this.reservations.findByIdAndUser(id, userId);

    if (!reservation) {
      throw new DomainError("Reserva no encontrada", "NOT_FOUND");
    }
    return toReservationDTO(reservation);
  }
}
