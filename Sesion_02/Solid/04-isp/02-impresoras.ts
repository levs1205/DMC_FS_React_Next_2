/**
 * ============================================================================
 *  I — INTERFACE SEGREGATION PRINCIPLE (Principio de Segregación de Interfaces)
 *  Ejemplo 2: Impresoras y equipos multifunción
 * ============================================================================
 *
 *  "Ningún cliente debería verse obligado a depender de métodos que no usa."
 *
 *  ▶ Ejecución (Node 24 ejecuta TypeScript directamente, sin compilar):
 *
 *      node 04-isp/02-impresoras.ts
 *
 *    o con npm:
 *
 *      npm run isp:2
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// ❌ MAL: toda impresora debe saber imprimir, escanear y enviar fax.
// ----------------------------------------------------------------------------
interface MaquinaMal {
  imprimir(doc: string): void;
  escanear(doc: string): string;
  fax(doc: string, numero: string): void;
}

class ImpresoraBasicaMal implements MaquinaMal {
  imprimir(doc: string): void {
    console.log(`🖨 Imprimiendo "${doc}"`);
  }
  escanear(): string {
    throw new Error("La impresora básica no escanea");
  }
  fax(): void {
    throw new Error("La impresora básica no envía fax");
  }
}

// ----------------------------------------------------------------------------
// ✅ BIEN: una interfaz por capacidad. Las máquinas combinan las que tienen.
// ----------------------------------------------------------------------------
interface Impresora {
  imprimir(doc: string): void;
}

interface Escaner {
  escanear(doc: string): string;
}

interface Fax {
  fax(doc: string, numero: string): void;
}

class ImpresoraBasica implements Impresora {
  imprimir(doc: string): void {
    console.log(`🖨 [Básica] Imprimiendo "${doc}"`);
  }
}

class Escaner3000 implements Escaner {
  escanear(doc: string): string {
    console.log(`📠 [Escáner] Escaneando "${doc}"`);
    return `${doc}.pdf`;
  }
}

class Multifuncional implements Impresora, Escaner, Fax {
  imprimir(doc: string): void {
    console.log(`🖨 [Multi] Imprimiendo "${doc}"`);
  }
  escanear(doc: string): string {
    console.log(`📠 [Multi] Escaneando "${doc}"`);
    return `${doc}.pdf`;
  }
  fax(doc: string, numero: string): void {
    console.log(`📞 [Multi] Enviando "${doc}" por fax al ${numero}`);
  }
}

// Clientes que piden SOLO lo que necesitan.
class ServicioImpresion {
  private readonly impresora: Impresora;

  constructor(impresora: Impresora) {
    this.impresora = impresora;
  }

  imprimirLote(docs: string[]): void {
    for (const d of docs) this.impresora.imprimir(d);
  }
}

class Digitalizador {
  private readonly escaner: Escaner;

  constructor(escaner: Escaner) {
    this.escaner = escaner;
  }

  digitalizar(doc: string): void {
    const archivo = this.escaner.escanear(doc);
    console.log(`   → guardado como ${archivo}`);
  }
}

// ----------------------------------------------------------------------------
// Demo
// ----------------------------------------------------------------------------
console.log("=== ❌ Versión que viola ISP ===");
const basicaMal = new ImpresoraBasicaMal();
basicaMal.imprimir("contrato.docx");
try {
  basicaMal.escanear();
} catch (error) {
  console.log(`💥 ${(error as Error).message}`);
}

console.log("\n=== ✅ Versión que respeta ISP ===");
const multi = new Multifuncional();

new ServicioImpresion(new ImpresoraBasica()).imprimirLote(["a.txt", "b.txt"]);
new ServicioImpresion(multi).imprimirLote(["c.txt"]);
new Digitalizador(new Escaner3000()).digitalizar("dni");
new Digitalizador(multi).digitalizar("boleta");
multi.fax("factura", "01-555-1234");

console.log(
  "\n💡 ServicioImpresion solo depende de Impresora; no sabe ni le importa" +
    "\n   si la máquina también escanea o envía fax.",
);
