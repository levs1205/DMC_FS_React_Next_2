import { useEffect, useState } from 'react'
import type {
  DisponibilidadService,
  HabitacionDisponible,
} from '../application/disponibilidadService.ts'
import type { RangoFechas } from '../domain/rangoFechas.ts'

type EstadoDisponibilidad = {
  habitaciones: readonly HabitacionDisponible[]
  cargando: boolean
  error: string | null
}

type Resultado = {
  rango: RangoFechas
  habitaciones: readonly HabitacionDisponible[]
  error: string | null
}

/**
 * Conecta la UI con el caso de uso. No contiene reglas de negocio:
 * solo gestiona carga, error y respuestas obsoletas.
 */
export function useDisponibilidad(
  servicio: DisponibilidadService,
  rango: RangoFechas,
): EstadoDisponibilidad {
  const [resultado, setResultado] = useState<Resultado | null>(null)

  useEffect(() => {
    let ignorar = false

    servicio.buscarDisponibles(rango).then(
      (habitaciones) => {
        if (!ignorar) setResultado({ rango, habitaciones, error: null })
      },
      (motivo: unknown) => {
        if (ignorar) return
        const error =
          motivo instanceof Error ? motivo.message : 'No se pudo consultar la disponibilidad.'
        setResultado({ rango, habitaciones: [], error })
      },
    )

    // Limpieza: si el rango cambia antes de responder, la respuesta vieja se ignora.
    return () => {
      ignorar = true
    }
  }, [servicio, rango])

  // Si el resultado guardado es de otro rango, la búsqueda actual sigue en curso.
  if (resultado === null || resultado.rango !== rango) {
    return { habitaciones: [], cargando: true, error: null }
  }
  return { habitaciones: resultado.habitaciones, cargando: false, error: resultado.error }
}
