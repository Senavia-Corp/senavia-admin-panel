import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  percentageChange?: number;
  variant?: "default" | "success" | "warning" | "info";
  className?: string;
}

export function MetricCard({
  title,
  value,
  percentageChange,
  variant = "default",
  className,
}: MetricCardProps) {
  const variantStyles = {
    default: "bg-gray-100",
    success: "text-blacck h-[140px] bg-[#A7DB3F]",
    warning: "bg-yellow-500 text-white",
    info: "bg-blue-500 text-white",
  };

  return (
    <Card className={`${className || variantStyles[variant]} border-none`}>
      <CardContent className="p-6 flex flex-col justify-center h-full">
        <h3 className="font-inter font-semibold text-[16px] leading-[20px] tracking-normal mb-2 text-left w-full">
          {title}
        </h3>
        <div className="flex flex-row items-center justify-between w-full">
          <p className="text-[16px] font-semibold font-inter text-left">
            {value}
          </p>
          {percentageChange !== undefined && (
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium font-inter">
                {percentageChange > 0 ? "+" : ""}
                {percentageChange}%
              </span>
              {percentageChange > 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
