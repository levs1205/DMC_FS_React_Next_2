import type { Habitacion } from '../features/disponibilidad/domain/habitacion.ts'
import type { Ocupacion } from '../features/disponibilidad/domain/ocupacion.ts'
import { aFechaCalendario, sumarDias } from '../features/disponibilidad/domain/rangoFechas.ts'

export const habitacionesEjemplo: readonly Habitacion[] = [
  { id: 'hab-101', nombre: 'Simple Estándar', tipo: 'simple', capacidad: 1, precioPorNoche: 120 },
  { id: 'hab-102', nombre: 'Simple Vista Jardín', tipo: 'simple', capacidad: 2, precioPorNoche: 155 },
  { id: 'hab-201', nombre: 'Doble Clásica', tipo: 'doble', capacidad: 2, precioPorNoche: 220 },
  { id: 'hab-202', nombre: 'Doble Superior', tipo: 'doble', capacidad: 3, precioPorNoche: 275.5 },
  { id: 'hab-301', nombre: 'Suite Junior', tipo: 'suite', capacidad: 3, precioPorNoche: 390 },
  { id: 'hab-302', nombre: 'Suite Presidencial', tipo: 'suite', capacidad: 4, precioPorNoche: 480 },
]

/** Ocupaciones relativas a "hoy" para que el filtro se note en los próximos 15 días. */
export function crearOcupacionesEjemplo(hoy: Date): Ocupacion[] {
  const base = aFechaCalendario(hoy)
  const ocupar = (habitacionId: string, desde: number, hasta: number): Ocupacion => ({
    habitacionId,
    inicio: sumarDias(base, desde),
    fin: sumarDias(base, hasta),
  })

  return [
    ocupar('hab-101', 1, 4),
    ocupar('hab-201', 0, 3),
    ocupar('hab-201', 7, 10),
    ocupar('hab-202', 10, 15),
    ocupar('hab-301', 2, 6),
    ocupar('hab-302', 5, 12),
  ]
}
