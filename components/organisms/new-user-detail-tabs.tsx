"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface NewUserDetailTabsProps {
  onBack: () => void
  children: React.ReactNode
}

export function NewUserDetailTabs({ onBack, children }: NewUserDetailTabsProps) {
  const [activeTab, setActiveTab] = useState("Profile Info")
  const tabs = ["Profile Info", "Requests", "Projects"]

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

      {/* Content Area - Full Screen */}
      <div className="bg-gray-900 rounded-lg p-6 flex-1 flex flex-col">
        {/* Tabs */}
        <div className="flex space-x-2 mb-6">
          {tabs.map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              onClick={() => setActiveTab(tab)}
              className={
                activeTab === tab
                  ? "bg-green-500 text-white hover:bg-green-600 rounded-full px-6 py-2"
                  : "bg-transparent border-green-500 text-green-500 hover:bg-green-50 rounded-full px-6 py-2"
              }
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Tab Content - Full Height */}
        <div className="bg-white rounded-lg flex-1 overflow-hidden">
          {activeTab === "Profile Info" &&
            React.Children.toArray(children).find(
              (child) => React.isValidElement(child) && child.props.tabName === "Profile Info",
            )}
          {activeTab === "Requests" &&
            React.Children.toArray(children).find(
              (child) => React.isValidElement(child) && child.props.tabName === "Requests",
            )}
          {activeTab === "Projects" &&
            React.Children.toArray(children).find(
              (child) => React.isValidElement(child) && child.props.tabName === "Projects",
            )}
        </div>
      </div>
    </div>
  )
}
