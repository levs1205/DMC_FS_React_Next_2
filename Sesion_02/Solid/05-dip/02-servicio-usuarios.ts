/**
 * ============================================================================
 *  D — DEPENDENCY INVERSION PRINCIPLE (Principio de Inversión de Dependencias)
 *  Ejemplo 2: Servicio de usuarios y base de datos
 * ============================================================================
 *
 *  1. Los módulos de alto nivel no deben depender de módulos de bajo nivel.
 *     Ambos deben depender de ABSTRACCIONES.
 *  2. Las abstracciones no deben depender de los detalles; los detalles
 *     deben depender de las abstracciones.
 *
 *  ▶ Ejecución (Node 24 ejecuta TypeScript directamente, sin compilar):
 *
 *      node 05-dip/02-servicio-usuarios.ts
 *
 *    o con npm:
 *
 *      npm run dip:2
 * ============================================================================
 */

interface Usuario {
  id: number;
  nombre: string;
  activo: boolean;
}

// ----------------------------------------------------------------------------
// ❌ MAL: la lógica de negocio está atada a MySQL. No se puede probar
//    sin base de datos ni migrar a otra sin reescribir el servicio.
// ----------------------------------------------------------------------------
class ConexionMySQL {
  consultar(sql: string): Usuario[] {
    console.log(`  🐬 MySQL> ${sql}`);
    return [
      { id: 1, nombre: "Ana", activo: true },
      { id: 2, nombre: "Luis", activo: false },
    ];
  }
}

class ServicioUsuariosMal {
  private readonly db = new ConexionMySQL();

  listarActivos(): string[] {
    return this.db
      .consultar("SELECT * FROM usuarios")
      .filter((u) => u.activo)
      .map((u) => u.nombre);
  }
}

// ----------------------------------------------------------------------------
// ✅ BIEN: el servicio depende de la abstracción RepositorioUsuarios.
//    MySQL, MongoDB o memoria son detalles intercambiables.
// ----------------------------------------------------------------------------
interface RepositorioUsuarios {
  buscarTodos(): Promise<Usuario[]>;
}

class ServicioUsuarios {
  private readonly repo: RepositorioUsuarios;

  constructor(repo: RepositorioUsuarios) {
    this.repo = repo;
  }

  async listarActivos(): Promise<string[]> {
    const usuarios = await this.repo.buscarTodos();
    return usuarios.filter((u) => u.activo).map((u) => u.nombre);
  }
}

class RepositorioMySQL implements RepositorioUsuarios {
  async buscarTodos(): Promise<Usuario[]> {
    console.log("  🐬 MySQL> SELECT * FROM usuarios");
    return [
      { id: 1, nombre: "Ana", activo: true },
      { id: 2, nombre: "Luis", activo: false },
    ];
  }
}

class RepositorioMongo implements RepositorioUsuarios {
  async buscarTodos(): Promise<Usuario[]> {
    console.log("  🍃 Mongo> db.usuarios.find({})");
    return [
      { id: 10, nombre: "María", activo: true },
      { id: 11, nombre: "Pedro", activo: true },
    ];
  }
}

/** Implementación falsa para pruebas unitarias: sin red ni BD. */
class RepositorioEnMemoria implements RepositorioUsuarios {
  private readonly usuarios: Usuario[];

  constructor(usuarios: Usuario[]) {
    this.usuarios = usuarios;
  }

  async buscarTodos(): Promise<Usuario[]> {
    return this.usuarios;
  }
}

// ----------------------------------------------------------------------------
// Demo
// ----------------------------------------------------------------------------
console.log("=== ❌ Versión que viola DIP ===");
console.log("  Activos:", new ServicioUsuariosMal().listarActivos());

console.log("\n=== ✅ Versión que respeta DIP ===");
console.log("  Activos:", await new ServicioUsuarios(new RepositorioMySQL()).listarActivos());
console.log("  Activos:", await new ServicioUsuarios(new RepositorioMongo()).listarActivos());

console.log("\n-- Mini prueba unitaria con repositorio en memoria:");
const servicioTest = new ServicioUsuarios(
  new RepositorioEnMemoria([
    { id: 1, nombre: "Test1", activo: true },
    { id: 2, nombre: "Test2", activo: false },
  ]),
);
const resultado = await servicioTest.listarActivos();
const paso = resultado.length === 1 && resultado[0] === "Test1";
console.log(`  ${paso ? "✔ PASA" : "✘ FALLA"}: listarActivos() devuelve solo los activos`);

console.log("\n💡 Gracias a DIP el servicio se prueba sin base de datos real.");
