// =====================================================
// ARCHIVO: app/layout.tsx
// PROPÓSITO: Layout principal de la aplicación
// =====================================================

import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
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

// Lemmon Milk: fuente local para títulos (4 variantes)
const lemonMilk = localFont({
  src: [
    {
      path: "./fonts/lemonmilk-light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/lemonmilk-regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/lemonmilk-medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/lemonmilk-bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-lemmon",
  display: "swap",
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
      className={`${montserrat.variable} ${lemonMilk.variable} h-full antialiased`}
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