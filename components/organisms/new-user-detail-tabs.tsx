"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface NewUserDetailTabsProps {
  onBack: () => void;
  children: React.ReactNode;
}

export function NewUserDetailTabs({
  onBack,
  children,
}: NewUserDetailTabsProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="bg-gray-900 text-white hover:bg-gray-800 rounded-full w-10 h-10 p-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">User Information</h1>
      </div>
      {/* Content Area */}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
