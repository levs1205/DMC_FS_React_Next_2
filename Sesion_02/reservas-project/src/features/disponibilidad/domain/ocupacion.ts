import type { FechaCalendario } from './rangoFechas.ts'
import type { Habitacion } from './habitacion.ts'

/**
 * Periodo en que una habitación ya está reservada.
 * `fin` es el día de salida: ese día la habitación vuelve a estar libre.
 */
export type Ocupacion = Readonly<{
  habitacionId: Habitacion['id']
  inicio: FechaCalendario
  fin: FechaCalendario
}>
