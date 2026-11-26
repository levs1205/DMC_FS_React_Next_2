import { mockDb } from "@/shared/infrastructure/db/mockDb";
import { InMemoryAvailabilityRepository } from "./persistence/InMemoryAvailabilityRepository";
import { SearchAvailability } from "../application/use-cases/SearchAvailability";
import { AvailabilityController } from "../api/availability.controller";

// Composición: único lugar donde se elige la implementación del repositorio.
export const availabilityRepository = new InMemoryAvailabilityRepository(mockDb);

export const availabilityController = new AvailabilityController(
  new SearchAvailability(availabilityRepository),
);
