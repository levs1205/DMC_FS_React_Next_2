import type { Room } from "../entities/Room";
import type { DateRange } from "../value-objects/DateRange";

/** Puerto: la infraestructura decide de dónde salen los datos (memoria, Prisma, ...). */
export interface AvailabilityRepository {
  findAvailableRooms(range: DateRange): Promise<Room[]>;
}
