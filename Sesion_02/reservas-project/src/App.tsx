import type { DisponibilidadService } from './features/disponibilidad/application/disponibilidadService.ts'
import { BuscadorDisponibilidad } from './features/disponibilidad/ui/BuscadorDisponibilidad.tsx'
import './App.css'

type AppProps = {
  servicio: DisponibilidadService
}

/** Página: recibe el service ya armado desde el composition root (main.tsx). */
function App({ servicio }: AppProps) {
  return (
    <main className="pagina">
      <header className="pagina__encabezado">
        <h1>Reserva tu habitación</h1>
        <p>Elige las fechas de tu estadía y te mostramos las habitaciones disponibles.</p>
      </header>
      <BuscadorDisponibilidad servicio={servicio} />
    </main>
  )
}

export default App
