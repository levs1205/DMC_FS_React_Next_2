/**
 * ============================================================================
 *  L — LISKOV SUBSTITUTION PRINCIPLE (Principio de Sustitución de Liskov)
 *  Ejemplo 1: Aves que vuelan y aves que no
 * ============================================================================
 *
 *  "Los objetos de una subclase deben poder reemplazar a los de su clase
 *   base sin alterar el correcto funcionamiento del programa."
 *
 *  ▶ Ejecución (Node 24 ejecuta TypeScript directamente, sin compilar):
 *
 *      node 03-lsp/01-aves.ts
 *
 *    o con npm:
 *
 *      npm run lsp:1
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// ❌ MAL: asumimos que TODA ave vuela. El Pingüino hereda `volar()`
//    pero no puede cumplir ese contrato → lanza un error.
// ----------------------------------------------------------------------------
class AveMal {
  readonly nombre: string;

  constructor(nombre: string) {
    this.nombre = nombre;
  }

  volar(): string {
    return `${this.nombre} está volando 🕊`;
  }
}

class PalomaMal extends AveMal {}

class PinguinoMal extends AveMal {
  override volar(): string {
    throw new Error(`${this.nombre} no puede volar 🐧`);
  }
}

function hacerVolarATodas(aves: AveMal[]): void {
  for (const ave of aves) console.log(ave.volar());
}

// ----------------------------------------------------------------------------
// ✅ BIEN: la clase base solo promete lo que TODAS las aves cumplen.
//    La capacidad de volar es una abstracción separada.
// ----------------------------------------------------------------------------
abstract class Ave {
  readonly nombre: string;

  constructor(nombre: string) {
    this.nombre = nombre;
  }

  abstract moverse(): string;
}

interface Volador {
  volar(): string;
}

class Paloma extends Ave implements Volador {
  volar(): string {
    return `${this.nombre} está volando 🕊`;
  }
  moverse(): string {
    return this.volar();
  }
}

class Aguila extends Ave implements Volador {
  volar(): string {
    return `${this.nombre} planea a gran altura 🦅`;
  }
  moverse(): string {
    return this.volar();
  }
}

class Pinguino extends Ave {
  nadar(): string {
    return `${this.nombre} está nadando 🐧`;
  }
  moverse(): string {
    return this.nadar();
  }
}

function moverATodas(aves: Ave[]): void {
  for (const ave of aves) console.log(ave.moverse());
}

function hacerVolar(voladores: Volador[]): void {
  for (const v of voladores) console.log(v.volar());
}

// ----------------------------------------------------------------------------
// Demo
// ----------------------------------------------------------------------------
console.log("=== ❌ Versión que viola LSP ===");
try {
  hacerVolarATodas([new PalomaMal("Paloma"), new PinguinoMal("Pingüino")]);
} catch (error) {
  console.log(`💥 Error inesperado: ${(error as Error).message}`);
}

console.log("\n=== ✅ Versión que respeta LSP ===");
const paloma = new Paloma("Paloma");
const aguila = new Aguila("Águila");
const pinguino = new Pinguino("Pingüino");

console.log("-- Todas las aves se mueven (cualquier Ave sirve):");
moverATodas([paloma, aguila, pinguino]);

console.log("-- Solo los voladores vuelan (el compilador impide pasar un Pingüino):");
hacerVolar([paloma, aguila]);
// hacerVolar([pinguino]); // ← Error de tipos: Pinguino no es Volador

console.log("\n💡 Cualquier subclase de Ave puede sustituir a Ave sin sorpresas.");
