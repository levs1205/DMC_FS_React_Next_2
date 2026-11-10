const formatoSoles = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' })

export function formatearSoles(monto: number): string {
  return formatoSoles.format(monto)
}

/** YYYY-MM-DD → DD/MM/YYYY sin pasar por Date (evita desfases de zona horaria). */
export function formatearFecha(fecha: string): string {
  const [anio, mes, dia] = fecha.split('-')
  return `${dia}/${mes}/${anio}`
}
