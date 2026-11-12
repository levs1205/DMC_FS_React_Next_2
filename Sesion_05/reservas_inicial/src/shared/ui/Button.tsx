import type { ComponentProps } from 'react'

export type VarianteBoton = 'primario' | 'secundario'

type BotonProps = ComponentProps<'button'> & {
  variante?: VarianteBoton
  cargando?: boolean
  text?: string
}

/**
 * LSP: acepta todo lo que acepta un <button> (incluido `ref` en React 19)
 * y lo reenvía con `...rest`, así puede sustituirlo en cualquier lugar.
 */
export function Button({
  variante = 'primario',
  cargando = false,
  type = 'button',
  disabled,
  className,
  text,
  ...rest
}: BotonProps) {
  const clases = ['boton', `boton--${variante}`, className].join(' ') // Ex: boton boton--primario red
  
  return (
    <button
      {...rest}
      type={type}
      className={clases}
      disabled={disabled || cargando}
      aria-busy={cargando || undefined}
    >
      {cargando ? 'Cargando…' : text}
    </button>
  )
}
