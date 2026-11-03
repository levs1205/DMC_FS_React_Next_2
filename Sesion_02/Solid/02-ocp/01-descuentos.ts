/**
 * ============================================================================
 *  O — OPEN/CLOSED PRINCIPLE (Principio Abierto/Cerrado)
 *  Ejemplo 1: Descuentos por tipo de cliente
 * ============================================================================
 *
 *  "Las entidades de software deben estar ABIERTAS a la extensión
 *   pero CERRADAS a la modificación."
 *
 *  ▶ Ejecución (Node 24 ejecuta TypeScript directamente, sin compilar):
 *
 *      node 02-ocp/01-descuentos.ts
 *
 *    o con npm:
 *
 *      npm run ocp:1
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// ❌ MAL: cada nuevo tipo de cliente obliga a MODIFICAR esta función
//    (agregar otro `case`), con riesgo de romper lo que ya funciona.
// ----------------------------------------------------------------------------
type TipoCliente = "regular" | "vip" | "empleado";

function calcularDescuentoMal(tipo: TipoCliente, monto: number): number {
  switch (tipo) {
    case "regular":
      return 0;
    case "vip":
      return monto * 0.2;
    case "empleado":
      return monto * 0.3;
    // ¿Nuevo tipo "estudiante"? → hay que editar aquí 😟
  }
}

// ----------------------------------------------------------------------------
// ✅ BIEN: definimos una abstracción. Para un nuevo descuento se CREA
//    una nueva clase; el código existente no se toca.
// ----------------------------------------------------------------------------
interface EstrategiaDescuento {
  readonly nombre: string;
  calcular(monto: number): number;
}

class SinDescuento implements EstrategiaDescuento {
  readonly nombre = "Regular";
  calcular(): number {
    return 0;
  }
}

class DescuentoVip implements EstrategiaDescuento {
  readonly nombre = "VIP";
  calcular(monto: number): number {
    return monto * 0.2;
  }
}

class DescuentoEmpleado implements EstrategiaDescuento {
  readonly nombre = "Empleado";
  calcular(monto: number): number {
    return monto * 0.3;
  }
}

// 🆕 Extensión: nuevo tipo de descuento SIN modificar nada de lo anterior.
class DescuentoEstudiante implements EstrategiaDescuento {
  readonly nombre = "Estudiante";
  calcular(monto: number): number {
    return Math.min(monto * 0.15, 50); // 15% con tope de S/ 50
  }
}

/** Esta clase está CERRADA a modificación: funciona con cualquier estrategia. */
class Caja {
  cobrar(monto: number, descuento: EstrategiaDescuento): number {
    const desc = descuento.calcular(monto);
    const total = monto - desc;
    console.log(
      `${descuento.nombre.padEnd(10)} | monto: S/ ${monto} | descuento: S/ ${desc.toFixed(2)} | total: S/ ${total.toFixed(2)}`,
    );
    return total;
  }
}

// ----------------------------------------------------------------------------
// Demo
// ----------------------------------------------------------------------------
console.log("=== ❌ Versión que viola OCP ===");
console.log("VIP ->", calcularDescuentoMal("vip", 500));

console.log("\n=== ✅ Versión que respeta OCP ===");
const caja = new Caja();
const estrategias: EstrategiaDescuento[] = [
  new SinDescuento(),
  new DescuentoVip(),
  new DescuentoEmpleado(),
  new DescuentoEstudiante(),
];
for (const e of estrategias) caja.cobrar(500, e);

console.log(
  "\n💡 Agregamos DescuentoEstudiante sin tocar Caja ni los otros descuentos.",
);
