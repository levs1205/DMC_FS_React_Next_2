import { formatMoney } from "@/shared/ui/format";
import type { AvailableRoomDTO } from "../application/dto/SearchAvailabilityDTO";

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
        <span className="tarjeta__tipo">{room.type}</span>
      </header>

      <dl className="tarjeta__datos">
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
