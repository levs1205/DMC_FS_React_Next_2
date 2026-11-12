/** Entidad Habitacion (inmutable). */
export type RoomType = "simple" | "doble" | "suite";

export type Room = Readonly<{
  id: string;
  nombre: string;
  tipo: RoomType;
  capacidad: number;
  /** Precio por noche en soles (PEN). */
  precioPorNoche: number;
}>;

export type AvailabillityRoom = Room &
  Readonly<{
    noches: number;
    total: number;
  }>;
