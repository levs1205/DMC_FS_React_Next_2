/**
 * ============================================================================
 *  I — INTERFACE SEGREGATION PRINCIPLE (Principio de Segregación de Interfaces)
 *  Ejemplo 3: Repositorios de lectura y escritura
 * ============================================================================
 *
 *  "Ningún cliente debería verse obligado a depender de métodos que no usa."
 *
 *  ▶ Ejecución (Node 24 ejecuta TypeScript directamente, sin compilar):
 *
 *      node 04-isp/03-repositorios.ts
 *
 *    o con npm:
 *
 *      npm run isp:3
 * ============================================================================
 */

interface Producto {
  id: number;
  nombre: string;
  precio: number;
}

// ----------------------------------------------------------------------------
// ❌ MAL: un repositorio CRUD completo para todo. Un catálogo de solo
//    lectura (p. ej. una API externa) se ve forzado a "implementar" escrituras.
// ----------------------------------------------------------------------------
interface RepositorioMal<T> {
  obtenerTodos(): T[];
  obtenerPorId(id: number): T | undefined;
  crear(item: T): void;
  actualizar(item: T): void;
  eliminar(id: number): void;
}

class CatalogoExternoMal implements RepositorioMal<Producto> {
  private readonly datos: Producto[] = [{ id: 1, nombre: "Café", precio: 25 }];

  obtenerTodos(): Producto[] {
    return this.datos;
  }
  obtenerPorId(id: number): Producto | undefined {
    return this.datos.find((p) => p.id === id);
  }
  crear(): void {
    throw new Error("Catálogo externo: solo lectura");
  }
  actualizar(): void {
    throw new Error("Catálogo externo: solo lectura");
  }
  eliminar(): void {
    throw new Error("Catálogo externo: solo lectura");
  }
}

// ----------------------------------------------------------------------------
// ✅ BIEN: separamos lectura y escritura (idea base de CQRS).
// ----------------------------------------------------------------------------
interface Lectura<T> {
  obtenerTodos(): T[];
  obtenerPorId(id: number): T | undefined;
}

interface Escritura<T> {
  crear(item: T): void;
  actualizar(item: T): void;
  eliminar(id: number): void;
}

/** Fuente de solo lectura: implementa únicamente Lectura. */
class CatalogoExterno implements Lectura<Producto> {
  private readonly datos: Producto[] = [
    { id: 1, nombre: "Café", precio: 25 },
    { id: 2, nombre: "Té", precio: 15 },
  ];

  obtenerTodos(): Producto[] {
    return this.datos;
  }
  obtenerPorId(id: number): Producto | undefined {
    return this.datos.find((p) => p.id === id);
  }
}

/** Repositorio propio: lectura + escritura. */
class RepositorioProductosMemoria implements Lectura<Producto>, Escritura<Producto> {
  private readonly datos = new Map<number, Producto>();

  obtenerTodos(): Producto[] {
    return [...this.datos.values()];
  }
  obtenerPorId(id: number): Producto | undefined {
    return this.datos.get(id);
  }
  crear(item: Producto): void {
    this.datos.set(item.id, item);
  }
  actualizar(item: Producto): void {
    this.datos.set(item.id, item);
  }
  eliminar(id: number): void {
    this.datos.delete(id);
  }
}

// Clientes
/** Una vitrina solo necesita LEER. */
function mostrarVitrina(fuente: Lectura<Producto>): void {
  for (const p of fuente.obtenerTodos()) console.log(`  • ${p.nombre}: S/ ${p.precio}`);
}

/** Un importador solo necesita ESCRIBIR. */
function importar(destino: Escritura<Producto>, productos: Producto[]): void {
  for (const p of productos) destino.crear(p);
  console.log(`  ✔ ${productos.length} productos importados`);
}

// ----------------------------------------------------------------------------
// Demo
// ----------------------------------------------------------------------------
console.log("=== ❌ Versión que viola ISP ===");
const catalogoMal = new CatalogoExternoMal();
console.log("  Productos:", catalogoMal.obtenerTodos().map((p) => p.nombre).join(", "));
try {
  catalogoMal.eliminar();
} catch (error) {
  console.log(`  💥 ${(error as Error).message}`);
}

console.log("\n=== ✅ Versión que respeta ISP ===");
const externo = new CatalogoExterno();
const propio = new RepositorioProductosMemoria();

console.log("-- Vitrina con catálogo externo:");
mostrarVitrina(externo);

console.log("-- Importando del externo al repositorio propio:");
importar(propio, externo.obtenerTodos());
propio.actualizar({ id: 2, nombre: "Té verde", precio: 18 });

console.log("-- Vitrina con repositorio propio:");
mostrarVitrina(propio);
// importar(externo, []); // ← Error de tipos: CatalogoExterno no es Escritura ✔

console.log("\n💡 Cada cliente depende solo de la parte de la interfaz que usa.");
