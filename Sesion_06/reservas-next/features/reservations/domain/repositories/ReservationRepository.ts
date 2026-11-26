import type { Reservation } from "../entities/Reservation";

/** Puerto de persistencia de reservas. */
export interface ReservationRepository {
  /**
   * Guarda la reserva solo si la habitación sigue libre en esas fechas.
   * La comprobación y el guardado deben ser atómicos (sin reservas cruzadas).
   * Devuelve false si otra reserva vigente se cruza.
   */
  createIfRoomAvailable(reservation: Reservation): Promise<boolean>;
  updateStatus(reservation: Reservation): Promise<void>;
  findByUser(userId: string): Promise<Reservation[]>;
  findByCodeAndUser(code: string, userId: string): Promise<Reservation | null>;
}
