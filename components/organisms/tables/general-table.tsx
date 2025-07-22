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
import { RoleTableRow } from "@/components/organisms/tables/row/role-table-row";
import { PermissionTableRow } from "@/components/organisms/tables/row/permission-table-row";
import { Plus, Search, Filter } from "lucide-react";

type GeneralTableHandlers = {
  onCreate: () => void;
  onView: (item: any) => void;
  onDelete: (item: any) => void;
  onSearch: (term: string) => void;
  onFilter: (filter: string) => void;
}

export function GeneralTable(
  Page: string,
  Title: string,
  TitleDescription: string,
  SubTitle: string,
  SubTitleDescription: string,
  TableTitle: string[],
  data: any[],
  handlers: GeneralTableHandlers
) {
  const { onCreate, onView, onDelete, onSearch, onFilter } = handlers;

  return (
    <div className="flex flex-col h-full space-y-1 w-full mb-5">
      {/* Add Role Section */}
      <Card className="bg-[#04081E] text-white flex-shrink-0 h-24 w-full items-center">
        <CardHeader className="flex flex-row items-center justify-between py-5 px-5 h-full">
          <div>
            <h2 className="text-2xl font-normal">{Title}</h2>
            <p className="">{TitleDescription}</p>
          </div>
          <Button
            onClick={onCreate}
            className="[&_svg]:size-7 bg-[#99CC33] hover:bg-[#99CC33]/80 text-white rounded-full w-12 h-12 p-0"
          >
            <Plus color="#04081E" strokeWidth={3} />
          </Button>
        </CardHeader>
      </Card>
      <Card className="bg-[#04081E] text-white flex flex-col w-full overflow-auto">
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

                <Input
                  className="pl-10 xl:w-80 bg-white border-gray-700 text-black rounded-md"
                  placeholder="Search"
                  onChange={(e) => onSearch(e.target.value)}
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
                  <th
                    key={index}
                    className="p-5 text-center text-base lg:text-2xl font-semibold text-[#616774] whitespace-nowrap"
                  >
                    {title}
                  </th>
                ))}
              </thead>
              <tbody className="bg-white relative z-0">
                {data.map((item) => {
                  switch (Page.toLowerCase()) {
                    case 'roles-page':
                      return <RoleTableRow key={item.id} role={item} onView={() => onView(item)} onDelete={() => onDelete(item)} />;
                    case 'permissions-page':
                      return <PermissionTableRow key={item.id} permission={item} onView={() => onView(item)} onDelete={() => onDelete(item)} />;
                    default:
                      return null;
                  }
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
