import { describe, expect, it } from 'vitest'
import type { Habitacion } from '../domain/habitacion.ts'
import type { HabitacionRepository } from '../domain/habitacionRepository.ts'
import type { Ocupacion } from '../domain/ocupacion.ts'
import { crearRangoFechas } from '../domain/rangoFechas.ts'
import { crearHabitacionMemoriaRepository } from '../infrastructure/habitacionMemoriaRepository.ts'
import { crearDisponibilidadService } from './disponibilidadService.ts'

const hoy = new Date(2026, 10, 2)

const habitaciones: Habitacion[] = [
  { id: 'hab-101', nombre: 'Simple Estándar', tipo: 'simple', capacidad: 1, precioPorNoche: 120 },
  { id: 'hab-201', nombre: 'Doble Clásica', tipo: 'doble', capacidad: 2, precioPorNoche: 220 },
  { id: 'hab-302', nombre: 'Suite Presidencial', tipo: 'suite', capacidad: 4, precioPorNoche: 480 },
]

const ocupaciones: Ocupacion[] = [
  { habitacionId: 'hab-201', inicio: '2026-11-04', fin: '2026-11-07' },
  { habitacionId: 'hab-302', inicio: '2026-11-01', fin: '2026-11-05' },
]

describe('buscarDisponibles', () => {
  const servicio = crearDisponibilidadService(
    crearHabitacionMemoriaRepository(habitaciones, ocupaciones),
  )

  it('devuelve solo las habitaciones libres con noches y total calculados', async () => {
    const rango = crearRangoFechas('2026-11-05', '2026-11-08', hoy)

    const resultado = await servicio.buscarDisponibles(rango)

    expect(resultado).toEqual([
      { ...habitaciones[0], noches: 3, total: 360 },
      // La suite queda libre: su ocupación sale justo el 05.
      { ...habitaciones[2], noches: 3, total: 1440 },
    ])
  })

  it('devuelve una lista vacía si todo está ocupado', async () => {
    const todoOcupado = crearDisponibilidadService(
      crearHabitacionMemoriaRepository(
        habitaciones,
        habitaciones.map((h) => ({ habitacionId: h.id, inicio: '2026-11-01', fin: '2026-11-30' })),
      ),
    )
    const rango = crearRangoFechas('2026-11-10', '2026-11-12', hoy)

    await expect(todoOcupado.buscarDisponibles(rango)).resolves.toEqual([])
  })

  it('propaga el error si el repositorio falla', async () => {
    const repoRoto: HabitacionRepository = {
      listar: () => Promise.reject(new Error('Sin conexión')),
      listarOcupaciones: () => Promise.resolve([]),
    }
    const rango = crearRangoFechas('2026-11-10', '2026-11-12', hoy)

    await expect(crearDisponibilidadService(repoRoto).buscarDisponibles(rango)).rejects.toThrow(
      'Sin conexión',
    )
  })
})
