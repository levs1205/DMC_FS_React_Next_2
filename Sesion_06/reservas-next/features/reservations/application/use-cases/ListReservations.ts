import type { ReservationRepository } from "../../domain/repositories/ReservationRepository";
import { toReservationDTO, type ReservationDTO } from "../dto/ReservationDTO";

export class ListReservations {
  constructor(private readonly reservations: ReservationRepository) {}

  async execute(userId: string): Promise<ReservationDTO[]> {
    const reservations = await this.reservations.findByUser(userId);
    return reservations.map(toReservationDTO);
  }
}
