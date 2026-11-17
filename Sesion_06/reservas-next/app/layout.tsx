import "./globals.css";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <main className="pagina">{children}</main>
      </body>
    </html>
  );
}
