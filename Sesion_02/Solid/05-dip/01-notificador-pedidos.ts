/**
 * ============================================================================
 *  D — DEPENDENCY INVERSION PRINCIPLE (Principio de Inversión de Dependencias)
 *  Ejemplo 1: Notificaciones de pedidos
 * ============================================================================
 *
 *  1. Los módulos de alto nivel no deben depender de módulos de bajo nivel.
 *     Ambos deben depender de ABSTRACCIONES.
 *  2. Las abstracciones no deben depender de los detalles; los detalles
 *     deben depender de las abstracciones.
 *
 *  ▶ Ejecución (Node 24 ejecuta TypeScript directamente, sin compilar):
 *
 *      node 05-dip/01-notificador-pedidos.ts
 *
 *    o con npm:
 *
 *      npm run dip:1
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// ❌ MAL: ServicioPedidos (alto nivel) crea y depende de una clase
//    concreta (EmailGmail, bajo nivel). Cambiar a SMS implica editarlo.
// ----------------------------------------------------------------------------
class EmailGmail {
  enviarCorreo(destino: string, mensaje: string): void {
    console.log(`📧 [Gmail] a ${destino}: ${mensaje}`);
  }
}

class ServicioPedidosMal {
  private readonly email = new EmailGmail(); // acoplamiento fuerte

  confirmar(cliente: string, pedidoId: number): void {
    console.log(`Pedido #${pedidoId} confirmado`);
    this.email.enviarCorreo(cliente, `Tu pedido #${pedidoId} fue confirmado`);
  }
}

// ----------------------------------------------------------------------------
// ✅ BIEN: el alto nivel define la abstracción que necesita (Notificador)
//    y recibe la implementación desde fuera (inyección de dependencias).
// ----------------------------------------------------------------------------
interface Notificador {
  enviar(destino: string, mensaje: string): void;
}

class ServicioPedidos {
  private readonly notificador: Notificador;

  constructor(notificador: Notificador) {
    this.notificador = notificador;
  }

  confirmar(cliente: string, pedidoId: number): void {
    console.log(`Pedido #${pedidoId} confirmado`);
    this.notificador.enviar(cliente, `Tu pedido #${pedidoId} fue confirmado`);
  }
}

// Detalles (bajo nivel) que dependen de la abstracción:
class NotificadorEmail implements Notificador {
  enviar(destino: string, mensaje: string): void {
    console.log(`📧 [Email] a ${destino}: ${mensaje}`);
  }
}

class NotificadorSms implements Notificador {
  enviar(destino: string, mensaje: string): void {
    console.log(`📱 [SMS] a ${destino}: ${mensaje}`);
  }
}

class NotificadorWhatsApp implements Notificador {
  enviar(destino: string, mensaje: string): void {
    console.log(`💬 [WhatsApp] a ${destino}: ${mensaje}`);
  }
}

/** Un notificador compuesto también es un Notificador. */
class NotificadorMultiple implements Notificador {
  private readonly canales: Notificador[];

  constructor(canales: Notificador[]) {
    this.canales = canales;
  }

  enviar(destino: string, mensaje: string): void {
    for (const c of this.canales) c.enviar(destino, mensaje);
  }
}

// ----------------------------------------------------------------------------
// Demo (la "raíz de composición": aquí se eligen las implementaciones)
// ----------------------------------------------------------------------------
console.log("=== ❌ Versión que viola DIP ===");
new ServicioPedidosMal().confirmar("ana@correo.com", 101);

console.log("\n=== ✅ Versión que respeta DIP ===");
new ServicioPedidos(new NotificadorEmail()).confirmar("ana@correo.com", 102);
new ServicioPedidos(new NotificadorSms()).confirmar("+51 999 888 777", 103);
new ServicioPedidos(
  new NotificadorMultiple([new NotificadorEmail(), new NotificadorWhatsApp()]),
).confirmar("luis", 104);

console.log("\n💡 ServicioPedidos nunca cambió: solo le inyectamos otro Notificador.");
