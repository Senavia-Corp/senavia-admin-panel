"use client";

import { useState, useEffect } from "react";
import { GeneralTable } from "@/components/organisms/tables/general-table";
import { DetailTabs } from "../molecules/detail-tabs";
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog";
import { UserManagementService } from "@/services/user-management-service";
import type { User } from "@/types/user-management";
import DashboardPage from "./dashboard/dashboard-page";
import { CreateUserForm } from "./dashboard/create-user-form";
import UserSettings from "./user-settings";
import { useToast } from "@/hooks/use-toast";

export function UsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreatePage, setShowCreatePage] = useState(false);
  const [showEditPage, setShowEditPage] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const loadUsers = async () => {
    try {
      setUsers(await UserManagementService.getUsers(searchTerm, roleFilter));
    } catch (error) {
      console.error("Error loading users:", error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (user: User) => {
    try {
      await UserManagementService.deleteUser(user.id);
      setUserToDelete(null);
      loadUsers();
      toast({ title: "Success", description: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = (filter: string) => {
    const [type, value] = filter.split(":");
    if (type === "role") setRoleFilter(value === "all" ? "" : value);
  };

  useEffect(() => {
    loadUsers();
  }, [searchTerm, roleFilter]);

  if (showEditPage) {
    return (
      <div className="min-h-screen w-full bg-white">
        <div className="p-6">
          <DetailTabs
            title="Edit User Information"
            onBack={() => {
              setShowEditPage(false);
              setSelectedUser(null);
            }}
          >
            <UserSettings user={selectedUser} />
          </DetailTabs>
        </div>
      </div>
    );
  }

  if (showCreatePage) {
    return (
      <div className="min-h-screen w-full bg-white">
        <div className="p-6">
          <DetailTabs
            title="User Details"
            onBack={() => setShowCreatePage(false)}
          >
            <CreateUserForm />
          </DetailTabs>
        </div>
      </div>
    );
  }

  if (selectedUser) {
    return (
      <div className="min-h-screen w-full bg-white">
        <div className="p-6">
          <DetailTabs
            title="User Information"
            onBack={() => setSelectedUser(null)}
          >
            <DashboardPage />
          </DetailTabs>
        </div>
      </div>
    );
  }

  const handlers = {
    onCreate: () => setShowCreatePage(true),
    onView: setSelectedUser,
    onEdit: (user: User) => {
      setSelectedUser(user);
      setShowEditPage(true);
    },
    onDelete: setUserToDelete,
    onSearch: setSearchTerm,
    onFilter: handleFilterChange,
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <main className="flex-1 bg-gray-50 overflow-auto">
        <div className="p-6 h-full w-full">
          <div className="flex flex-col h-full w-full">
            <div className="flex items-center mb-6 flex-shrink-0">
              <div className="w-1 h-[36px] bg-[#99CC33] mr-3" />
              <h1 className="font-sans font-medium text-[25px] leading-none tracking-normal align-middle text-gray-900">
                User Management
              </h1>
            </div>
            <div className="flex-1 min-h-0">
              {GeneralTable(
                "users-page",
                "Add User",
                "Create new user accounts with specific roles and permissions",
                "All Users",
                "View and manage all user accounts in the system",
                ["User ID", "Name", "Role", "Email", "Phone", "Actions"],
                users,
                handlers
              )}
            </div>
          </div>
        </div>
      </main>
      <DeleteConfirmDialog
        open={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={() => userToDelete && handleDeleteUser(userToDelete)}
        title="Delete User"
        description={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
}
