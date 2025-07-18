import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  percentageChange?: number
  variant?: "default" | "success" | "warning" | "info"
  className?: string
}

export function MetricCard({ title, value, percentageChange, variant = "default", className }: MetricCardProps) {
  const variantStyles = {
    default: "bg-gray-100",
    success: "bg-[#A9D941] text-blacck",
    warning: "bg-yellow-500 text-white",
    info: "bg-blue-500 text-white",
  }

  return (
    <Card className={`${className || variantStyles[variant]} border-none`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          {percentageChange !== undefined && (
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium">+{percentageChange}%</span>
              {percentageChange > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
