"use client";

import { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { ProfileDrawer } from "@/components/molecules/profile-drawer";

function HamburgerButton({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) {
  return (
    <button
      className="relative w-9 h-9 flex flex-col items-center justify-center"
      onClick={onClick}
      aria-label="Toggle menu"
      type="button"
      style={{ outline: "none", border: "none" }}
    >
      {/* Línea superior */}
      <span
        className={`block absolute left-2 right-2 h-0.5 bg-black rounded transition-all duration-200 ${isOpen ? "top-5 rotate-45" : "top-3 rotate-0"}`}
      />
      {/* Línea central */}
      <span
        className={`block absolute left-2 right-2 h-0.5 bg-black rounded transition-all duration-200 ${isOpen ? "opacity-0" : "top-5 opacity-100"}`}
      />
      {/* Línea inferior */}
      <span
        className={`block absolute left-2 right-2 h-0.5 bg-black rounded transition-all duration-200 ${isOpen ? "top-5 -rotate-45" : "top-7 rotate-0"}`}
      />
    </button>
  );
}


export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileDropdowns, setMobileDropdowns] = useState<Record<string, boolean>>({});
  const [areaDropdowns, setAreaDropdowns] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isMenuOpen) {
      setMobileDropdowns({});
      setAreaDropdowns({});
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className={`bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0 sticky top-0 ${isMenuOpen ? 'blur-sm' : ''} transition-all duration-300`} style={{ zIndex: isMenuOpen ? 30 : 50 }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center space-x-2">
              <img
                src="/images/senavia-logo.png"
                alt="Logo de Senavia"
                className="w-8 h-8 object-contain"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">迅</span>
              </div>
              <span className="text-sm font-medium">Username</span>
            </div>
            <HamburgerButton isOpen={isMenuOpen} onClick={toggleMenu} />
          </div>
        </div>
      </header>

      <ProfileDrawer 
        isOpen={isMenuOpen}
        onClose={toggleMenu}
        username="Username"
        email="admin@example.com"
      />
    </>
  );
}