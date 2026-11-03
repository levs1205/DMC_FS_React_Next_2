/**
 * ============================================================================
 *  S — SINGLE RESPONSIBILITY PRINCIPLE (Principio de Responsabilidad Única)
 *  Ejemplo 3: Factura
 * ============================================================================
 *
 *  "Una clase debe tener una, y solo una, razón para cambiar."
 *
 *  ▶ Ejecución (Node 24 ejecuta TypeScript directamente, sin compilar):
 *
 *      node 01-srp/03-factura.ts
 *
 *    o con npm:
 *
 *      npm run srp:3
 * ============================================================================
 */

interface Item {
  descripcion: string;
  precio: number;
  cantidad: number;
}

const IGV = 0.18;

// ----------------------------------------------------------------------------
// ❌ MAL: la entidad Factura sabe calcular, imprimirse y guardarse.
//    Si cambia el formato de impresión o la base de datos, hay que tocar Factura.
// ----------------------------------------------------------------------------
class FacturaMal {
  readonly cliente: string;
  readonly items: Item[];

  constructor(cliente: string, items: Item[]) {
    this.cliente = cliente;
    this.items = items;
  }

  calcularTotal(): number {
    const subtotal = this.items.reduce((a, i) => a + i.precio * i.cantidad, 0);
    return subtotal * (1 + IGV);
  }

  imprimir(): void {
    console.log(`Factura para ${this.cliente} — Total: S/ ${this.calcularTotal().toFixed(2)}`);
  }

  guardarEnBD(): void {
    console.log(`INSERT INTO facturas ... (${this.cliente})`);
  }
}

// ----------------------------------------------------------------------------
// ✅ BIEN: la Factura solo representa datos + su lógica de negocio.
//    Imprimir y persistir son responsabilidades de otras clases.
// ----------------------------------------------------------------------------
class Factura {
  readonly cliente: string;
  readonly items: Item[];

  constructor(cliente: string, items: Item[]) {
    this.cliente = cliente;
    this.items = items;
  }

  subtotal(): number {
    return this.items.reduce((a, i) => a + i.precio * i.cantidad, 0);
  }

  impuesto(): number {
    return this.subtotal() * IGV;
  }

  total(): number {
    return this.subtotal() + this.impuesto();
  }
}

/** Responsabilidad: mostrar la factura. */
class ImpresoraFactura {
  imprimir(factura: Factura): void {
    console.log(`Factura para ${factura.cliente}`);
    for (const i of factura.items) {
      console.log(`  ${i.cantidad} x ${i.descripcion.padEnd(12)} S/ ${(i.precio * i.cantidad).toFixed(2)}`);
    }
    console.log(`  Subtotal:          S/ ${factura.subtotal().toFixed(2)}`);
    console.log(`  IGV (18%):         S/ ${factura.impuesto().toFixed(2)}`);
    console.log(`  TOTAL:             S/ ${factura.total().toFixed(2)}`);
  }
}

/** Responsabilidad: persistir la factura. */
class RepositorioFacturas {
  guardar(factura: Factura): void {
    console.log(`💾 INSERT INTO facturas (cliente, total) VALUES ('${factura.cliente}', ${factura.total().toFixed(2)})`);
  }
}

// ----------------------------------------------------------------------------
// Demo
// ----------------------------------------------------------------------------
const items: Item[] = [
  { descripcion: "Teclado", precio: 120, cantidad: 2 },
  { descripcion: "Audífonos", precio: 200, cantidad: 1 },
];

console.log("=== ❌ Versión que viola SRP ===");
const facturaMal = new FacturaMal("Comercial SAC", items);
facturaMal.imprimir();
facturaMal.guardarEnBD();

console.log("\n=== ✅ Versión que respeta SRP ===");
const factura = new Factura("Comercial SAC", items);
new ImpresoraFactura().imprimir(factura);
new RepositorioFacturas().guardar(factura);

console.log(
  "\n💡 Factura ya no depende de cómo se imprime ni de qué base de datos se usa.",
);
