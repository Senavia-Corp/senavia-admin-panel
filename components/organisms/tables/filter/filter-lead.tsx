"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Plus } from "lucide-react";

interface FilterLeadProps {
  onFilter: (filter: string) => void;
}

export function FilterLead({ onFilter }: FilterLeadProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleStatusFilter = (value: string) => {
    setSelectedStatus(value);
    onFilter(value);
  };

  const statuses = [
    "SEND",
    "PROCESSING",
    "ESTIMATING",
    "FINISHED",
  ];

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        onClick={toggleFilters}
        className="[&_svg]:size-7 "
      >
        <Filter className="h-5 w-5" />
      </Button>
      {showFilters && (
        <Select value={selectedStatus} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-32 bg-gray-800 border-gray-700">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
