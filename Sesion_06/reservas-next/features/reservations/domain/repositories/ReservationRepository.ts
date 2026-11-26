import type { Reservation } from "../entities/Reservation";

/** Puerto de persistencia de reservas. */
export interface ReservationRepository {
  save(reservation: Reservation): Promise<void>;
  findByUser(userId: string): Promise<Reservation[]>;
  findByIdAndUser(id: string, userId: string): Promise<Reservation | null>;
  delete(id: string): Promise<void>;
}
