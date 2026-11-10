import type { ComponentProps } from 'react'

export type VarianteBoton = 'primario' | 'secundario'

type BotonProps = ComponentProps<'button'> & {
  variante?: VarianteBoton
  cargando?: boolean
}

/**
 * LSP: acepta todo lo que acepta un <button> (incluido `ref` en React 19)
 * y lo reenvía con `...rest`, así puede sustituirlo en cualquier lugar.
 */
export function Boton({
  variante = 'primario',
  cargando = false,
  type = 'button',
  disabled,
  className,
  children,
  ...rest
}: BotonProps) {
  const clases = ['boton', `boton--${variante}`, className].filter(Boolean).join(' ')

  return (
    <button
      {...rest}
      type={type}
      className={clases}
      disabled={disabled === true || cargando}
      aria-busy={cargando || undefined}
    >
      {cargando ? 'Cargando…' : children}
    </button>
  )
}
