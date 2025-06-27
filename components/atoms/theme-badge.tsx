import { Badge } from "@/components/ui/badge"

interface ThemeBadgeProps {
  theme: string
  color?: string
}

export function ThemeBadge({ theme, color = "#6B7280" }: ThemeBadgeProps) {
  return (
    <Badge className="text-white font-medium px-3 py-1 rounded-full" style={{ backgroundColor: color }}>
      {theme}
    </Badge>
  )
}
