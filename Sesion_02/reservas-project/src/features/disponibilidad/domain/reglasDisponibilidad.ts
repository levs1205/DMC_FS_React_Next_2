import type { Habitacion } from './habitacion.ts'
import type { Ocupacion } from './ocupacion.ts'
import { noches, type RangoFechas } from './rangoFechas.ts'

/** Total a pagar por la habitación durante todo el rango. */
export function calcularTotal(habitacion: Habitacion, rango: RangoFechas): number {
  const total = habitacion.precioPorNoche * noches(rango)
  return Math.round(total * 100) / 100
}

/**
 * Hay cruce si la ocupación empieza antes de que termine el rango
 * y termina después de que empiece. El día de salida queda libre.
 * (Las fechas YYYY-MM-DD se pueden comparar como texto.)
 */
function seCruza(ocupacion: Ocupacion, rango: RangoFechas): boolean {
  return ocupacion.inicio < rango.fin && ocupacion.fin > rango.inicio
}

export function estaDisponible(
  habitacion: Habitacion,
  ocupaciones: readonly Ocupacion[],
  rango: RangoFechas,
): boolean {
  return !ocupaciones.some(
    (ocupacion) => ocupacion.habitacionId === habitacion.id && seCruza(ocupacion, rango),
  )
}
