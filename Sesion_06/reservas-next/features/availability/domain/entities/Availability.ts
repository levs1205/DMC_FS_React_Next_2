import type { Room } from "./Room";
import type { DateRange } from "../value-objects/DateRange";

/** Una habitación libre para un rango de fechas, con el precio de la estadía. */
export class Availability {
  constructor(
    readonly room: Room,
    readonly range: DateRange,
  ) {}

  get nights(): number {
    return this.range.nights;
  }

  get total(): number {
    return Math.round(this.room.pricePerNight * this.nights * 100) / 100;
  }
}
