import { DomainError } from "@/shared/domain/DomainError";
import { Availability } from "@/features/availability/domain/entities/Availability";
import { DateRange } from "@/features/availability/domain/value-objects/DateRange";
import type { AvailabilityRepository } from "@/features/availability/domain/repositories/AvailabilityRepository";
import { Reservation } from "../../domain/entities/Reservation";
import type { ReservationRepository } from "../../domain/repositories/ReservationRepository";
import { toReservationDTO, type CreateReservationInput, type ReservationDTO } from "../dto/ReservationDTO";

export class CreateReservation {
  constructor(
    private readonly availability: AvailabilityRepository,
    private readonly reservations: ReservationRepository,
  ) {}

  async execute(userId: string, input: CreateReservationInput): Promise<ReservationDTO> {
    const range = DateRange.forNewStay(input.startDate, input.endDate);
    const availableRooms = await this.availability.findAvailableRooms(range);
    const room = availableRooms.find(({ id }) => id === input.roomId);

    if (!room) {
      throw new DomainError("La habitación no está disponible para las fechas seleccionadas", "CONFLICT");
    }

    const reservation = Reservation.create(userId, new Availability(room, range));
    await this.reservations.save(reservation);
    return toReservationDTO(reservation);
  }
}
