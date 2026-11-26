import { DomainError } from "@/shared/domain/DomainError";

export const MAX_NIGHTS = 15;
export const MAX_DAYS_IN_ADVANCE = 365;

const MS_PER_DAY = 86_400_000;

/**
 * Rango de fechas de calendario (AAAA-MM-DD). El día de fin es el check-out,
 * por eso no cuenta como noche y otra estadía puede empezar ese mismo día.
 */
export class DateRange {
  private constructor(
    readonly start: string,
    readonly end: string,
  ) {}

  /** Invariantes de cualquier rango (también para reservas ya guardadas). */
  static create(start: string, end: string): DateRange {
    if (toDayNumber(end) <= toDayNumber(start)) {
      throw new DomainError("La fecha de fin debe ser posterior a la fecha de inicio");
    }
    return new DateRange(start, end);
  }

  /** Reglas de negocio para buscar o reservar una nueva estadía. */
  static forNewStay(start: string, end: string, today: string = todayIso()): DateRange {
    const range = DateRange.create(start, end);
    const daysFromToday = toDayNumber(start) - toDayNumber(today);

    if (daysFromToday < 0) {
      throw new DomainError("La fecha de inicio no puede ser anterior a hoy");
    }
    if (daysFromToday > MAX_DAYS_IN_ADVANCE) {
      throw new DomainError(`Solo se puede reservar con hasta ${MAX_DAYS_IN_ADVANCE} días de anticipación`);
    }
    if (range.nights > MAX_NIGHTS) {
      throw new DomainError(`La estadía no puede superar las ${MAX_NIGHTS} noches`);
    }
    return range;
  }

  get nights(): number {
    return toDayNumber(this.end) - toDayNumber(this.start);
  }

  /** Las fechas ISO (AAAA-MM-DD) se pueden comparar como texto. */
  overlaps(other: DateRange): boolean {
    return this.start < other.end && other.start < this.end;
  }
}

function toDayNumber(isoDate: string): number {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const isRealDate =
    /^\d{4}-\d{2}-\d{2}$/.test(isoDate) &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;

  if (!isRealDate) {
    throw new DomainError(`La fecha ${isoDate} no es válida`);
  }
  return date.getTime() / MS_PER_DAY;
}

/** Fecha de hoy según el reloj local del servidor (el del hotel). */
function todayIso(): string {
  const now = new Date();
  return [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    .map((part) => String(part).padStart(2, "0"))
    .join("-");
}
