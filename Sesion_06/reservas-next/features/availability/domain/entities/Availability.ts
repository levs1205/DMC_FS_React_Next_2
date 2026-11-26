import type { Room } from "./Room";
import type { DateRange } from "../value-objects/DateRange";

/** Una habitación para un rango de fechas, con el precio de la estadía. */
export class Availability {
  constructor(
    readonly room: Room,
    readonly range: DateRange,
  ) {}

  get nights(): number {
    return this.range.nights;
  }

  /** totalAmount = noches × tarifa por noche (se calcula en céntimos para no perder precisión). */
  get total(): number {
    return (Math.round(this.room.pricePerNight * 100) * this.nights) / 100;
  }
}
