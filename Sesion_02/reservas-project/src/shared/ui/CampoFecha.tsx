import { useId } from 'react'

type CampoFechaProps = {
  etiqueta: string
  valor: string
  onCambio: (valor: string) => void
  min?: string
  error?: string
}

/** Componente controlado: el valor vive en el padre, el campo solo avisa. */
export function CampoFecha({ etiqueta, valor, onCambio, min, error }: CampoFechaProps) {
  const id = useId()
  const idError = `${id}-error`

  return (
    <div className="campo">
      <label className="campo__etiqueta" htmlFor={id}>
        {etiqueta}
      </label>
      <input
        id={id}
        className="campo__input"
        type="date"
        value={valor}
        min={min}
        onChange={(evento) => onCambio(evento.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? idError : undefined}
      />
      {error && (
        <p id={idError} className="campo__error">
          {error}
        </p>
      )}
    </div>
  )
}
