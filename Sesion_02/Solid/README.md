# Principios SOLID en TypeScript

Ejemplos prácticos de los 5 principios SOLID. Cada archivo muestra una versión
**❌ que viola** el principio y otra **✅ que lo respeta**, y en su cabecera
indica cómo ejecutarlo.

## Requisitos

- **Node.js 24** o superior. Node 24 ejecuta archivos `.ts` directamente
  (*type stripping*), **no hace falta compilar** ni instalar nada para correr
  los ejemplos.
- `npm install` es opcional: solo instala `typescript` y `@types/node` para
  el editor y para `npm run typecheck`.

> Por eso el código usa solo sintaxis "borrable" de TypeScript: nada de
> `enum`, `namespace` ni propiedades en el constructor (`constructor(private x)`).
> El `tsconfig.json` tiene `erasableSyntaxOnly: true` para avisarte si las usas.

## Ejecutar

```bash
node 01-srp/01-reporte-ventas.ts   # directamente con Node
npm run srp:1                      # o con el script equivalente
npm run srp                        # los 3 ejemplos de un principio
npm run all                        # todos los ejemplos
npm run typecheck                  # verificar tipos (requiere npm install)
```

## Contenido

| Principio | Archivo | Script |
|---|---|---|
| **S** — Responsabilidad Única | `01-srp/01-reporte-ventas.ts` | `npm run srp:1` |
| | `01-srp/02-registro-usuario.ts` | `npm run srp:2` |
| | `01-srp/03-factura.ts` | `npm run srp:3` |
| **O** — Abierto/Cerrado | `02-ocp/01-descuentos.ts` | `npm run ocp:1` |
| | `02-ocp/02-areas-figuras.ts` | `npm run ocp:2` |
| | `02-ocp/03-metodos-pago.ts` | `npm run ocp:3` |
| **L** — Sustitución de Liskov | `03-lsp/01-aves.ts` | `npm run lsp:1` |
| | `03-lsp/02-rectangulo-cuadrado.ts` | `npm run lsp:2` |
| | `03-lsp/03-cuentas-bancarias.ts` | `npm run lsp:3` |
| **I** — Segregación de Interfaces | `04-isp/01-trabajadores.ts` | `npm run isp:1` |
| | `04-isp/02-impresoras.ts` | `npm run isp:2` |
| | `04-isp/03-repositorios.ts` | `npm run isp:3` |
| **D** — Inversión de Dependencias | `05-dip/01-notificador-pedidos.ts` | `npm run dip:1` |
| | `05-dip/02-servicio-usuarios.ts` | `npm run dip:2` |
| | `05-dip/03-logger.ts` | `npm run dip:3` |

## Resumen de los principios

- **S — Single Responsibility:** una clase debe tener una sola razón para cambiar.
- **O — Open/Closed:** abierto a extensión, cerrado a modificación.
- **L — Liskov Substitution:** un subtipo debe poder reemplazar a su tipo base sin romper nada.
- **I — Interface Segregation:** ningún cliente debe depender de métodos que no usa.
- **D — Dependency Inversion:** depender de abstracciones, no de implementaciones concretas.
