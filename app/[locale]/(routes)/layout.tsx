import type React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/organisms/app-sidebar";
import "./globals.css";
import { Inter } from "next/font/google";
import { Header } from "@/components/organisms/layout/header";
import { Toaster } from "@/components/ui/toaster";
import { SessionExpiryProvider } from "@/components/providers/session-expiry-provider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/senavia/senavia.ico" />
        <link rel="apple-touch-icon" href="/senavia/senavia.png" />
        <meta name="theme-color" content="#04081E" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className}`}>
        <SessionExpiryProvider>
          <SidebarProvider>
            <div className="flex min-h-screen bg-gray-50 w-full">
              <AppSidebar />
              <SidebarInset className="flex-1 min-w-0 min-h-0 flex flex-col">
                {/* Header dentro del área de contenido */}
                <Header />
                {/* Contenido principal */}
                <div className="flex-1 overflow-auto">{children}</div>
              </SidebarInset>
            </div>
            <Toaster />
          </SidebarProvider>
        </SessionExpiryProvider>
      </body>
    </html>
  );
}

export const metadata = {
  generator: "v0.dev",
};
