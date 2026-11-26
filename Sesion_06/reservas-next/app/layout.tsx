import "./globals.css";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body>
        <main className="pagina">{children}</main>
      </body>
    </html>
  );
}
