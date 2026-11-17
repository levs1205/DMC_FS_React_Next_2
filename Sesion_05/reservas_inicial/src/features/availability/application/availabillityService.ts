import type { AvailabillityRoom } from '../domain/room.tsx'
import type { roomRepository } from '../domain/roomRepository.ts'
import { diffDays } from '../../../shared/util/index.tsx'
import type { DateRange } from '../../../shared/type/dates.tsx'
import { calcularTotal, estaDisponible } from '../domain/rules.ts'

/** Caso de uso: la UI depende de esta abstracción, no de la implementación. */
export interface DisponibilidadService {
  buscarDisponibles(rango: DateRange): Promise<AvailabillityRoom[]>
}

/** Orquesta el repositorio y las reglas del dominio. No conoce React. */
export function crearDisponibilidadService(repo: roomRepository): DisponibilidadService {
  return {
    async buscarDisponibles(rango) {
      const [habitaciones, ocupaciones] = await Promise.all([
        repo.listar(),
        repo.listarOcupaciones(),
      ])
      const nochesDelRango = diffDays(rango.inicio, rango.fin)

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
