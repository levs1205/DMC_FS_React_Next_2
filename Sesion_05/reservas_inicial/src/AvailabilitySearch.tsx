import { useState } from "react";
import DateField from "./shared/ui/DateField";
import { addDays, getShortDate } from "./shared/util";

function AvailabilitySearch() {
  const [inDate, setInDate] = useState("");
  const [outDate, setOutDate] = useState("");

  const minInDate = getShortDate();
  const minOutDate = getShortDate(addDays(1));

  return (
    <>
      <header className="pagina__encabezado">
        <h1>Reserva tu habitación</h1>
        <p>
          Elige las fechas de tu estadía y te mostramos las habitaciones
          disponibles.
        </p>
      </header>
      <form className="buscador">
        <DateField
          label="Fecha de entrada"
          onChange={setInDate}
          min={minInDate}
        />
        <DateField
          label="Fecha de salida"
          onChange={setOutDate}
          min={minOutDate}
        />
      </form>
    </>
  );
}

export default AvailabilitySearch;
