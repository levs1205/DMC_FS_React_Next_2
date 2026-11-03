/**
 * ============================================================================
 *  I — INTERFACE SEGREGATION PRINCIPLE (Principio de Segregación de Interfaces)
 *  Ejemplo 1: Trabajadores humanos y robots
 * ============================================================================
 *
 *  "Ningún cliente debería verse obligado a depender de métodos que no usa."
 *
 *  ▶ Ejecución (Node 24 ejecuta TypeScript directamente, sin compilar):
 *
 *      node 04-isp/01-trabajadores.ts
 *
 *    o con npm:
 *
 *      npm run isp:1
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// ❌ MAL: una interfaz "gorda". El Robot está obligado a implementar
//    comer() y dormir(), que no tienen sentido para él.
// ----------------------------------------------------------------------------
interface TrabajadorMal {
  trabajar(): void;
  comer(): void;
  dormir(): void;
}

class HumanoMal implements TrabajadorMal {
  trabajar(): void {
    console.log("👷 Humano trabajando");
  }
  comer(): void {
    console.log("🍽 Humano comiendo");
  }
  dormir(): void {
    console.log("😴 Humano durmiendo");
  }
}

class RobotMal implements TrabajadorMal {
  trabajar(): void {
    console.log("🤖 Robot trabajando");
  }
  comer(): void {
    throw new Error("Un robot no come"); // método inútil forzado
  }
  dormir(): void {
    throw new Error("Un robot no duerme"); // método inútil forzado
  }
}

// ----------------------------------------------------------------------------
// ✅ BIEN: interfaces pequeñas y específicas. Cada clase implementa
//    solo lo que realmente necesita.
// ----------------------------------------------------------------------------
interface Trabajable {
  trabajar(): void;
}

interface Alimentable {
  comer(): void;
}

interface Descansable {
  dormir(): void;
}

interface Recargable {
  recargar(): void;
}

class Humano implements Trabajable, Alimentable, Descansable {
  trabajar(): void {
    console.log("👷 Humano trabajando");
  }
  comer(): void {
    console.log("🍽 Humano comiendo");
  }
  dormir(): void {
    console.log("😴 Humano durmiendo");
  }
}

class Robot implements Trabajable, Recargable {
  trabajar(): void {
    console.log("🤖 Robot trabajando");
  }
  recargar(): void {
    console.log("🔋 Robot recargando batería");
  }
}

// Los "clientes" dependen solo de la interfaz que usan.
function turnoDeTrabajo(trabajadores: Trabajable[]): void {
  for (const t of trabajadores) t.trabajar();
}

function horaDeAlmuerzo(comensales: Alimentable[]): void {
  for (const c of comensales) c.comer();
}

// ----------------------------------------------------------------------------
// Demo
// ----------------------------------------------------------------------------
console.log("=== ❌ Versión que viola ISP ===");
const equipoMal: TrabajadorMal[] = [new HumanoMal(), new RobotMal()];
for (const t of equipoMal) {
  try {
    t.trabajar();
    t.comer();
  } catch (error) {
    console.log(`💥 ${(error as Error).message}`);
  }
}

console.log("\n=== ✅ Versión que respeta ISP ===");
const humano = new Humano();
const robot = new Robot();

turnoDeTrabajo([humano, robot]);
horaDeAlmuerzo([humano]); // horaDeAlmuerzo([robot]) → error de tipos ✔
robot.recargar();

console.log("\n💡 Robot ya no arrastra métodos que no le corresponden.");
