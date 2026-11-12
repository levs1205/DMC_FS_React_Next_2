import type { AvailabillityRoom } from '../domain/room.ts'
import type { TipoHabitacion } from '../domain/habitacion.ts'
import { formatearSoles } from '../../../shared/ui/formato.ts'

/** ISP: recibe solo lo que muestra (sin `id` ni nada más). */
type TarjetaHabitacionProps = Pick<
  AvailabillityRoom,
  'nombre' | 'tipo' | 'capacidad' | 'precioPorNoche' | 'noches' | 'total'
>

const etiquetaTipo: Record<TipoHabitacion, string> = {
  simple: 'Simple',
  doble: 'Doble',
  suite: 'Suite',
}

export function TarjetaHabitacion({
  nombre,
  tipo,
  capacidad,
  precioPorNoche,
  noches,
  total,
}: TarjetaHabitacionProps) {
  return (
    <article className="tarjeta">
      <header className="tarjeta__encabezado">
        <h3 className="tarjeta__nombre">{nombre}</h3>
        <span className={`tarjeta__tipo tarjeta__tipo--${tipo}`}>{etiquetaTipo[tipo]}</span>
      </header>
      <dl className="tarjeta__datos">
        <div>
          <dt>Capacidad</dt>
          <dd>
            {capacidad} {capacidad === 1 ? 'persona' : 'personas'}
          </dd>
        </div>
        <div>
          <dt>Precio por noche</dt>
          <dd>{formatearSoles(precioPorNoche)}</dd>
        </div>
        <div>
          <dt>Noches</dt>
          <dd>{noches}</dd>
        </div>
      </dl>
      <p className="tarjeta__total">
        <span>Total</span>
        <strong>{formatearSoles(total)}</strong>
      </p>
    </article>
  )
}
