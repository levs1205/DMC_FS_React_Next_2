import { mockDb } from "@/shared/infrastructure/db/mockDb";
import { availabilityRepository } from "@/features/availability/infrastructure/container";
import { InMemoryReservationRepository } from "./persistence/InMemoryReservationRepository";
import { CreateReservation } from "../application/use-cases/CreateReservation";
import { ListReservations } from "../application/use-cases/ListReservations";
import { GetReservation } from "../application/use-cases/GetReservation";
import { CancelReservation } from "../application/use-cases/CancelReservation";
import { ReservationsController } from "../api/reservations.controller";

const reservationRepository = new InMemoryReservationRepository(mockDb);

export const reservationsController = new ReservationsController({
  create: new CreateReservation(availabilityRepository, reservationRepository),
  list: new ListReservations(reservationRepository),
  get: new GetReservation(reservationRepository),
  cancel: new CancelReservation(reservationRepository),
});
