// Columnas @db.Date: Prisma las representa como Date a medianoche UTC.

/** "2026-11-26" → Date 2026-11-26T00:00:00Z */
export function toDbDate(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00.000Z`);
}

/** Date 2026-11-26T00:00:00Z → "2026-11-26" */
export function fromDbDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
