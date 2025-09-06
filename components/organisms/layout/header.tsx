"use client";

import { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { ProfileDrawer } from "@/components/molecules/profile-drawer";
// import { useUser } from "@/context/UserContext";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileDropdowns, setMobileDropdowns] = useState<
    Record<string, boolean>
  >({});
  const [areaDropdowns, setAreaDropdowns] = useState<Record<string, boolean>>(
    {}
  );
  // const { user, isLoggedIn, setUser, setIsLoggedIn } = useUser();

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
      <header
        className={`bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0 sticky top-0 ${
          isMenuOpen ? "blur-sm" : ""
        } transition-all duration-300`}
        style={{ zIndex: isMenuOpen ? 30 : 50 }}
      >
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
            <button
              onClick={toggleMenu}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-[#8ECF0A] via-[#39cac0] to-[#8ECF0A] rounded-full flex items-center justify-center">
                <span className="text-white text-sm">{ '迅'}</span>
              </div>
              <span className="text-sm font-medium">{ 'Username'}</span>
            </button>
          </div>
        </div>
      </header>

      <ProfileDrawer
        isOpen={isMenuOpen}
        onClose={toggleMenu}
        username={ 'Username'}
        email={ 'Username'}
        imageUrl={ 'Username'}
      />
    </>
  );
}
