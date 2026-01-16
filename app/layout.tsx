import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Sidebar } from "@/components/layout/sidebar"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI-Powered RFP Management System",
  description:
    "Streamline your procurement workflow with AI-assisted RFP creation, vendor management, and proposal comparison",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 pl-64">{children}</main>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
