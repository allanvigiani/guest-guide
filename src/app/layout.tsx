import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Guia do Hóspede",
  description: "Seu guia digital personalizado para uma estadia perfeita.",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
