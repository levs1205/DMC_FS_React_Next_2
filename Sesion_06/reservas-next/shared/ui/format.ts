const money = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });

/** "2026-11-26" → "26/11/2026" (sin pasar por Date para evitar desfases de zona horaria). */
export function formatDate(isoDate: string): string {
  return isoDate.split("-").reverse().join("/");
}

export function formatMoney(amount: number): string {
  return money.format(amount);
}

export function formatNights(nights: number): string {
  return `${nights} ${nights === 1 ? "noche" : "noches"}`;
}
