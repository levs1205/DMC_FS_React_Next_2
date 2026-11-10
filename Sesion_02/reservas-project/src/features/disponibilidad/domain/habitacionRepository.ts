import type { Habitacion } from './habitacion.ts'
import type { Ocupacion } from './ocupacion.ts'

/**
 * Puerto (DIP): el dominio define QUÉ necesita; la infraestructura decide CÓMO
 * (memoria, API REST, localStorage...).
 */
export interface HabitacionRepository {
  listar(): Promise<Habitacion[]>
  listarOcupaciones(): Promise<Ocupacion[]>
}
