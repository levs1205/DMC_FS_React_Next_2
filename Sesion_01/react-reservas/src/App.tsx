import { useState } from 'react'
 
type SaludoProps = { nombre: string; curso?: string }
 
function Saludo({ nombre, curso = 'React & Next.js' }: SaludoProps) {
  return <h1>Hola, {nombre} 👋 bienvenida a {curso}</h1>
}
 
function App() {
  const [likes, setLikes] = useState<number>(0)
  return (
    <section id="center">
      <Saludo nombre="Ana" />
      <button onClick={() => setLikes(likes + 1)}>
        👍 {likes} likes
      </button>
    </section>
  )
}


export default App
