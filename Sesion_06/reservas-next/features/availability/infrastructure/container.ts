import { prisma } from "@/shared/infrastructure/db/prisma";
import { PrismaAvailabilityRepository } from "./persistence/PrismaAvailabilityRepository";
import { SearchAvailability } from "../application/use-cases/SearchAvailability";
import { AvailabilityController } from "../api/availability.controller";

// Composición: único lugar donde se elige la implementación del repositorio.
export const availabilityRepository = new PrismaAvailabilityRepository(prisma);

export const availabilityController = new AvailabilityController(
  new SearchAvailability(availabilityRepository),
);
