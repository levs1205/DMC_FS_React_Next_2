import type { Habitacion } from '../domain/habitacion.ts'
import type { HabitacionRepository } from '../domain/habitacionRepository.ts'
import type { Ocupacion } from '../domain/ocupacion.ts'

type OpcionesMemoria = {
  /** Retardo artificial para simular la red y ver el estado de carga. */
  retardoMs?: number
}

const esperar = (ms: number) =>
  new Promise<void>((resolver) => {
    setTimeout(resolver, ms)
  })

/** Adaptador en memoria que implementa el puerto HabitacionRepository. */
export function crearHabitacionMemoriaRepository(
  habitaciones: readonly Habitacion[],
  ocupaciones: readonly Ocupacion[],
  { retardoMs = 0 }: OpcionesMemoria = {},
): HabitacionRepository {
  return {
    async listar() {
      await esperar(retardoMs)
      return [...habitaciones]
    },
    async listarOcupaciones() {
      await esperar(retardoMs)
      return [...ocupaciones]
    },
  }
}
