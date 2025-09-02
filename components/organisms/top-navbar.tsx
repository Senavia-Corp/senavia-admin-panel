"use client";

import { ArrowLeft, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TopNavbarProps {
  showBackButton?: boolean;
  onBack?: () => void;
  title?: string;
  subtitle?: string;
}

export function TopNavbar({
  showBackButton,
  onBack,
  title,
  subtitle,
}: TopNavbarProps) {
  // return (
  //   <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
  //     <SidebarTrigger className="-ml-1" />

  //     {showBackButton && onBack && (
  //       <Button
  //         variant="ghost"
  //         size="sm"
  //         onClick={onBack}
  //         className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
  //       >
  //         <ArrowLeft className="h-4 w-4" />
  //       </Button>
  //     )}

  //     {/* <div className="flex items-center gap-2">
  //       <img src="/images/senavia-logo.png" alt="Senavia" className="h-8 w-8 object-contain" />
  //       {subtitle && <h1 className="text-lg font-semibold text-gray-900">{subtitle}</h1>}
  //     </div> */}

  //     <div className="ml-auto flex items-center gap-4">
  //       <Button variant="ghost" size="sm" className="relative">
  //         <Bell className="h-5 w-5 text-gray-600" />
  //         <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
  //       </Button>

  //       <div className="flex items-center gap-3">
  //         <Avatar className="h-8 w-8">
  //           <AvatarImage src="/placeholder.svg?height=32&width=32" />
  //           <AvatarFallback className="bg-green-100 text-green-700 text-sm font-medium">
  //             UN
  //           </AvatarFallback>
  //         </Avatar>
  //         <span className="text-sm font-medium text-gray-700">Username</span>
  //       </div>
  //     </div>
  //   </header>
  // );
}
