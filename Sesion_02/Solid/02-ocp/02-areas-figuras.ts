/**
 * ============================================================================
 *  O — OPEN/CLOSED PRINCIPLE (Principio Abierto/Cerrado)
 *  Ejemplo 2: Cálculo de áreas de figuras
 * ============================================================================
 *
 *  "Las entidades de software deben estar ABIERTAS a la extensión
 *   pero CERRADAS a la modificación."
 *
 *  ▶ Ejecución (Node 24 ejecuta TypeScript directamente, sin compilar):
 *
 *      node 02-ocp/02-areas-figuras.ts
 *
 *    o con npm:
 *
 *      npm run ocp:2
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// ❌ MAL: la calculadora pregunta "¿qué tipo eres?" con if/else.
//    Cada figura nueva obliga a modificarla.
// ----------------------------------------------------------------------------
type FiguraMal =
  | { tipo: "rectangulo"; ancho: number; alto: number }
  | { tipo: "circulo"; radio: number };

class CalculadoraAreasMal {
  areaTotal(figuras: FiguraMal[]): number {
    let total = 0;
    for (const f of figuras) {
      if (f.tipo === "rectangulo") total += f.ancho * f.alto;
      else if (f.tipo === "circulo") total += Math.PI * f.radio ** 2;
      // ¿Triángulo? → editar esta clase otra vez 😟
    }
    return total;
  }
}

// ----------------------------------------------------------------------------
// ✅ BIEN: cada figura sabe calcular su propia área (polimorfismo).
// ----------------------------------------------------------------------------
interface Figura {
  readonly nombre: string;
  area(): number;
}

class Rectangulo implements Figura {
  readonly nombre = "Rectángulo";
  private readonly ancho: number;
  private readonly alto: number;

  constructor(ancho: number, alto: number) {
    this.ancho = ancho;
    this.alto = alto;
  }

  area(): number {
    return this.ancho * this.alto;
  }
}

class Circulo implements Figura {
  readonly nombre = "Círculo";
  private readonly radio: number;

  constructor(radio: number) {
    this.radio = radio;
  }

  area(): number {
    return Math.PI * this.radio ** 2;
  }
}

// 🆕 Extensión: nueva figura, cero cambios en la calculadora.
class Triangulo implements Figura {
  readonly nombre = "Triángulo";
  private readonly base: number;
  private readonly altura: number;

  constructor(base: number, altura: number) {
    this.base = base;
    this.altura = altura;
  }

  area(): number {
    return (this.base * this.altura) / 2;
  }
}

/** CERRADA a modificación: no necesita conocer las figuras concretas. */
class CalculadoraAreas {
  areaTotal(figuras: Figura[]): number {
    return figuras.reduce((acc, f) => acc + f.area(), 0);
  }
}

// ----------------------------------------------------------------------------
// Demo
// ----------------------------------------------------------------------------
console.log("=== ❌ Versión que viola OCP ===");
const totalMal = new CalculadoraAreasMal().areaTotal([
  { tipo: "rectangulo", ancho: 4, alto: 5 },
  { tipo: "circulo", radio: 2 },
]);
console.log(`Área total: ${totalMal.toFixed(2)}`);

console.log("\n=== ✅ Versión que respeta OCP ===");
const figuras: Figura[] = [new Rectangulo(4, 5), new Circulo(2), new Triangulo(6, 3)];
for (const f of figuras) console.log(`${f.nombre.padEnd(11)} → ${f.area().toFixed(2)}`);
console.log(`Área total: ${new CalculadoraAreas().areaTotal(figuras).toFixed(2)}`);

console.log("\n💡 Triangulo se agregó sin modificar CalculadoraAreas.");
