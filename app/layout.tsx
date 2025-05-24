import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { TranslationProvider } from "@/lib/translations/TranslationContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Systém riadenia digitálneho dvojčaťa",
  description: "Administratívne rozhranie pre správu digitálnych dvojčiat",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sk">
      <body className={inter.className}>
        <TranslationProvider>
          {children}
        </TranslationProvider>
      </body>
    </html>
  )
}
