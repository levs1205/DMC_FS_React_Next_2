import { describe, expect, it } from 'vitest'
import { crearRangoFechas, noches, RangoFechasInvalidoError, sumarDias } from './rangoFechas.ts'

// 2 de noviembre de 2026 a las 10:00, hora local.
const hoy = new Date(2026, 10, 2, 10, 0)

describe('crearRangoFechas', () => {
  it('crea un rango válido', () => {
    const rango = crearRangoFechas('2026-11-05', '2026-11-08', hoy)
    expect(rango.inicio).toBe('2026-11-05')
    expect(rango.fin).toBe('2026-11-08')
  })

  it('acepta que el inicio sea hoy', () => {
    expect(() => crearRangoFechas('2026-11-02', '2026-11-03', hoy)).not.toThrow()
  })

  it('usa el día de calendario local aunque sea casi medianoche', () => {
    const casiMedianoche = new Date(2026, 10, 2, 23, 59)
    expect(() => crearRangoFechas('2026-11-02', '2026-11-03', casiMedianoche)).not.toThrow()
  })

  it.each([
    ['', '2026-11-08', 'inicio', 'Selecciona la fecha de inicio.'],
    ['2026-11-05', '', 'fin', 'Selecciona la fecha de fin.'],
    ['2026-11-01', '2026-11-08', 'inicio', 'La fecha de inicio no puede ser una fecha pasada.'],
    ['2026-11-05', '2026-11-05', 'fin', 'La fecha de fin debe ser posterior a la de inicio.'],
    ['2026-11-05', '2026-11-04', 'fin', 'La fecha de fin debe ser posterior a la de inicio.'],
    ['2026-02-30', '2026-03-02', 'inicio', 'La fecha de inicio no es válida (AAAA-MM-DD).'],
    ['05/11/2026', '2026-11-08', 'inicio', 'La fecha de inicio no es válida (AAAA-MM-DD).'],
  ])('rechaza inicio="%s" fin="%s" (campo %s)', (inicio, fin, campo, mensaje) => {
    let capturado: unknown
    try {
      crearRangoFechas(inicio, fin, hoy)
    } catch (error) {
      capturado = error
    }
    expect(capturado).toBeInstanceOf(RangoFechasInvalidoError)
    expect(capturado).toMatchObject({ campo, message: mensaje })
  })

  it('devuelve un objeto inmutable', () => {
    const rango = crearRangoFechas('2026-11-05', '2026-11-08', hoy)
    expect(Object.isFrozen(rango)).toBe(true)
  })
})

describe('noches', () => {
  it('calcula la diferencia en días', () => {
    expect(noches(crearRangoFechas('2026-11-05', '2026-11-08', hoy))).toBe(3)
    expect(noches(crearRangoFechas('2026-11-05', '2026-11-06', hoy))).toBe(1)
  })

  it('cruza fin de mes y de año sin desfases', () => {
    expect(noches(crearRangoFechas('2026-11-28', '2026-12-03', hoy))).toBe(5)
    expect(noches(crearRangoFechas('2026-12-30', '2027-01-02', hoy))).toBe(3)
  })
})

describe('sumarDias', () => {
  it('suma días de calendario', () => {
    expect(sumarDias('2026-11-30', 1)).toBe('2026-12-01')
    expect(sumarDias('2028-02-28', 1)).toBe('2028-02-29')
  })
})
