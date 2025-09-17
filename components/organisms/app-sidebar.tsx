"use client";

import {
  Users,
  FileText,
  DollarSign,
  FolderOpen,
  HeadphonesIcon,
  Edit3,
  Target,
  Settings,
  BarChart3,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: BarChart3,
  },
  {
    title: "Manage Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Contracts",
    url: "/contracts",
    icon: FileText,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: DollarSign,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: FolderOpen,
  },
  {
    title: "Technical Support",
    url: "/support",
    icon: HeadphonesIcon,
  },
  {
    title: "Manage Content",
    url: "/content",
    icon: Edit3,
  },
  {
    title: "Leads",
    url: "/leads",
    icon: Target,
  },
  { title: "Clause", url: "/clause", icon: Target },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200 bg-white">
      <SidebarHeader className="p-6 group-data-[collapsible=icon]:p-2">
        <div className="flex items-center justify-center group-data-[collapsible=icon]:justify-center">
          <img
            src="/images/senavia-full-logo.png"
            alt="Senavia"
            className="h-8 object-contain group-data-[collapsible=icon]:h-6"
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                if (item.title === "Manage Content") {
                  return (
                    <Collapsible key={item.title} className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.title}
                            className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                          >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            <span className="group-data-[collapsible=icon]:sr-only">
                              {item.title}
                            </span>
                            <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <Link href="/content/blogs">Blogs</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <Link href="/content/testimonial-videos">
                                  Testimonial Videos
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <Link href="/content/portfolio">Portfolio</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                if (item.title === "Manage Users") {
                  return (
                    <Collapsible key={item.title} className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.title}
                            className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                          >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            <span className="group-data-[collapsible=icon]:sr-only">
                              {item.title}
                            </span>
                            <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <Link href="/users">Users</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <Link href="/users/roles">Roles</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild>
                                <Link href="/users/permissions">
                                  Permissions
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <Link
                        href={item.url}
                        className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="group-data-[collapsible=icon]:sr-only">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:p-2">
        <Button className="w-full bg-gray-800 text-white hover:bg-gray-700 rounded-full group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0">
          <Settings className="h-4 w-4 group-data-[collapsible=icon]:mr-0 mr-2" />
          <span className="group-data-[collapsible=icon]:sr-only">
            Settings
          </span>
        </Button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
