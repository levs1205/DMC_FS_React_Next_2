import { describe, expect, it } from 'vitest'
import type { Habitacion } from './habitacion.ts'
import type { Ocupacion } from './ocupacion.ts'
import { crearRangoFechas } from './rangoFechas.ts'
import { calcularTotal, estaDisponible } from './reglasDisponibilidad.ts'

const hoy = new Date(2026, 10, 2)

const doble: Habitacion = {
  id: 'hab-201',
  nombre: 'Doble Clásica',
  tipo: 'doble',
  capacidad: 2,
  precioPorNoche: 220,
}

describe('calcularTotal', () => {
  it('multiplica el precio por noche por el número de noches', () => {
    const rango = crearRangoFechas('2026-11-05', '2026-11-08', hoy)
    expect(calcularTotal(doble, rango)).toBe(660)
  })

  it('redondea a céntimos', () => {
    const rango = crearRangoFechas('2026-11-05', '2026-11-08', hoy)
    expect(calcularTotal({ ...doble, precioPorNoche: 0.1 }, rango)).toBe(0.3)
  })
})

describe('estaDisponible', () => {
  // Ocupada del 10 al 13 (sale el 13).
  const ocupaciones: Ocupacion[] = [
    { habitacionId: 'hab-201', inicio: '2026-11-10', fin: '2026-11-13' },
    { habitacionId: 'otra', inicio: '2026-11-01', fin: '2026-11-30' },
  ]
  const disponible = (inicio: string, fin: string) =>
    estaDisponible(doble, ocupaciones, crearRangoFechas(inicio, fin, hoy))

  it('está libre si el rango termina antes de la ocupación', () => {
    expect(disponible('2026-11-05', '2026-11-08')).toBe(true)
  })

  it('el día de salida queda libre: se puede entrar el día que otro sale', () => {
    expect(disponible('2026-11-13', '2026-11-15')).toBe(true)
  })

  it('se puede salir el mismo día que otro entra', () => {
    expect(disponible('2026-11-07', '2026-11-10')).toBe(true)
  })

  it('está ocupada si el rango se cruza por el inicio, el fin o por dentro', () => {
    expect(disponible('2026-11-08', '2026-11-11')).toBe(false)
    expect(disponible('2026-11-12', '2026-11-15')).toBe(false)
    expect(disponible('2026-11-11', '2026-11-12')).toBe(false)
    expect(disponible('2026-11-09', '2026-11-14')).toBe(false)
  })

  it('ignora las ocupaciones de otras habitaciones', () => {
    const otraHabitacion: Habitacion = { ...doble, id: 'hab-202' }
    const rango = crearRangoFechas('2026-11-10', '2026-11-13', hoy)
    expect(estaDisponible(otraHabitacion, ocupaciones.slice(0, 1), rango)).toBe(true)
  })
})
