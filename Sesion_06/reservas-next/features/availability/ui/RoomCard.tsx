import { formatMoney } from "@/shared/ui/format";
import type { RoomType } from "../domain/entities/Room";
import type { AvailableRoomDTO } from "../application/dto/SearchAvailabilityDTO";

const ROOM_TYPE_LABEL: Record<RoomType, string> = {
  SINGLE: "Simple",
  DOUBLE: "Doble",
  SUITE: "Suite",
  FAMILY: "Familiar",
};

interface RoomCardProps {
  room: AvailableRoomDTO;
  selected: boolean;
  onSelect: (roomId: string) => void;
}

export function RoomCard({ room, selected, onSelect }: RoomCardProps) {
  return (
    <article className={selected ? "tarjeta tarjeta--seleccionada" : "tarjeta"}>
      <header className="tarjeta__encabezado">
        <h3 className="tarjeta__nombre">{room.name}</h3>
        <span className="tarjeta__tipo">{ROOM_TYPE_LABEL[room.type]}</span>
      </header>

      {room.amenities.length > 0 && (
        <p className="tarjeta__amenidades">{room.amenities.join(" · ")}</p>
      )}

      <dl className="tarjeta__datos">
        <div>
          <dt>Habitación</dt>
          <dd>N.° {room.number}</dd>
        </div>
        <div>
          <dt>Capacidad</dt>
          <dd>{room.capacity} personas</dd>
        </div>
        <div>
          <dt>Precio por noche</dt>
          <dd>{formatMoney(room.pricePerNight)}</dd>
        </div>
        <div>
          <dt>Noches</dt>
          <dd>{room.nights}</dd>
        </div>
      </dl>

      <div className="tarjeta__total">
        <span>Total</span>
        <strong>{formatMoney(room.total)}</strong>
      </div>

      <button
        type="button"
        className="boton boton--secundario"
        aria-pressed={selected}
        onClick={() => onSelect(room.roomId)}
      >
        {selected ? "Seleccionada ✓" : "Elegir"}
      </button>
    </article>
  );
}
