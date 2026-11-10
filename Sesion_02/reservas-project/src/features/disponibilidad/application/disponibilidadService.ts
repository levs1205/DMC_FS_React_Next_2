import type { Habitacion } from '../domain/habitacion.ts'
import type { HabitacionRepository } from '../domain/habitacionRepository.ts'
import { noches, type RangoFechas } from '../domain/rangoFechas.ts'
import { calcularTotal, estaDisponible } from '../domain/reglasDisponibilidad.ts'

/** Modelo de lectura que consume la UI: habitación libre + cálculos del rango. */
export type HabitacionDisponible = Habitacion &
  Readonly<{
    noches: number
    total: number
  }>

/** Caso de uso: la UI depende de esta abstracción, no de la implementación. */
export interface DisponibilidadService {
  buscarDisponibles(rango: RangoFechas): Promise<HabitacionDisponible[]>
}

/** Orquesta el repositorio y las reglas del dominio. No conoce React. */
export function crearDisponibilidadService(repo: HabitacionRepository): DisponibilidadService {
  return {
    async buscarDisponibles(rango) {
      const [habitaciones, ocupaciones] = await Promise.all([
        repo.listar(),
        repo.listarOcupaciones(),
      ])
      const nochesDelRango = noches(rango)

      return habitaciones
        .filter((habitacion) => estaDisponible(habitacion, ocupaciones, rango))
        .map((habitacion) => ({
          ...habitacion,
          noches: nochesDelRango,
          total: calcularTotal(habitacion, rango),
        }))
    },
  }
}
