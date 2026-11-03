/**
 * ============================================================================
 *  D — DEPENDENCY INVERSION PRINCIPLE (Principio de Inversión de Dependencias)
 *  Ejemplo 3: Logger inyectable + contenedor de dependencias sencillo
 * ============================================================================
 *
 *  1. Los módulos de alto nivel no deben depender de módulos de bajo nivel.
 *     Ambos deben depender de ABSTRACCIONES.
 *  2. Las abstracciones no deben depender de los detalles; los detalles
 *     deben depender de las abstracciones.
 *
 *  ▶ Ejecución (Node 24 ejecuta TypeScript directamente, sin compilar):
 *
 *      node 05-dip/03-logger.ts
 *
 *    o con npm:
 *
 *      npm run dip:3
 *
 *    Para elegir otro logger vía variable de entorno:
 *
 *      PowerShell:  $env:LOGGER="json"; node 05-dip/03-logger.ts
 *      Bash:        LOGGER=json node 05-dip/03-logger.ts
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// ❌ MAL: la clase llama directamente a console.log con un formato fijo.
//    No se puede silenciar, redirigir ni verificar en pruebas.
// ----------------------------------------------------------------------------
class ProcesadorPagosMal {
  procesar(monto: number): void {
    console.log(`[INFO] ${new Date().toISOString()} Procesando S/ ${monto}`);
    if (monto > 1000) console.log(`[WARN] Monto alto: S/ ${monto}`);
  }
}

// ----------------------------------------------------------------------------
// ✅ BIEN: el procesador depende de la abstracción Logger.
// ----------------------------------------------------------------------------
type Nivel = "info" | "warn" | "error";

interface Logger {
  log(nivel: Nivel, mensaje: string): void;
}

class ProcesadorPagos {
  private readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  procesar(monto: number): void {
    this.logger.log("info", `Procesando S/ ${monto}`);
    if (monto > 1000) this.logger.log("warn", `Monto alto: S/ ${monto}`);
    if (monto <= 0) this.logger.log("error", `Monto inválido: S/ ${monto}`);
  }
}

// Implementaciones (detalles)
class LoggerConsola implements Logger {
  log(nivel: Nivel, mensaje: string): void {
    console.log(`[${nivel.toUpperCase()}] ${mensaje}`);
  }
}

class LoggerJson implements Logger {
  log(nivel: Nivel, mensaje: string): void {
    console.log(JSON.stringify({ nivel, mensaje, fecha: new Date().toISOString() }));
  }
}

/** Guarda los mensajes en memoria: ideal para pruebas. */
class LoggerMemoria implements Logger {
  readonly registros: string[] = [];

  log(nivel: Nivel, mensaje: string): void {
    this.registros.push(`${nivel}:${mensaje}`);
  }
}

class LoggerSilencioso implements Logger {
  log(): void {}
}

// ----------------------------------------------------------------------------
// Contenedor de dependencias minimalista (la "raíz de composición").
// ----------------------------------------------------------------------------
class Contenedor {
  private readonly fabricas = new Map<string, () => unknown>();

  registrar<T>(clave: string, fabrica: () => T): void {
    this.fabricas.set(clave, fabrica);
  }

  resolver<T>(clave: string): T {
    const fabrica = this.fabricas.get(clave);
    if (!fabrica) throw new Error(`Dependencia no registrada: ${clave}`);
    return fabrica() as T;
  }
}

function crearLogger(tipo: string | undefined): Logger {
  switch (tipo) {
    case "json":
      return new LoggerJson();
    case "silencioso":
      return new LoggerSilencioso();
    default:
      return new LoggerConsola();
  }
}

// ----------------------------------------------------------------------------
// Demo
// ----------------------------------------------------------------------------
console.log("=== ❌ Versión que viola DIP ===");
new ProcesadorPagosMal().procesar(1500);

console.log("\n=== ✅ Versión que respeta DIP ===");
const contenedor = new Contenedor();
contenedor.registrar<Logger>("logger", () => crearLogger(process.env.LOGGER));
contenedor.registrar<ProcesadorPagos>(
  "procesador",
  () => new ProcesadorPagos(contenedor.resolver<Logger>("logger")),
);

console.log(`-- Logger elegido por LOGGER=${process.env.LOGGER ?? "(consola por defecto)"}`);
const procesador = contenedor.resolver<ProcesadorPagos>("procesador");
procesador.procesar(200);
procesador.procesar(1500);

console.log("\n-- Con LoggerJson:");
new ProcesadorPagos(new LoggerJson()).procesar(50);

console.log("\n-- Mini prueba unitaria con LoggerMemoria:");
const loggerTest = new LoggerMemoria();
new ProcesadorPagos(loggerTest).procesar(-5);
const paso = loggerTest.registros.includes("error:Monto inválido: S/ -5");
console.log(`  ${paso ? "✔ PASA" : "✘ FALLA"}: se registra error para montos inválidos`);
console.log("  Registros capturados:", loggerTest.registros);

console.log("\n💡 El procesador no sabe dónde ni cómo se escriben los logs.");
