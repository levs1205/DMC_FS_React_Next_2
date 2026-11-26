import type { Metadata } from "next";
import { ReservationFlow } from "@/features/reservations/ui/ReservationFlow";

export const metadata: Metadata = {
  title: "Reserva tu habitación",
};

export default function Reservas() {
  return (
    <>
      <header className="pagina__encabezado">
        <h1>Reserva tu habitación</h1>
        <p>
          Elige las fechas de tu estadía y te mostramos las habitaciones
          disponibles.
        </p>
      </header>

      <ReservationFlow />
    </>
  );
}
