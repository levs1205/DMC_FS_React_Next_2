"use client";

import { useState, type FormEvent } from "react";
import type { SearchAvailabilityInput } from "../application/dto/SearchAvailabilityDTO";

interface SearchFormProps {
  loading: boolean;
  onSearch: (input: SearchAvailabilityInput) => void;
}

export function SearchForm({ loading, onSearch }: SearchFormProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(1);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch({ startDate, endDate, guests });
  }

  return (
    <form className="buscador" onSubmit={handleSubmit}>
      <label className="campo">
        <span className="campo__etiqueta">Fecha de inicio</span>
        <input
          className="campo__input"
          type="date"
          required
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
        />
      </label>

      <label className="campo">
        <span className="campo__etiqueta">Fecha de fin</span>
        <input
          className="campo__input"
          type="date"
          required
          min={startDate || undefined}
          value={endDate}
          onChange={(event) => setEndDate(event.target.value)}
        />
      </label>

      <label className="campo">
        <span className="campo__etiqueta">Huéspedes</span>
        <input
          className="campo__input"
          type="number"
          required
          min={1}
          max={10}
          value={guests}
          onChange={(event) => setGuests(event.target.valueAsNumber)}
        />
      </label>

      <button className="boton boton--primario buscador__boton" type="submit" disabled={loading}>
        {loading ? "Buscando…" : "Buscar"}
      </button>
    </form>
  );
}
