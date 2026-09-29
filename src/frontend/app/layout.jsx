import './globals.css';

export const metadata = {
  title: 'Billetera Cashless · Festival Picnic 2026',
  description: 'Panel de gestión de movimientos cashless',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}