import { DomainError } from "@/shared/domain/DomainError";
import type { ReservationRepository } from "../../domain/repositories/ReservationRepository";

export class CancelReservation {
  constructor(private readonly reservations: ReservationRepository) {}

  async execute(userId: string, id: string): Promise<void> {
    const reservation = await this.reservations.findByIdAndUser(id, userId);

    if (!reservation) {
      throw new DomainError("Reserva no encontrada", "NOT_FOUND");
    }
    await this.reservations.delete(reservation.id);
  }
}
