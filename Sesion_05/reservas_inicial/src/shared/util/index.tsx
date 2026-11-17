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

const formatoSoles = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' })

export function formatearSoles(monto: number): string {
  return formatoSoles.format(monto)
}


export function diffDays(start: Date | string, end: Date | string): number {
  const toLocalDate = (v: Date | string): Date => {
    const m = typeof v === 'string' ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(v) : null;
    const d = m ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date(v);
    if (Number.isNaN(d.getTime())) throw new TypeError(`Fecha inválida: ${String(v)}`);
    return d;
  };

  const a = toLocalDate(start);
  const b = toLocalDate(end);

  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return (utcB - utcA) / 86_400_000;
}