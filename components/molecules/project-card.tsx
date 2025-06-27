"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, ImageIcon } from "lucide-react"
import type { UserProject } from "@/types/user-management"

interface ProjectCardProps {
  project: UserProject
  onEdit?: () => void
  onChangeImage?: () => void
  onClick?: () => void
}

export function ProjectCard({ project, onEdit, onChangeImage, onClick }: ProjectCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={project.backgroundImage || "/placeholder.svg"}
            alt={project.name}
            className="w-full h-32 object-cover rounded-t-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-t-lg flex flex-col justify-between p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold flex items-center gap-2">
                {project.name}
                {onEdit && (
                  <Edit
                    className="h-4 w-4 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit()
                    }}
                  />
                )}
              </h3>
            </div>
            <div className="flex items-center justify-between">
              {onChangeImage && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onChangeImage()
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <ImageIcon className="h-4 w-4 mr-1" />
                  Change Image
                </Button>
              )}
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-blue-500 text-white">
                  {project.status}
                </Badge>
                <Badge variant="secondary" className="bg-purple-500 text-white">
                  {project.phase}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
