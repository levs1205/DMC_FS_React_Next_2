/**
 * ============================================================================
 *  S — SINGLE RESPONSIBILITY PRINCIPLE (Principio de Responsabilidad Única)
 *  Ejemplo 2: Registro de usuarios
 * ============================================================================
 *
 *  "Una clase debe tener una, y solo una, razón para cambiar."
 *
 *  ▶ Ejecución (Node 24 ejecuta TypeScript directamente, sin compilar):
 *
 *      node 01-srp/02-registro-usuario.ts
 *
 *    o con npm:
 *
 *      npm run srp:2
 * ============================================================================
 */

interface Usuario {
  nombre: string;
  email: string;
}

// ----------------------------------------------------------------------------
// ❌ MAL: el servicio valida, guarda y envía correos. Todo mezclado.
// ----------------------------------------------------------------------------
class ServicioUsuarioMal {
  private readonly usuarios: Usuario[] = [];

  registrar(nombre: string, email: string): void {
    if (!email.includes("@")) throw new Error("Email inválido");
    if (nombre.trim().length < 3) throw new Error("Nombre muy corto");

    this.usuarios.push({ nombre, email });

    console.log(`📧 Enviando bienvenida a ${email}...`);
    console.log(`✔ Usuario ${nombre} registrado (total: ${this.usuarios.length})`);
  }
}

// ----------------------------------------------------------------------------
// ✅ BIEN: separamos validación, persistencia y notificación.
//    El servicio solo ORQUESTA el caso de uso.
// ----------------------------------------------------------------------------

/** Responsabilidad: validar los datos de entrada. */
class ValidadorUsuario {
  validar(usuario: Usuario): void {
    if (!usuario.email.includes("@")) throw new Error("Email inválido");
    if (usuario.nombre.trim().length < 3) throw new Error("Nombre muy corto");
  }
}

/** Responsabilidad: guardar y recuperar usuarios. */
class RepositorioUsuarios {
  private readonly usuarios: Usuario[] = [];

  guardar(usuario: Usuario): void {
    this.usuarios.push(usuario);
  }

  contar(): number {
    return this.usuarios.length;
  }
}

/** Responsabilidad: enviar correos. */
class ServicioCorreo {
  enviarBienvenida(usuario: Usuario): void {
    console.log(`📧 Enviando bienvenida a ${usuario.email}...`);
  }
}

/** Responsabilidad: coordinar el caso de uso "registrar usuario". */
class RegistroUsuario {
  private readonly validador: ValidadorUsuario;
  private readonly repositorio: RepositorioUsuarios;
  private readonly correo: ServicioCorreo;

  constructor(
    validador: ValidadorUsuario,
    repositorio: RepositorioUsuarios,
    correo: ServicioCorreo,
  ) {
    this.validador = validador;
    this.repositorio = repositorio;
    this.correo = correo;
  }

  registrar(usuario: Usuario): void {
    this.validador.validar(usuario);
    this.repositorio.guardar(usuario);
    this.correo.enviarBienvenida(usuario);
    console.log(
      `✔ Usuario ${usuario.nombre} registrado (total: ${this.repositorio.contar()})`,
    );
  }
}

// ----------------------------------------------------------------------------
// Demo
// ----------------------------------------------------------------------------
console.log("=== ❌ Versión que viola SRP ===");
new ServicioUsuarioMal().registrar("Ana", "ana@correo.com");

console.log("\n=== ✅ Versión que respeta SRP ===");
const registro = new RegistroUsuario(
  new ValidadorUsuario(),
  new RepositorioUsuarios(),
  new ServicioCorreo(),
);
registro.registrar({ nombre: "Luis", email: "luis@correo.com" });
registro.registrar({ nombre: "María", email: "maria@correo.com" });

try {
  registro.registrar({ nombre: "Jo", email: "sin-arroba" });
} catch (error) {
  console.log(`⚠ Error de validación: ${(error as Error).message}`);
}

console.log(
  "\n💡 Cada pieza se puede probar y cambiar por separado" +
    "\n   (p. ej. cambiar el proveedor de correo sin tocar la validación).",
);
