"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RoleTableRow } from "@/components/organisms/tables/row/role-table-row";
import { PermissionTableRow } from "@/components/organisms/tables/row/permission-table-row";
import { Plus, Search, Filter } from "lucide-react";
import { BillingTableRow } from "@/components/organisms/tables/row/billing-table-row";
import { UserTableRow } from "@/components/organisms/tables/row/user-table-row";
import { ContractTableRow } from "@/components/organisms/tables/row/contract-table-row";
import { BlogTableRow } from "@/components/organisms/tables/row/blog-table-row";
import { TestimonialVideoTableRow } from "@/components/organisms/tables/row/testimonial-video-table-row";
import { LeadTableRow } from "@/components/organisms/tables/row/lead-table-row";
import { ProjectTableRow } from "@/components/organisms/tables/row/project-table-row";
import { SupportTableRow } from "@/components/organisms/tables/row/ticket-table-row";
import { CostTableRow } from "@/components/organisms/tables/row/cost-table-row";
import {
  FilterBilling,
  FilterPermission,
  FilterRole,
  FilterUser,
  FilterContract,
} from "@/components/organisms/tables/filter/filter-model";
import { FilterLead } from "@/components/organisms/tables/filter/filter-lead";
import { FilterProject } from "@/components/organisms/tables/filter/filter-project";
import { PortfolioTableRow } from "./row/portfolio-table-row";
import { EmptyState } from "@/components/atoms/empty-state";
import { ErrorState } from "@/components/atoms/error-state";

{
  /* HANDLERS */
}
type GeneralTableHandlers = {
  onCreate: () => void;
  onView: (item: any) => void;
  onDelete: (item: any) => void;
  onSearch: (term: string) => void;
  onFilter: (filter: string) => void;
  onViewTasks?: (item: any) => void;
  onEdit?: (item: any) => void;
};

