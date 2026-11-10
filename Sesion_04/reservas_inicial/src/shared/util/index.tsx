/**
 * Suma o resta días a una fecha.
 * @param date  Fecha base (Date, string ISO)
 * @param days  Días a sumar (positivo) o restar (negativo)
 * @returns     Nueva instancia de Date
 */
export function addDays(days: number, date?: Date | string): Date {
  const result = date ? new Date(date) : new Date();

  if (isNaN(result.getTime())) {
    throw new Error(`Fecha inválida: ${date}`);
  }
  if (!Number.isInteger(days)) {
    throw new Error(`"days" debe ser un entero: ${days}`);
  }

  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Obtiene la fecha en formato corto (YYYY-MM-DD).
 * @param date  Fecha base (Date, string ISO)
 * @returns     Nueva instancia de Date
 */
export function getShortDate(dateIn?: Date | string): string {
  const date = dateIn ? new Date(dateIn) : new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
