export type RoomType = "Simple" | "Doble" | "Suite";

export interface Room {
  readonly id: string;
  readonly name: string;
  readonly type: RoomType;
  readonly capacity: number;
  readonly pricePerNight: number;
}
