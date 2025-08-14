import { useState } from "react";
import {
  AssociatedService,
  PermissionAction,
  PermissionStatus,
} from "@/types/permission-management";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
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
import { RoleStatus } from "@/types/role-management";

const actions: PermissionAction[] = ["View", "Create", "Update", "Delete"];
const services: AssociatedService[] = [
  "Users",
  "Blogs",
  "Leads",
  "Projects",
  "Dashboard",
  "Contracts",
  "Billing",
  "Technical Support",
  "Manage Content",
  "Roles",
  "Permissions",
];
const statuses: PermissionStatus[] = ["Active", "Inactive"];

export const FilterPermission = ({
  onFilter,
}: {
  onFilter: (filter: string) => void;
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAction, setSelectedAction] = useState("all");
  const [selectedService, setSelectedService] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const toggleFilters = () => setShowFilters((prev) => !prev);

  const handleActionFilter = (value: string) => {
    setSelectedAction(value);
    onFilter(`action:${value}`);
  };
  const handleServiceFilter = (value: string) => {
    setSelectedService(value);
    onFilter(`service:${value}`);
  };
  const handleStatusFilter = (value: string) => {
    setSelectedStatus(value);
    onFilter(`status:${value}`);
  };

  return (
    <>
      <Button
        variant="ghost"
        onClick={toggleFilters}
        className="[&_svg]:size-7"
      >
        <Filter className="h-5 w-5" />
      </Button>
      {showFilters && (
        <>
          <Select value={selectedAction} onValueChange={handleActionFilter}>
            <SelectTrigger className="w-32 bg-gray-800 border-gray-700">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              {actions.map((action) => (
                <SelectItem key={action} value={action}>
                  {action}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedService} onValueChange={handleServiceFilter}>
            <SelectTrigger className="w-40 bg-gray-800 border-gray-700">
              <SelectValue placeholder="Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              {services.map((service) => (
                <SelectItem key={service} value={service}>
                  {service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
        </>
      )}
    </>
  );
};

export const FilterRole = ({
  onFilter,
}: {
  onFilter: (filter: string) => void;
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");

  const toggleFilters = () => setShowFilters((prev) => !prev);

  const handleStatusFilter = (value: string) => {
    setSelectedStatus(value);
    onFilter(`status:${value}`);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Filter className="h-5 w-5" />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 m-0 bg-gray-800 border-gray-700">
        <Select value={selectedStatus} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white">
            <SelectItem value="all" className="text-white">
              All Status
            </SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status} value={status} className="text-white">
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PopoverContent>
    </Popover>
  );
};

const billingStatuses = [
  "Created",
  "Processing",
  "InReview",
  "Rejected",
  "Accepted",
  "Invoice",
  "Paid",
];

export const FilterBilling = ({
  onFilter,
}: {
  onFilter: (filter: string) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onFilter(`search:${value}`);
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    onFilter(`status:${status}`);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Filter className="h-5 w-5" />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 m-0 bg-gray-800 border-gray-700">
        <Select value={selectedStatus} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {billingStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PopoverContent>
    </Popover>
  );
};

// User filter component
export const FilterUser = ({
  onFilter,
}: {
  onFilter: (filter: string) => void;
}) => {
  const [selectedRole, setSelectedRole] = useState<string>("all");

  const handleRoleFilter = (role: string) => {
    setSelectedRole(role);
    onFilter(`role:${role}`);
  };

  // Roles que coinciden con los IDs en UserManagementService
  const userRoles = [
    { id: "1", name: "Administrator" },
    { id: "2", name: "Customer" },
    { id: "3", name: "Developer" },
    { id: "4", name: "Designer" },
  ];

  return (
    <Popover>
      <PopoverTrigger>
        <Filter className="h-5 w-5" />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 m-0 bg-gray-800 border-gray-700">
        <Select value={selectedRole} onValueChange={handleRoleFilter}>
          <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {userRoles.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PopoverContent>
    </Popover>
  );
};

// Contract filter component
export const FilterContract = ({
  onFilter,
}: {
  onFilter: (filter: string) => void;
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    onFilter(`status:${status}`);
  };

  // Contract statuses
  const contractStatuses = ["Signed", "Not Signed"];

  return (
    <Popover>
      <PopoverTrigger>
        <Filter className="h-5 w-5" />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 m-0 bg-gray-800 border-gray-700">
        <Select value={selectedStatus} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {contractStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PopoverContent>
    </Popover>
  );
};
