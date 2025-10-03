"use client";

import { Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  username?: string;
  email?: string;
  phone?: string;
  imageUrl?: string;
}

export function ProfileDrawer({
  isOpen,
  onClose,
  username,
  email,
  phone,
  imageUrl,
}: ProfileDrawerProps) {
  if (!isOpen) return null;
  const [user, setUser] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    imageUrl?: string;
  }>({});
  const router = useRouter();

  useEffect(() => {
    console.log("👤 User actualizado:", user);
  }, [user]);

  useEffect(() => {
    fetch("http://localhost:3000/api/auth/me", {
      method: "GET",
      credentials: "include", // 👈 para enviar cookies
    })
      .then((res) => res.json())
      .then((data) => {
        //console.log("✅ Datos del usuario recibidos:", data);
        setUser({
          name: data.data.name,
          email: data.data.email,
          phone: data.data.phone,
        });
      })
      .catch((err) => {
        //console.error("❌ Error al traer usuario:", err);
      });
  }, []);

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

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
            <h2 className="text-2xl font-semibold mb-1 text-black">
              {user.name || "Usuario"}
            </h2>
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
                <p className="font-light">
                  {user.email || "Usuario@gmail.com"}
                </p>
              </div>
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
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <p className="font-light">{user.phone || "000-000-0000"}</p>
              </div>
            </div>
          </div>

          {/* Botones de navegación */}
          <div className="flex flex-col items-center gap-4 mt-auto">
            <button
              onClick={() => {
                onClose();
                router.push("/profile-settings"); //Cambiar a futuro
                window.location.reload();
              }}
              className="flex items-center gap-2 text-black hover:bg-gray-200 rounded-full py-2 px-6 text-lg font-semibold justify-center transition-colors w-full"
            >
              <Settings className="h-4 w-4" />
              Configuración
            </button>
            <button
              className="flex items-center gap-2 text-white hover:text-white rounded-full py-2 px-6 text-lg font-semibold justify-center shadow-md transition-colors w-full"
              style={{
                background: "linear-gradient(135deg, #8ECF0A 0%, #2EBAC6 100%)",
              }}
            >
              <LogOut className="h-5 w-5" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
