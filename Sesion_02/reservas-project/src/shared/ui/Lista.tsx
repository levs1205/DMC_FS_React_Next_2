import type { Key, ReactNode } from 'react'

type ListaProps<T> = {
  items: readonly T[]
  obtenerClave: (item: T) => Key
  renderItem: (item: T) => ReactNode
  vacio: ReactNode
  className?: string
}

/** OCP: nuevas vistas se crean pasando otro `renderItem`, sin tocar este componente. */
export function Lista<T>({ items, obtenerClave, renderItem, vacio, className }: ListaProps<T>) {
  if (items.length === 0) return <>{vacio}</>

  return (
    <ul className={['lista', className].filter(Boolean).join(' ')}>
      {items.map((item) => (
        <li key={obtenerClave(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}
