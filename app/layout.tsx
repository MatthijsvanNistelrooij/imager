import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import "./globals.css"
import ConvexClerkProvider from "../providers/ConvexClerkProvider"

const manrope = Manrope({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Imager 2.0",
  description: "Generate images with AI",
  icons: {
    icon: "/icons/logo.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ConvexClerkProvider>
      <html lang="en">
        <body className={`${manrope.className}`}>{children}</body>
      </html>
    </ConvexClerkProvider>
  )
}
