// =====================================================
// ARCHIVO: app/layout.tsx
// PROPÓSITO: Layout principal de la aplicación
// =====================================================

import type { Metadata } from "next";
import { Montserrat, Bebas_Neue } from "next/font/google";
import { AuthProvider } from '@/context/AuthContext';
import "./globals.css";
import Navbar from './components/Navbar';

// =====================================================
// CONFIGURACIÓN DE FUENTES
// =====================================================

// Montserrat: fuente principal del cuerpo
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

// Bebas Neue: reemplazo temporal de Lemmon Milk (hasta tener el archivo)
const bebas = Bebas_Neue({
  weight: "400",
  variable: "--font-lemmon",
  subsets: ["latin"],
});

// =====================================================
// METADATA DE LA PÁGINA (SEO)
// =====================================================

export const metadata: Metadata = {
  title: "Cooperativa EHL",
  description: "Escuela de Herrería Lesbiana - Cursos de herrería y soldadura",
};

// =====================================================
// COMPONENTE PRINCIPAL (RootLayout)
// =====================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${montserrat.variable} ${bebas.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-montserrat bg-ehl-bg text-ehl-dark">
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}