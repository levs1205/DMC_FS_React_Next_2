/**
 * ============================================================================
 *  S — SINGLE RESPONSIBILITY PRINCIPLE (Principio de Responsabilidad Única)
 *  Ejemplo 1: Reporte de ventas
 * ============================================================================
 *
 *  "Una clase debe tener una, y solo una, razón para cambiar."
 *
 *  ▶ Ejecución (Node 24 ejecuta TypeScript directamente, sin compilar):
 *
 *      node 01-srp/01-reporte-ventas.ts
 *
 *    o con npm:
 *
 *      npm run srp:1
 * ============================================================================
 */

interface Venta {
  producto: string;
  cantidad: number;
  precioUnitario: number;
}

const ventas: Venta[] = [
  { producto: "Laptop", cantidad: 2, precioUnitario: 3500 },
  { producto: "Mouse", cantidad: 10, precioUnitario: 45 },
  { producto: "Monitor", cantidad: 3, precioUnitario: 900 },
];

// ----------------------------------------------------------------------------
// ❌ MAL: una sola clase calcula, da formato y "guarda" el reporte.
//    Tiene 3 razones para cambiar: reglas de negocio, formato y almacenamiento.
// ----------------------------------------------------------------------------
class ReporteVentasMal {
  private readonly ventas: Venta[];

  constructor(ventas: Venta[]) {
    this.ventas = ventas;
  }

  generarYGuardar(): void {
    // 1) Cálculo
    let total = 0;
    for (const v of this.ventas) total += v.cantidad * v.precioUnitario;

    // 2) Formato
    let texto = "REPORTE DE VENTAS\n";
    for (const v of this.ventas) {
      texto += `- ${v.producto}: ${v.cantidad} x S/ ${v.precioUnitario}\n`;
    }
    texto += `TOTAL: S/ ${total}`;

    // 3) Persistencia (simulada)
    console.log("[Guardando en disco...]\n" + texto);
  }
}

// ----------------------------------------------------------------------------
// ✅ BIEN: cada clase tiene una única responsabilidad.
// ----------------------------------------------------------------------------

/** Responsabilidad: reglas de negocio (cálculos). */
class CalculadoraVentas {
  total(ventas: Venta[]): number {
    return ventas.reduce((acc, v) => acc + v.cantidad * v.precioUnitario, 0);
  }
}

/** Responsabilidad: presentación (formato del texto). */
class FormateadorReporte {
  aTexto(ventas: Venta[], total: number): string {
    const lineas = ventas.map(
      (v) => `- ${v.producto}: ${v.cantidad} x S/ ${v.precioUnitario}`,
    );
    return ["REPORTE DE VENTAS", ...lineas, `TOTAL: S/ ${total}`].join("\n");
  }
}

/** Responsabilidad: persistencia (dónde se guarda). */
class AlmacenReportes {
  guardar(contenido: string): void {
    console.log("[Guardando en disco...]\n" + contenido);
  }
}

// ----------------------------------------------------------------------------
// Demo
// ----------------------------------------------------------------------------
console.log("=== ❌ Versión que viola SRP ===");
new ReporteVentasMal(ventas).generarYGuardar();

console.log("\n=== ✅ Versión que respeta SRP ===");
const calculadora = new CalculadoraVentas();
const formateador = new FormateadorReporte();
const almacen = new AlmacenReportes();

const total = calculadora.total(ventas);
const reporte = formateador.aTexto(ventas, total);
almacen.guardar(reporte);

console.log(
  "\n💡 Si mañana el reporte debe salir en JSON, solo cambia FormateadorReporte;" +
    "\n   el cálculo y el almacenamiento no se tocan.",
);
