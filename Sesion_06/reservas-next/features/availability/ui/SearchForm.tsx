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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch({ startDate, endDate });
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

      <button className="boton boton--primario buscador__boton" type="submit" disabled={loading}>
        {loading ? "Buscando…" : "Buscar"}
      </button>
    </form>
  );
}
