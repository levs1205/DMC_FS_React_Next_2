"use client";

import { SearchForm } from "@/features/availability/ui/SearchForm";
import { RoomList } from "@/features/availability/ui/RoomList";
import { formatDate, formatMoney } from "@/shared/ui/format";
import type { ReservationStatus } from "../domain/value-objects/ReservationStatus";
import { useReservationFlow } from "./useReservationFlow";

const STATUS_LABEL: Record<ReservationStatus, string> = {
  PENDING: "pendiente de pago",
  CONFIRMED: "confirmada",
  COMPLETED: "completada",
  CANCELLED: "cancelada",
};

export function ReservationFlow() {
  const { result, selectedRoomId, confirmation, error, loading, search, selectRoom, reserve } =
    useReservationFlow();

  return (
    <>
      <SearchForm loading={loading} onSearch={search} />

      {error && (
        <p role="alert" className="mensaje mensaje--error">
          {error}
        </p>
      )}

      {confirmation && (
        <p role="status" className="mensaje mensaje--exito">
          Reserva <strong>{confirmation.code}</strong> registrada ({STATUS_LABEL[confirmation.status]}):{" "}
          {confirmation.roomName}, del {formatDate(confirmation.startDate)} al{" "}
          {formatDate(confirmation.endDate)} · Total {formatMoney(confirmation.totalAmount)}
        </p>
      )}

      {result && <RoomList result={result} selectedRoomId={selectedRoomId} onSelect={selectRoom} />}

      {result && result.rooms.length > 0 && (
        <div className="acciones">
          <button
            type="button"
            className="boton boton--primario"
            disabled={!selectedRoomId || loading}
            onClick={reserve}
          >
            Guardar reserva
          </button>
        </div>
      )}
    </>
  );
}
