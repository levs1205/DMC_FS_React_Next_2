/** Entidad Habitacion (inmutable). */
export type TipoHabitacion = 'simple' | 'doble' | 'suite'

export type Habitacion = Readonly<{
  id: string
  nombre: string
  tipo: TipoHabitacion
  capacidad: number
  /** Precio por noche en soles (PEN). */
  precioPorNoche: number
}>
