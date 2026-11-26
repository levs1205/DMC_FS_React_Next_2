"use client";

import { useState } from "react";
import { searchAvailability } from "@/features/availability/infrastructure/client/availabilityApi";
import type {
  SearchAvailabilityInput,
  SearchAvailabilityOutput,
} from "@/features/availability/application/dto/SearchAvailabilityDTO";
import { createReservation } from "../infrastructure/client/reservationsApi";
import type { ReservationDTO } from "../application/dto/ReservationDTO";

/** Estado del flujo: buscar fechas → elegir una habitación → guardar la reserva. */
export function useReservationFlow() {
  const [result, setResult] = useState<SearchAvailabilityOutput | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<ReservationDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function run(action: () => Promise<void>) {
    setLoading(true);
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  }

  const search = (input: SearchAvailabilityInput) =>
    run(async () => {
      setConfirmation(null);
      setSelectedRoomId(null);
      setResult(await searchAvailability(input));
    });

  const reserve = () =>
    run(async () => {
      if (!result || !selectedRoomId) return;

      const { startDate, endDate, guests } = result;
      setConfirmation(
        await createReservation({ roomId: selectedRoomId, startDate, endDate, guests }),
      );
      setSelectedRoomId(null);
      // Refresca la lista: la habitación reservada ya no debe aparecer.
      setResult(await searchAvailability({ startDate, endDate, guests }));
    });

  return {
    result,
    selectedRoomId,
    confirmation,
    error,
    loading,
    search,
    selectRoom: setSelectedRoomId,
    reserve,
  };
}
