/**
 * Value Object RangoFechas.
 * TypeScript puro: no conoce React, fetch ni otras capas.
 */

/** Día de calendario con formato YYYY-MM-DD (sin hora ni zona horaria). */
export type FechaCalendario = string

declare const marcaRangoFechas: unique symbol

/**
 * Tipo con marca (branded type): solo `crearRangoFechas` puede producirlo,
 * por lo que todo RangoFechas que circula por la app ya fue validado.
 */
export type RangoFechas = Readonly<{
  inicio: FechaCalendario
  fin: FechaCalendario
}> & { readonly [marcaRangoFechas]: true }

export type CampoRango = 'inicio' | 'fin'

/** Error de dominio: indica qué campo del rango incumple la regla. */
export class RangoFechasInvalidoError extends Error {
  readonly campo: CampoRango

  constructor(campo: CampoRango, mensaje: string) {
    super(mensaje)
    this.name = 'RangoFechasInvalidoError'
    this.campo = campo
  }
}

const PATRON_FECHA = /^(\d{4})-(\d{2})-(\d{2})$/
const MS_POR_DIA = 86_400_000

/**
 * Convierte YYYY-MM-DD en un número de día absoluto usando UTC,
 * así el cálculo no sufre desfases por zona horaria ni horario de verano.
 * Devuelve null si el texto no es un día de calendario real (p. ej. 2026-02-30).
 */
function aNumeroDeDia(fecha: FechaCalendario): number | null {
  const coincidencia = PATRON_FECHA.exec(fecha)
  if (coincidencia === null) return null

  const [anio, mes, dia] = coincidencia.slice(1).map(Number)
  const ms = Date.UTC(anio, mes - 1, dia)
  const comprobacion = new Date(ms)
  const esFechaReal =
    comprobacion.getUTCFullYear() === anio &&
    comprobacion.getUTCMonth() === mes - 1 &&
    comprobacion.getUTCDate() === dia

  return esFechaReal ? ms / MS_POR_DIA : null
}

function numeroDeDiaValido(fecha: FechaCalendario): number {
  const dia = aNumeroDeDia(fecha)
  if (dia === null) throw new Error(`Fecha inválida: "${fecha}". Usa el formato AAAA-MM-DD.`)
  return dia
}

/** Día de calendario local de un Date (lo que el usuario ve como "hoy"). */
export function aFechaCalendario(fecha: Date): FechaCalendario {
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}

export function sumarDias(fecha: FechaCalendario, dias: number): FechaCalendario {
  const dia = numeroDeDiaValido(fecha) + dias
  return new Date(dia * MS_POR_DIA).toISOString().slice(0, 10)
}

/**
 * Única forma de crear un RangoFechas.
 * Reglas: ambas fechas son obligatorias, el inicio no puede ser pasado
 * y el fin debe ser posterior al inicio.
 */
export function crearRangoFechas(inicio: string, fin: string, hoy: Date): RangoFechas {
  if (inicio === '') {
    throw new RangoFechasInvalidoError('inicio', 'Selecciona la fecha de inicio.')
  }
  const diaInicio = aNumeroDeDia(inicio)
  if (diaInicio === null) {
    throw new RangoFechasInvalidoError('inicio', 'La fecha de inicio no es válida (AAAA-MM-DD).')
  }
  if (diaInicio < numeroDeDiaValido(aFechaCalendario(hoy))) {
    throw new RangoFechasInvalidoError('inicio', 'La fecha de inicio no puede ser una fecha pasada.')
  }

  if (fin === '') {
    throw new RangoFechasInvalidoError('fin', 'Selecciona la fecha de fin.')
  }
  const diaFin = aNumeroDeDia(fin)
  if (diaFin === null) {
    throw new RangoFechasInvalidoError('fin', 'La fecha de fin no es válida (AAAA-MM-DD).')
  }
  if (diaFin <= diaInicio) {
    throw new RangoFechasInvalidoError('fin', 'La fecha de fin debe ser posterior a la de inicio.')
  }

  return Object.freeze({ inicio, fin }) as RangoFechas
}

/** Número de noches del rango (diferencia en días). */
export function noches(rango: RangoFechas): number {
  return numeroDeDiaValido(rango.fin) - numeroDeDiaValido(rango.inicio)
}
