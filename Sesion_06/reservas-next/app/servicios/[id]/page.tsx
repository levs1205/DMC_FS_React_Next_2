
import { useParams } from 'next/navigation'

export default function Servicio() {
    const params = useParams()
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1>Welcome to Servicio {params.id} </h1>
    </div>
  );
}