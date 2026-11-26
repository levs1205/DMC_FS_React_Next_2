import type { Room } from "../entities/Room";
import type { DateRange } from "../value-objects/DateRange";

/** Puerto: la infraestructura decide de dónde salen los datos (Prisma, memoria, ...). */
export interface AvailabilityRepository {
  /** Habitaciones activas, con capacidad suficiente y sin reservas vigentes que se crucen. */
  findAvailableRooms(range: DateRange, guests: number): Promise<Room[]>;
  findRoomById(id: string): Promise<Room | null>;
}
