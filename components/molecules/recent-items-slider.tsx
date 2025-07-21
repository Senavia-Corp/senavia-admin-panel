import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/atoms/status-badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecentItem {
  id: string;
  name: string;
  status: string;
  subtitle: string;
}

interface RecentItemsSliderProps {
  title: string;
  items: RecentItem[];
}

export function RecentItemsSlider({ title, items }: RecentItemsSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Mouse events for drag-to-scroll
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };
  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1.5; // scroll speed
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <div className="space-y-4 p-4 pb-8 bg-[#F0F0F2] px-4 rounded-lg w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[#0D1440] mt-4">{title}</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              scrollRef.current &&
              scrollRef.current.scrollBy({ left: -350, behavior: "smooth" })
            }
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              scrollRef.current &&
              scrollRef.current.scrollBy({ left: 350, behavior: "smooth" })
            }
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className={`flex select-none overflow-x-auto space-x-4 pb-2 cursor-grab active:cursor-grabbing w-full max-w-full`}
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE 10+
        }}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        {/* Oculta la barra de scroll en Chrome/Webkit */}

        {items.map((item) => (
          <Card
            key={item.id}
            className="bg-[#9FAABF] text-white w-[350px] flex-shrink-0"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <StatusBadge status={item.status} />
              </div>
              <h4 className="font-semibold text-lg mb-1 truncate">
                {item.name}
              </h4>
              <p className="text-sm opacity-90 truncate">{item.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
