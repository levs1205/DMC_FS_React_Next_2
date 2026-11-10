import { useState } from 'react'
import {
  crearRangoFechas,
  RangoFechasInvalidoError,
  type CampoRango,
  type RangoFechas,
} from '../domain/rangoFechas.ts'

type ErrorRango = { campo: CampoRango; mensaje: string }

type Validacion = { rango: RangoFechas; error: null } | { rango: null; error: ErrorRango }

/** Delega la validación al Value Object; aquí solo se traduce a estado de UI. */
function validar(inicio: string, fin: string, hoy: Date): Validacion {
  try {
    return { rango: crearRangoFechas(inicio, fin, hoy), error: null }
  } catch (error) {
    if (error instanceof RangoFechasInvalidoError) {
      return { rango: null, error: { campo: error.campo, mensaje: error.message } }
    }
    throw error
  }
}

/** Estado de los campos del formulario y el rango derivado (válido o con error). */
export function useFormularioRango(hoy: Date) {
  const [inicio, setInicio] = useState('')
  const [fin, setFin] = useState('')
  const validacion = validar(inicio, fin, hoy)

  return { inicio, fin, cambiarInicio: setInicio, cambiarFin: setFin, ...validacion }
}
