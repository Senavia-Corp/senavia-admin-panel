"use client"

import { Settings, LogOut } from "lucide-react"

interface ProfileDrawerProps {
  isOpen: boolean
  onClose: () => void
  username?: string
  email?: string
  imageUrl?: string
}

export function ProfileDrawer({
  isOpen,
  onClose,
  username = "Username",
  email = "admin@example.com",
  imageUrl,
}: ProfileDrawerProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Panel de navegación */}
      <div className="fixed right-0 top-0 h-full w-[320px] bg-white shadow-xl overflow-y-auto">
        <div className="flex flex-col items-center justify-between h-full py-8">
          {/* Header con perfil */}
          <div className="flex flex-col items-center relative border-none">
            <div className="w-40 h-40 rounded-full bg-gradient-to-r from-[#8ECF0A] via-[#39cac0] to-[#8ECF0A] mb-4"></div>
            <button
              className="absolute top-20 -left-[55px] h-8 w-8 rounded-full bg-[#99cc33] text-white hover:bg-[#99cc33] shadow-md flex items-center justify-center"
              onClick={onClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <h2 className="text-2xl font-semibold mb-1 text-black">{username}</h2>
            <div className="flex flex-col items-center text-sm text-black">
              <div className="flex items-center gap-1 mb-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span>{email}</span>
              </div>
            </div>
          </div>

          {/* Botones de navegación */}
          <div className="flex flex-col items-center gap-4 mt-auto">
            <button
              className="flex items-center gap-2 text-black hover:bg-gray-200 rounded-full py-2 px-6 text-lg font-semibold justify-center transition-colors w-full"
            >
              <Settings className="h-4 w-4" />
              Configuración
            </button>
            <button
              className="flex items-center gap-2 text-white hover:text-white rounded-full py-2 px-6 text-lg font-semibold justify-center shadow-md transition-colors w-full"
              style={{ background: "linear-gradient(135deg, #8ECF0A 0%, #2EBAC6 100%)" }}
            >
              <LogOut className="h-5 w-5" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
