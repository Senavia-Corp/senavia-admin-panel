import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Pie, PieChart, Cell, XAxis, YAxis, ResponsiveContainer } from "recharts"

interface ChartData {
  name: string
  value: number
  color?: string
}

interface ChartSectionProps {
  title: string
  data: ChartData[]
  type: "bar" | "pie"
}

export function ChartSection({ title, data, type }: ChartSectionProps) {
  const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            value: {
              label: "Value",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            {type === "bar" ? (
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="#22c55e" />
              </BarChart>
            ) : (
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={120} dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            )}
          </ResponsiveContainer>
        </ChartContainer>
        {type === "pie" && (
          <div className="mt-4 space-y-2">
            {data.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span>{item.name}</span>
                </div>
                <span>0%</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
