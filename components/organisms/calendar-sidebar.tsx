"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CalendarIcon, List, Plus, X } from "lucide-react"
import type { CalendarEvent } from "@/types/dashboard"

interface CalendarSidebarProps {
  events: CalendarEvent[]
  isOpen: boolean
  onToggle: () => void
}

export function CalendarSidebar({ events, isOpen, onToggle }: CalendarSidebarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })
  }

  const getDayName = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()
  }

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-50 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
        size="sm"
      >
        <CalendarIcon className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 z-40 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold">{formatDate(currentDate)}</h2>
            <Button variant="ghost" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <CalendarIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {events.map((event, index) => {
            const eventDate = new Date(event.date)
            const dayName = getDayName(eventDate)
            const dayNumber = eventDate.getDate()

            return (
              <div key={event.id} className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    {dayNumber}
                  </span>
                  <span>{dayName}</span>
                </div>

                <div className="ml-8 space-y-2">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <div className="text-sm text-gray-600">{event.time}</div>
                      <div className="text-sm font-medium text-gray-900">{event.title}</div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Gregson Murcia GMT-05</span>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
