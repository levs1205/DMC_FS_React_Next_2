export type ReservationStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

/**
 * Transiciones permitidas:
 *   PENDING ──pago──▶ CONFIRMED ──check-out──▶ COMPLETED
 *   PENDING | CONFIRMED ──▶ CANCELLED
 */
const TRANSITIONS: Record<ReservationStatus, readonly ReservationStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export const STATUS_LABEL: Record<ReservationStatus, string> = {
  PENDING: "pendiente",
  CONFIRMED: "confirmada",
  COMPLETED: "completada",
  CANCELLED: "cancelada",
};

export function canTransition(from: ReservationStatus, to: ReservationStatus): boolean {
  return TRANSITIONS[from].includes(to);
}
