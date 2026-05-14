import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Food Comparison',
  description: 'Compare foods by nutrition, environmental impact, and ethics',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <a href="/">Home</a>
          <a href="/foods">Foods</a>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
