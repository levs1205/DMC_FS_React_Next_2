/**
 * ============================================================================
 *  O — OPEN/CLOSED PRINCIPLE (Principio Abierto/Cerrado)
 *  Ejemplo 3: Métodos de pago en un checkout
 * ============================================================================
 *
 *  "Las entidades de software deben estar ABIERTAS a la extensión
 *   pero CERRADAS a la modificación."
 *
 *  ▶ Ejecución (Node 24 ejecuta TypeScript directamente, sin compilar):
 *
 *      node 02-ocp/03-metodos-pago.ts
 *
 *    o con npm:
 *
 *      npm run ocp:3
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// ❌ MAL: el checkout conoce todos los métodos de pago.
// ----------------------------------------------------------------------------
class CheckoutMal {
  pagar(metodo: string, monto: number): void {
    if (metodo === "tarjeta") {
      console.log(`💳 Cobrando S/ ${monto} con tarjeta (comisión 3%)`);
    } else if (metodo === "yape") {
      console.log(`📱 Cobrando S/ ${monto} con Yape`);
    } else {
      throw new Error(`Método no soportado: ${metodo}`);
    }
  }
}

// ----------------------------------------------------------------------------
// ✅ BIEN: un registro de métodos de pago (plugins). Para agregar uno
//    nuevo solo se registra; Checkout no cambia.
// ----------------------------------------------------------------------------
interface MetodoPago {
  readonly id: string;
  procesar(monto: number): void;
}

class PagoTarjeta implements MetodoPago {
  readonly id = "tarjeta";
  procesar(monto: number): void {
    const comision = monto * 0.03;
    console.log(`💳 Tarjeta: S/ ${monto} + comisión S/ ${comision.toFixed(2)}`);
  }
}

class PagoYape implements MetodoPago {
  readonly id = "yape";
  procesar(monto: number): void {
    console.log(`📱 Yape: S/ ${monto} (sin comisión)`);
  }
}

// 🆕 Extensión: nuevo método, sin tocar Checkout.
class PagoCripto implements MetodoPago {
  readonly id = "cripto";
  procesar(monto: number): void {
    const usdt = monto / 3.75;
    console.log(`🪙 Cripto: ${usdt.toFixed(2)} USDT equivalentes a S/ ${monto}`);
  }
}

class Checkout {
  private readonly metodos = new Map<string, MetodoPago>();

  registrar(metodo: MetodoPago): this {
    this.metodos.set(metodo.id, metodo);
    return this;
  }

  pagar(id: string, monto: number): void {
    const metodo = this.metodos.get(id);
    if (!metodo) throw new Error(`Método no soportado: ${id}`);
    metodo.procesar(monto);
  }
}

// ----------------------------------------------------------------------------
// Demo
// ----------------------------------------------------------------------------
console.log("=== ❌ Versión que viola OCP ===");
new CheckoutMal().pagar("tarjeta", 100);

console.log("\n=== ✅ Versión que respeta OCP ===");
const checkout = new Checkout()
  .registrar(new PagoTarjeta())
  .registrar(new PagoYape())
  .registrar(new PagoCripto());

checkout.pagar("tarjeta", 100);
checkout.pagar("yape", 100);
checkout.pagar("cripto", 100);

console.log("\n💡 PagoCripto se añadió registrándolo; la clase Checkout no se modificó.");
