import { DomainError } from "@/shared/domain/DomainError";
import type { ReservationRepository } from "../../domain/repositories/ReservationRepository";
import { toReservationDTO, type ReservationDTO } from "../dto/ReservationDTO";

/** Cancela la reserva (cambia su estado, no la borra) y libera la habitación. */
export class CancelReservation {
  constructor(private readonly reservations: ReservationRepository) {}

  async execute(userId: string, code: string): Promise<ReservationDTO> {
    const reservation = await this.reservations.findByCodeAndUser(code, userId);

    if (!reservation) {
      throw new DomainError("Reserva no encontrada", "NOT_FOUND");
    }

    reservation.cancel();
    await this.reservations.updateStatus(reservation);
    return toReservationDTO(reservation);
  }
}
