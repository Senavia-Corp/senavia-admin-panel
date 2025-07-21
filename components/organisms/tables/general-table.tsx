"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RoleTableRow } from "@/components/molecules/role-table-row";
import { Plus, Search, Filter } from "lucide-react";
import type { Role } from "@/types/role-management";

const mockRoles: Role[] = [
  {
    id: "1",
    name: "Admin",
    isActive: true,
    permissions: ["p1", "p2"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Editor",
    isActive: false,
    permissions: ["p3"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Viewer",
    isActive: true,
    permissions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function GeneralTable(Title:string, TitleDescription:string, SubTitle:string, SubTitleDescription:string,TableTitle:string[]) {
  const [roles, setRoles] = useState<Role[]>(mockRoles);

  const onViewRole = (role: Role) => {
    console.log("View role:", role);
  };

  const onDeleteRole = (role: Role) => {
    console.log("Delete role:", role);
    setRoles(roles.filter((r) => r.id !== role.id));
  };

  return (
    <div className="flex flex-col h-full space-y-1 w-full mb-5">
      {/* Add Role Section */}
      <Card className="bg-[#04081E] text-white flex-shrink-0 h-24 w-full items-center">
        <CardHeader className="flex flex-row items-center justify-between py-5 px-5 h-full">
          <div>
            <h2 className="text-2xl font-normal">{Title}</h2>
            <p className="">{TitleDescription}</p>
          </div>
          <Button className="[&_svg]:size-7 bg-[#99CC33] hover:bg-[#99CC33]/80 text-white rounded-full w-12 h-12 p-0">
            <Plus color="#04081E" strokeWidth={3} />
          </Button>
        </CardHeader>
      </Card>
      <Card className="bg-[#04081E] text-white flex flex-col w-full">
        <CardHeader className="flex-shrink-0 px-5 py-5">
          <div className="flex items-center justify-between w-full">
            <div>
              <h2 className="text-2xl font-normal">{SubTitle}</h2>
              <p className="">{SubTitleDescription}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {/* PoP over WIP */}
                <Filter className="h-5 w-5" />
              </div>
              <div className="relative">
                <Search
                  color="#04081E"
                  className="absolute left-2 top-1/2 transform z -translate-y-1/2 h-5 w-5 text-gray-400"
                />
                {/* Search Input WIP*/}
                <Input
                  className="pl-10 xl:w-80 bg-white border-gray-700 text-black rounded-md"
                  placeholder="Search"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0 px-5 pb-5">
          <div className="bg-white rounded-lg overflow-auto flex-1 flex flex-col w-full min-h-0 p-0 lg:p-5">
            <table className="w-full min-w-[700px] border-separate border-spacing-y-2.5">
              <thead className="bg-[#E1E4ED] sticky top-0 z-10">
                {TableTitle.map((title, index) => (
                  <th key={index} className="p-5 text-center text-2xl font-semibold text-[#616774] whitespace-nowrap">
                    {title}
                  </th>
                ))}
              </thead>
              <tbody className="bg-white">
                {roles.map((role) => (
                  <RoleTableRow
                    key={role.id}
                    role={role}
                    onView={() => onViewRole(role)}
                    onDelete={() => onDeleteRole(role)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
