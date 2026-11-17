import type { Room, Ocupacion } from './room.tsx'

/**
 * Puerto (DIP): el dominio define QUÉ necesita; la infraestructura decide CÓMO
 * (memoria, API REST, localStorage...).
 */
export interface roomRepository {
  listar(): Promise<Room[]>
  listarOcupaciones(): Promise<Ocupacion[]>
}
