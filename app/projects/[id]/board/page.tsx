"use client"

import { useParams, useRouter } from "next/navigation"
import { ProjectBoardPage } from "@/components/pages/project-board-page"

export default function ProjectBoard() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const handleBack = () => {
    router.push("/projects")
  }

  return (
    <div className="h-screen">
      <ProjectBoardPage projectId={projectId} onBack={handleBack} />
    </div>
  )
}
