import { useState, type FormEvent } from 'react'
import type { DisponibilidadService } from '../application/disponibilidadService.ts'
import { aFechaCalendario, sumarDias, type RangoFechas } from '../domain/rangoFechas.ts'
import { Boton } from '../../../shared/ui/Boton.tsx'
import { CampoFecha } from '../../../shared/ui/CampoFecha.tsx'
import { ListaHabitaciones } from './ListaHabitaciones.tsx'
import { useFormularioRango } from './useFormularioRango.ts'

type BuscadorDisponibilidadProps = {
  servicio: DisponibilidadService
  /** Inyectable para pruebas; por defecto, el momento del primer render. */
  hoy?: Date
}

/** Componente padre: dueño del estado del rango; renderiza al hijo con el rango buscado. */
export function BuscadorDisponibilidad({ servicio, hoy }: BuscadorDisponibilidadProps) {
  const [fechaHoy] = useState(() => hoy ?? new Date())
  const { inicio, fin, cambiarInicio, cambiarFin, rango, error } = useFormularioRango(fechaHoy)
  const [rangoBuscado, setRangoBuscado] = useState<RangoFechas | null>(null)

  const minInicio = aFechaCalendario(fechaHoy)
  const minFin = sumarDias(inicio || minInicio, 1)

  function buscar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (rango !== null) setRangoBuscado(rango)
  }

  return (
    <>
      <form className="buscador" onSubmit={buscar} noValidate>
        <CampoFecha
          etiqueta="Fecha de inicio"
          valor={inicio}
          onCambio={cambiarInicio}
          min={minInicio}
          error={error?.campo === 'inicio' ? error.mensaje : undefined}
        />
        <CampoFecha
          etiqueta="Fecha de fin"
          valor={fin}
          onCambio={cambiarFin}
          min={minFin}
          error={error?.campo === 'fin' ? error.mensaje : undefined}
        />
        <Boton type="submit" className="buscador__boton" disabled={rango === null}>
          Buscar
        </Boton>
      </form>

      {rangoBuscado !== null && <ListaHabitaciones servicio={servicio} rango={rangoBuscado} />}
    </>
  )
}
