"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MoreHorizontal } from "lucide-react"
import type { ProjectPhase } from "@/types/task-management"

interface ProjectPhasesSidebarProps {
  selectedPhase: ProjectPhase
  onPhaseChange: (phase: ProjectPhase) => void
  projectPhase: ProjectPhase
}

export function ProjectPhasesSidebar({ selectedPhase, onPhaseChange, projectPhase }: ProjectPhasesSidebarProps) {
  const allPhases: { phase: ProjectPhase; label: string }[] = [
    { phase: "Analysis", label: "Phase 1 - Analysis" },
    { phase: "Design", label: "Phase 2 - Design" },
    { phase: "Development", label: "Phase 3 - Development" },
    { phase: "Deployment", label: "Phase 4 - Deployment" },
  ]

  // Determine available phases based on project progress
  const getAvailablePhases = (currentPhase: ProjectPhase): ProjectPhase[] => {
    const phases: ProjectPhase[] = ["Analysis", "Design", "Development", "Deployment"]
    const currentIndex = phases.indexOf(currentPhase)
    return phases.slice(0, currentIndex + 1)
  }

  const availablePhases = getAvailablePhases(projectPhase)

  return (
    <Card className="w-64 h-full bg-white border-r border-gray-200 rounded-none">
      <div className="p-4 space-y-2">
        {allPhases.map(({ phase, label }) => {
          const isAvailable = availablePhases.includes(phase)
          const isSelected = selectedPhase === phase

          return (
            <div key={phase} className="flex items-center justify-between">
              <Button
                variant={isSelected ? "default" : "ghost"}
                className={`flex-1 justify-start text-left ${
                  isSelected
                    ? "bg-gray-900 text-white"
                    : isAvailable
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-gray-400 cursor-not-allowed"
                }`}
                onClick={() => isAvailable && onPhaseChange(phase)}
                disabled={!isAvailable}
              >
                {label}
              </Button>
              {isAvailable && (
                <Button variant="ghost" size="sm" className="p-1 ml-2">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
