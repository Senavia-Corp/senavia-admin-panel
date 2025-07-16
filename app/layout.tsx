import type React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/organisms/app-sidebar"
import "./globals.css"
import { Inter } from "next/font/google"
import { Header } from "@/components/organisms/layout/header"

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      
      <body className={`${inter.className}`}>
        <SidebarProvider>
          <div className="flex min-h-screen bg-gray-50">
            <AppSidebar />
            <SidebarInset className="flex flex-col flex-1">
              {/* Header dentro del área de contenido */}
              <Header />
              {/* Contenido principal */}
              <div className="flex-1 overflow-auto">
                {children}
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
