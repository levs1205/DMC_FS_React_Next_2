import type { DisponibilidadService } from '../application/disponibilidadService.ts'
import { noches, type RangoFechas } from '../domain/rangoFechas.ts'
import { Lista } from '../../../shared/ui/Lista.tsx'
import { formatearFecha } from '../../../shared/ui/formato.ts'
import { TarjetaHabitacion } from './TarjetaHabitacion.tsx'
import { useDisponibilidad } from './useDisponibilidad.ts'

type ListaHabitacionesProps = {
  servicio: DisponibilidadService
  rango: RangoFechas
}

/** Componente hijo: recibe el rango por props y muestra las habitaciones libres. */
export function ListaHabitaciones({ servicio, rango }: ListaHabitacionesProps) {
  const { habitaciones, cargando, error } = useDisponibilidad(servicio, rango)
  const totalNoches = noches(rango)

  return (
    <section className="resultados" aria-live="polite" aria-busy={cargando}>
      <h2 className="resultados__titulo">
        Del {formatearFecha(rango.inicio)} al {formatearFecha(rango.fin)} · {totalNoches}{' '}
        {totalNoches === 1 ? 'noche' : 'noches'}
      </h2>

      {cargando ? (
        <p className="mensaje">Buscando habitaciones disponibles…</p>
      ) : error ? (
        <p className="mensaje mensaje--error" role="alert">
          {error}
        </p>
      ) : (
        <Lista
          className="grilla-habitaciones"
          items={habitaciones}
          obtenerClave={(habitacion) => habitacion.id}
          vacio={<p className="mensaje">No hay habitaciones disponibles para estas fechas.</p>}
          renderItem={(habitacion) => (
            <TarjetaHabitacion
              nombre={habitacion.nombre}
              tipo={habitacion.tipo}
              capacidad={habitacion.capacidad}
              precioPorNoche={habitacion.precioPorNoche}
              noches={habitacion.noches}
              total={habitacion.total}
            />
          )}
        />
      )}
    </section>
  )
}
