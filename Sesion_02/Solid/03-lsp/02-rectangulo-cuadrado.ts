/**
 * ============================================================================
 *  L — LISKOV SUBSTITUTION PRINCIPLE (Principio de Sustitución de Liskov)
 *  Ejemplo 2: El clásico Rectángulo / Cuadrado
 * ============================================================================
 *
 *  "Los objetos de una subclase deben poder reemplazar a los de su clase
 *   base sin alterar el correcto funcionamiento del programa."
 *
 *  ▶ Ejecución (Node 24 ejecuta TypeScript directamente, sin compilar):
 *
 *      node 03-lsp/02-rectangulo-cuadrado.ts
 *
 *    o con npm:
 *
 *      npm run lsp:2
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// ❌ MAL: "un cuadrado ES un rectángulo" en matemáticas, pero en código
//    el Cuadrado cambia el comportamiento de los setters del Rectángulo.
// ----------------------------------------------------------------------------
class RectanguloMal {
  protected ancho = 0;
  protected alto = 0;

  setAncho(valor: number): void {
    this.ancho = valor;
  }

  setAlto(valor: number): void {
    this.alto = valor;
  }

  area(): number {
    return this.ancho * this.alto;
  }
}

class CuadradoMal extends RectanguloMal {
  override setAncho(valor: number): void {
    this.ancho = valor;
    this.alto = valor; // efecto colateral inesperado
  }

  override setAlto(valor: number): void {
    this.ancho = valor;
    this.alto = valor; // efecto colateral inesperado
  }
}

/** Código cliente que confía en el contrato del Rectángulo. */
function probarRectangulo(r: RectanguloMal): void {
  r.setAncho(5);
  r.setAlto(4);
  const esperado = 20;
  const obtenido = r.area();
  const ok = obtenido === esperado ? "✔" : "✘";
  console.log(`${ok} ${r.constructor.name}: esperado ${esperado}, obtenido ${obtenido}`);
}

// ----------------------------------------------------------------------------
// ✅ BIEN: Rectángulo y Cuadrado son hermanos, no padre e hijo.
//    Ambos cumplen el contrato común `Figura` y son inmutables.
// ----------------------------------------------------------------------------
interface Figura {
  area(): number;
  describir(): string;
}

class Rectangulo implements Figura {
  readonly ancho: number;
  readonly alto: number;

  constructor(ancho: number, alto: number) {
    this.ancho = ancho;
    this.alto = alto;
  }

  conAncho(ancho: number): Rectangulo {
    return new Rectangulo(ancho, this.alto);
  }

  area(): number {
    return this.ancho * this.alto;
  }

  describir(): string {
    return `Rectángulo ${this.ancho}x${this.alto}`;
  }
}

class Cuadrado implements Figura {
  readonly lado: number;

  constructor(lado: number) {
    this.lado = lado;
  }

  conLado(lado: number): Cuadrado {
    return new Cuadrado(lado);
  }

  area(): number {
    return this.lado ** 2;
  }

  describir(): string {
    return `Cuadrado ${this.lado}x${this.lado}`;
  }
}

function imprimirAreas(figuras: Figura[]): void {
  for (const f of figuras) console.log(`${f.describir().padEnd(18)} → área ${f.area()}`);
}

// ----------------------------------------------------------------------------
// Demo
// ----------------------------------------------------------------------------
console.log("=== ❌ Versión que viola LSP ===");
probarRectangulo(new RectanguloMal());
probarRectangulo(new CuadradoMal()); // ✘ rompe la expectativa del cliente

console.log("\n=== ✅ Versión que respeta LSP ===");
imprimirAreas([
  new Rectangulo(5, 4),
  new Rectangulo(5, 4).conAncho(10),
  new Cuadrado(4),
  new Cuadrado(4).conLado(6),
]);

console.log(
  "\n💡 Ninguna implementación de Figura sorprende al cliente:" +
    "\n   cualquier Figura puede sustituir a otra.",
);
