/**
 * ============================================================================
 *  L — LISKOV SUBSTITUTION PRINCIPLE (Principio de Sustitución de Liskov)
 *  Ejemplo 3: Cuentas bancarias
 * ============================================================================
 *
 *  "Los objetos de una subclase deben poder reemplazar a los de su clase
 *   base sin alterar el correcto funcionamiento del programa."
 *
 *  ▶ Ejecución (Node 24 ejecuta TypeScript directamente, sin compilar):
 *
 *      node 03-lsp/03-cuentas-bancarias.ts
 *
 *    o con npm:
 *
 *      npm run lsp:3
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// ❌ MAL: la cuenta a Plazo Fijo hereda `retirar()` pero lo prohíbe.
//    Endurece las precondiciones → cualquier código que use Cuenta se rompe.
// ----------------------------------------------------------------------------
class CuentaMal {
  protected saldo: number;

  constructor(saldo: number) {
    this.saldo = saldo;
  }

  depositar(monto: number): void {
    this.saldo += monto;
  }

  retirar(monto: number): void {
    if (monto > this.saldo) throw new Error("Saldo insuficiente");
    this.saldo -= monto;
  }

  getSaldo(): number {
    return this.saldo;
  }
}

class CuentaAhorroMal extends CuentaMal {}

class PlazoFijoMal extends CuentaMal {
  override retirar(): void {
    throw new Error("No se puede retirar de un plazo fijo");
  }
}

function cobrarComision(cuentas: CuentaMal[], comision: number): void {
  for (const c of cuentas) {
    c.retirar(comision);
    console.log(`  ${c.constructor.name}: comisión cobrada, saldo ${c.getSaldo()}`);
  }
}

// ----------------------------------------------------------------------------
// ✅ BIEN: separamos lo que hacen TODAS las cuentas (depositar, consultar)
//    de lo que solo hacen algunas (retirar).
// ----------------------------------------------------------------------------
abstract class Cuenta {
  protected saldo: number;
  readonly titular: string;

  constructor(titular: string, saldo: number) {
    this.titular = titular;
    this.saldo = saldo;
  }

  depositar(monto: number): void {
    this.saldo += monto;
  }

  getSaldo(): number {
    return this.saldo;
  }
}

abstract class CuentaConRetiro extends Cuenta {
  retirar(monto: number): void {
    if (monto > this.saldo) throw new Error("Saldo insuficiente");
    this.saldo -= monto;
  }
}

class CuentaAhorro extends CuentaConRetiro {}

class CuentaCorriente extends CuentaConRetiro {
  private readonly sobregiro = 500;

  // Debilitar la precondición SÍ está permitido por LSP:
  // acepta todo lo que aceptaba la base y un poco más.
  override retirar(monto: number): void {
    if (monto > this.saldo + this.sobregiro) throw new Error("Excede el sobregiro");
    this.saldo -= monto;
  }
}

class PlazoFijo extends Cuenta {
  private readonly tasaAnual = 0.06;

  aplicarIntereses(): void {
    this.saldo += this.saldo * this.tasaAnual;
  }
}

function cobrarComisionBien(cuentas: CuentaConRetiro[], comision: number): void {
  for (const c of cuentas) {
    c.retirar(comision);
    console.log(`  ${c.constructor.name} (${c.titular}): saldo ${c.getSaldo()}`);
  }
}

function depositarBono(cuentas: Cuenta[], bono: number): void {
  for (const c of cuentas) {
    c.depositar(bono);
    console.log(`  ${c.constructor.name} (${c.titular}): saldo ${c.getSaldo()}`);
  }
}

// ----------------------------------------------------------------------------
// Demo
// ----------------------------------------------------------------------------
console.log("=== ❌ Versión que viola LSP ===");
try {
  cobrarComision([new CuentaAhorroMal(1000), new PlazoFijoMal(5000)], 10);
} catch (error) {
  console.log(`  💥 ${(error as Error).message}`);
}

console.log("\n=== ✅ Versión que respeta LSP ===");
const ahorro = new CuentaAhorro("Ana", 1000);
const corriente = new CuentaCorriente("Luis", 100);
const plazo = new PlazoFijo("María", 5000);

console.log("-- Comisión solo a cuentas que permiten retiro:");
cobrarComisionBien([ahorro, corriente], 10);

console.log("-- Bono a TODAS las cuentas:");
depositarBono([ahorro, corriente, plazo], 50);

plazo.aplicarIntereses();
console.log(`-- Plazo fijo tras intereses: ${plazo.getSaldo()}`);

console.log("\n💡 Cada subtipo cumple totalmente el contrato de su clase base.");
