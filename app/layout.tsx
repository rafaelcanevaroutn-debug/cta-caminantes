import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CTA Generator - Caminantes de Montaña",
  description: "Generá CTAs para Instagram y TikTok de tus salidas de montaña",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