export function GeneralTable(
  Page: string,
  Title: string,
  TitleDescription: string,
  SubTitle: string,
  SubTitleDescription: string,
  TableTitle: string[],
  data: any[],
  handlers: GeneralTableHandlers,
  options?: {
    isLoading?: boolean;
    hasError?: boolean;
    onRetry?: () => void;
    emptyStateTitle?: string;
    emptyStateDescription?: string;
    skeletonComponent?: React.ComponentType;
    skeletonCount?: number;
  }
) {
  const {
    onCreate,
    onView,
    onDelete,
    onSearch,
    onFilter,
    onViewTasks,
    onEdit,
  } = handlers;

  const {
    isLoading = false,
    hasError = false,
    onRetry,
    emptyStateTitle = "No data available",
    emptyStateDescription = "No records found to display.",
    skeletonComponent: SkeletonComponent,
    skeletonCount = 5,
  } = options || {};

  const tableRows = data
    .filter((item) => item && item.id)
    .map((item) => {
      switch (Page.toLowerCase()) {
        case "roles-page":
          return (
            <RoleTableRow
              key={item.id}
              role={item}
              onView={() => onView(item)}
              onDelete={() => onDelete(item)}
            />
          );
        case "permissions-page":
          return (
            <PermissionTableRow
              key={item.id}
              permission={item}
              onView={() => onView(item)}
              onDelete={() => onDelete(item)}
            />
          );
        case "billing-page":
          return (
            <BillingTableRow
              key={item.id}
              billing={item}
              onView={() => onView(item)}
              onDelete={() => onDelete(item)}
            />
          );
        case "users-page":
          return (
            <UserTableRow
              key={item.id}
              user={item}
              onView={() => onView(item)}
              onDelete={() => onDelete(item)}
              onEdit={onEdit ? () => onEdit(item) : undefined}
            />
          );
        case "contracts-page":
          return (
            <ContractTableRow
              key={item.id}
              contract={item}
              onView={() => onView(item)}
              onDelete={() => onDelete(item)}
              onEdit={onEdit ? () => onEdit(item) : undefined}
            />
          );
        case "blogs-page":
          return (
            <BlogTableRow
              key={item.id}
              blog={item}
              onView={() => onView(item)}
              onDelete={() => onDelete(item)}
            />
          );
        case "testimonial-videos-page":
          return (
            <TestimonialVideoTableRow
              key={item.id}
              item={item}
              onView={() => onView(item)}
              onDelete={() => onDelete(item)}
            />
          );
        case "leads-page":
          return (
            <LeadTableRow
              key={item.id}
              lead={item}
              onView={() => onView(item)}
              onDelete={() => onDelete(item)}
            />
          );
        case "projects-page":
          return (
            <ProjectTableRow
              key={item.id}
              project={item}
              onView={() => onView(item)}
              onDelete={() => onDelete(item)}
              onViewTasks={() => onViewTasks?.(item)}
            />
          );
        case "tickets-page":
          return (
            <SupportTableRow
              key={item.id}
              ticket={item}
              onView={() => onView(item)}
              onDelete={() => onDelete(item)}
            />
          );
        case "portfolio-page":
          return (
            <PortfolioTableRow
              key={item.id}
              product={item}
              onView={() => onView?.(item)}
              onDelete={() => onDelete?.(item)}
            />
          );
        case "costs-page":
          return (
            <CostTableRow
              key={item.id}
              cost={item}
              onView={() => onView(item)}
              onDelete={() => onDelete(item)}
            />
          );
        default:
          return null;
      }
    });

  const filterComponent = (() => {
    switch (Page.toLowerCase()) {
      case "permissions-page":
        return <FilterPermission onFilter={onFilter} />;
      case "roles-page":
        return <FilterRole onFilter={onFilter} />;
      case "billing-page":
        return <FilterBilling onFilter={onFilter} />;
      case "users-page":
        return <FilterUser onFilter={onFilter} />;
      case "contracts-page":
        return <FilterContract onFilter={onFilter} />;
      case "leads-page":
        return <FilterLead onFilter={onFilter} />;
      case "projects-page":
        return <FilterProject onFilter={onFilter} />;
      case "costs-page":
      // return <FilterCost onFilter={onFilter} />;
      default:
        return null;
    }
  })();

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
            <Plus className="h-5 w-5" color="#04081E" strokeWidth={3} />
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
                {filterComponent}
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
          <div className="bg-white rounded-lg flex-1 flex flex-col w-full min-h-0 p-0 lg:p-5">
            {/* Fixed header (not scrollable) */}
            <div className="w-full overflow-hidden">
              <table className="w-full min-w-[700px] table-fixed">
                <thead className="bg-[#E1E4ED]">
                  <tr>
                    {TableTitle.map((title, index) => (
                      <th
                        key={index}
                        className="p-5 text-center text-base lg:text-2xl font-semibold text-[#616774] whitespace-nowrap"
                      >
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>
              </table>
            </div>
            {/* Scrollable body */}
            <div className="flex-1 min-h-0 overflow-auto">
              <table className="w-full min-w-[700px] table-fixed">
                <tbody className="bg-white">
                  {/* PAGES AND CORRESPONDING ROWS */}
                  {isLoading ? (
                    SkeletonComponent ? (
                      Array.from({ length: skeletonCount }).map((_, index) => (
                        <SkeletonComponent key={index} />
                      ))
                    ) : (
                      // For other pages, show a simple loading message
                      <tr>
                        <td
                          colSpan={TableTitle.length}
                          className="text-center py-8 text-gray-500"
                        >
                          Loading...
                        </td>
                      </tr>
                    )
                  ) : hasError ? (
                    <tr>
                      <td colSpan={TableTitle.length} className="p-0">
                        <ErrorState onRetry={onRetry} />
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={TableTitle.length} className="p-0">
                        <EmptyState
                          title={emptyStateTitle}
                          description={emptyStateDescription}
                        />
                      </td>
                    </tr>
                  ) : (
                    tableRows
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
