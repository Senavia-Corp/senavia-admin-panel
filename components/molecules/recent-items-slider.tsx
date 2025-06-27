import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/atoms/status-badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RecentItem {
  id: string
  name: string
  status: string
  subtitle: string
}

interface RecentItemsSliderProps {
  title: string
  items: RecentItem[]
}

export function RecentItemsSlider({ title, items }: RecentItemsSliderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {/* Responsive grid that shows more items on larger screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {items.slice(0, 4).map((item) => (
          <Card key={item.id} className="bg-gray-400 text-white">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <StatusBadge status={item.status} />
              </div>
              <h4 className="font-semibold text-lg mb-1 truncate">{item.name}</h4>
              <p className="text-sm opacity-90 truncate">{item.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
