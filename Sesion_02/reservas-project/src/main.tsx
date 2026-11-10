import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { crearOcupacionesEjemplo, habitacionesEjemplo } from './app/datosEjemplo.ts'
import { crearDisponibilidadService } from './features/disponibilidad/application/disponibilidadService.ts'
import type { HabitacionRepository } from './features/disponibilidad/domain/habitacionRepository.ts'
import { crearHabitacionMemoriaRepository } from './features/disponibilidad/infrastructure/habitacionMemoriaRepository.ts'

// ── Composition root ─────────────────────────────────────────────
// Único lugar que conoce las implementaciones concretas (DIP).
const repositorio: HabitacionRepository = crearHabitacionMemoriaRepository(
  habitacionesEjemplo,
  crearOcupacionesEjemplo(new Date()),
  { retardoMs: 400 },
)
// Cambiar de fuente de datos solo requiere otro adaptador del mismo puerto:
// const repositorio: HabitacionRepository = crearHabitacionApiRepository('https://api.mihotel.pe')

const servicio = crearDisponibilidadService(repositorio)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App servicio={servicio} />
  </StrictMode>,
)
