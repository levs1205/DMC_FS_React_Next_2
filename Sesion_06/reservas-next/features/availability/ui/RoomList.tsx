import { formatDate, formatNights } from "@/shared/ui/format";
import type { SearchAvailabilityOutput } from "../application/dto/SearchAvailabilityDTO";
import { RoomCard } from "./RoomCard";

interface RoomListProps {
  result: SearchAvailabilityOutput;
  selectedRoomId: string | null;
  onSelect: (roomId: string) => void;
}

export function RoomList({ result, selectedRoomId, onSelect }: RoomListProps) {
  return (
    <section aria-labelledby="resultados-titulo">
      <h2 id="resultados-titulo" className="resultados__titulo">
        Del {formatDate(result.startDate)} al {formatDate(result.endDate)} ·{" "}
        {formatNights(result.nights)}
      </h2>

      {result.rooms.length === 0 ? (
        <p className="mensaje">No hay habitaciones disponibles para estas fechas.</p>
      ) : (
        <ul className="lista grilla-habitaciones">
          {result.rooms.map((room) => (
            <li key={room.roomId}>
              <RoomCard
                room={room}
                selected={room.roomId === selectedRoomId}
                onSelect={onSelect}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
