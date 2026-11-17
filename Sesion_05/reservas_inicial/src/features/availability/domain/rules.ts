import type { DateRange } from "../../../shared/type/dates"
import { diffDays } from "../../../shared/util"
import type { Ocupacion, Room } from "./room"

export function calcularTotal(habitacion: Room, rango: DateRange): number {
  const total = habitacion.precioPorNoche * diffDays(rango.inicio, rango.fin)  //5.236
  return Math.round(total * 100) / 100 // 523.6 --> 524 --> 5.24
}

/**
 * Hay cruce si la ocupación empieza antes de que termine el rango
 * y termina después de que empiece. El día de salida queda libre.
 * (Las fechas YYYY-MM-DD se pueden comparar como texto.)
 */
function seCruza(ocupacion: Ocupacion, rango: DateRange): boolean {
  return ocupacion.inicio < rango.fin && ocupacion.fin > rango.inicio
}

export function estaDisponible(
  habitacion: Room,
  ocupaciones: readonly Ocupacion[],
  rango: DateRange,
): boolean {
  return !ocupaciones.some(
    (ocupacion) => ocupacion.habitacionId === habitacion.id && seCruza(ocupacion, rango),
  )
}