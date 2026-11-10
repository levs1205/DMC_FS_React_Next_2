import { useState } from 'react'
import './App.css'

function App() {
  const [fechaEntrada, setFechaEntrada] = useState(new Date().toISOString().split('T')[0]);
  const [fechaSalida, setFechaSalida] = useState(new Date().toLocaleDateString());

  return (
    <> 
    <main className="pagina">
      <header className="pagina__encabezado">
        <h1>Reserva tu habitación</h1>
        <p>Elige las fechas de tu estadía y te mostramos las habitaciones disponibles.</p>
      </header>
      <form className="buscador">
        <div className="campo">
          <label className="campo__etiqueta">Fecha de entrada</label>
          <input type="date" className="campo__input" value={fechaEntrada} 
           onChange={(e) => setFechaEntrada(e.target.value)} />
           <p>{fechaEntrada}</p>
        </div>
        <div className="campo">
          <label className="campo__etiqueta">Fecha de salida</label>
          <input type="date" className="campo__input" value={fechaSalida} 
           onChange={(e) => setFechaSalida(e.target.value)} />
           <p>{fechaSalida}</p>
        </div>
      </form>
    </main>
    </>
  )
}

export default App
