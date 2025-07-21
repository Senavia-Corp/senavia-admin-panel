import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

interface ChartSectionProps {
  title: string;
  data: ChartData[];
  type: "bar" | "pie";
  barColors?: string[]; // Opcional: colores alternos para las barras
  barRadius?: number; // Opcional: radio de borde para las barras
  hideYAxisTicks?: boolean; // Opcional: ocultar ticks duplicados
  hideGrid?: boolean; // Opcional: ocultar grid
  customCardClassName?: string; // Opcional: clases personalizadas para el Card
  customTitleClassName?: string; // Opcional: clases personalizadas para el título
  barSize?: number; // Opcional: ancho de cada barra
  barCategoryGap?: number | string; // Opcional: separación entre barras
  customContentClassName?: string; // Opcional: clase personalizada para CardContent
  pieColors?: string[]; // Opcional: colores personalizados para el pie chart
}

export function ChartSection({
  title,
  data,
  type,
  barColors,
  barRadius,
  hideYAxisTicks,
  hideGrid,
  customCardClassName,
  customTitleClassName,
  barSize,
  barCategoryGap,
  customContentClassName,
  pieColors,
}: ChartSectionProps) {
  const COLORS = ["#0B114B", "#A7D941", "#0B114B", "#32D9C8", "#8b5cf6"];
  // Si se pasan pieColors, usarlas, si no usar COLORS
  const pieChartColors = pieColors && pieColors.length > 0 ? pieColors : COLORS;
  // Calcular porcentajes
  const total = data.reduce((acc, d) => acc + d.value, 0);

  let chartContent;
  if (type === "bar") {
    chartContent = (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
          barCategoryGap={
            barCategoryGap !== undefined ? barCategoryGap : undefined
          }
        >
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis
            tick={hideYAxisTicks ? { fill: "transparent" } : undefined}
            axisLine={false}
            tickLine={false}
          />
          {!hideGrid && <CartesianGrid strokeDasharray="3 3" />}
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="value"
            radius={barRadius ?? 0}
            barSize={barSize !== undefined ? barSize : undefined}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  barColors ? barColors[index % barColors.length] : "#22c55e"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  } else {
    chartContent = (
      <div className="w-full">
        <div className="flex flex-col items-center justify-center md:flex-row w-full h-[300px]">
          <div className="w-full flex justify-center items-center md:flex-[0_0_60%] h-full">
            <div className="w-[220px] h-[220px] md:w-full md:h-full flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    dataKey="value"
                    stroke="#EFF1F7"
                    strokeWidth={6}
                    paddingAngle={2}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={pieChartColors[index % pieChartColors.length]}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Leyenda única, responsiva */}
          <div
            className="flex flex-col items-center justify-center gap-y-2 mt-8 w-full
            md:mt-0 md:pl-4 md:items-start md:justify-center md:flex-1 md:min-w-[180px] md:h-full md:static md:flex
            order-2 md:order-none"
          >
            {data.map((item, index) => (
              <div key={item.name} className="flex items-center space-x-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      pieChartColors[index % pieChartColors.length],
                    display: "inline-block",
                  }}
                />
                <span className="text-[#0B114B] text-sm font-medium">
                  {item.name}
                </span>
                <span className="text-[#0B114B] text-sm font-medium ml-2">
                  {total > 0
                    ? `${Math.round((item.value / total) * 100)}%`
                    : "0%"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={customCardClassName ? customCardClassName : "h-full"}>
      <CardHeader>
        <CardTitle
          className={
            customTitleClassName
              ? customTitleClassName
              : "text-lg font-semibold"
          }
        >
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent
        className={customContentClassName ? customContentClassName : undefined}
      >
        <ChartContainer
          config={{
            value: {
              label: "Value",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px] w-full"
        >
          {chartContent}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
