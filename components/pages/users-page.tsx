"use client";

import { useState, useEffect } from "react";
import { GeneralTable } from "@/components/organisms/tables/general-table";
import { DetailTabs } from "../molecules/detail-tabs";
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog";
import { UserManagementService } from "@/services/user-management-service";
import type { User } from "@/types/user-management";
import DashboardPage from "./dashboard/user-panel";
import { CreateUserForm } from "./dashboard/create-user-form";
import UserSettings from "./user-settings";
import { useToast } from "@/hooks/use-toast";
import { TableRowSkeleton } from "@/components/atoms/table-row-skeleton";

export function UsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreatePage, setShowCreatePage] = useState(false);
  const [showEditPage, setShowEditPage] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const usersData = await UserManagementService.getUsers();
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error("Error loading users:", error);
      setHasError(true);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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

  const handleCreateUser = () => {
    setShowCreatePage(true);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditPage(true);
  };

  const handleBackToList = () => {
    setSelectedUser(null);
    setShowCreatePage(false);
    setShowEditPage(false);
  };

  const handleSaveSuccess = () => {
    setSelectedUser(null);
    setShowCreatePage(false);
    setShowEditPage(false);
    loadUsers();
  };

  // Local filtering like contracts and leads pages
  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = users.filter((user) => {
      const matchesSearch = !searchTerm
        ? true
        : user.name?.toLowerCase().includes(lowerSearch) ||
          user.email?.toLowerCase().includes(lowerSearch) ||
          user.phone?.includes(searchTerm);
      const matchesRole = !roleFilter || user.role.id === parseInt(roleFilter);
      return matchesSearch && matchesRole;
    });
    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  useEffect(() => {
    loadUsers();
  }, []);

  if (showEditPage) {
    return (
      <div className="min-h-screen w-full bg-white">
        <div className="p-6">
          <DetailTabs title="Edit User" onBack={handleBackToList}>
            <UserSettings
              user={selectedUser}
              onUserUpdated={handleSaveSuccess}
            />
          </DetailTabs>
        </div>
      </div>
    );
  }

  if (showCreatePage) {
    return (
      <div className="min-h-screen w-full bg-white">
        <div className="p-6">
          <DetailTabs title="Create User" onBack={handleBackToList}>
            <CreateUserForm onSuccess={handleSaveSuccess} />
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
            <DashboardPage userId={selectedUser.id} />
          </DetailTabs>
        </div>
      </div>
    );
  }

  const handlers = {
    onCreate: handleCreateUser,
    onView: handleViewUser,
    onEdit: handleEditUser,
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
                filteredUsers,
                handlers,
                {
                  isLoading,
                  hasError,
                  onRetry: loadUsers,
                  emptyStateTitle: "No users found",
                  emptyStateDescription:
                    searchTerm || roleFilter
                      ? "No users match your current filters. Try adjusting your search criteria."
                      : "No users have been created yet. Click the '+' button to create the first user.",
                  skeletonComponent: () => (
                    <TableRowSkeleton columns={5} actions={3} />
                  ),
                  skeletonCount: 5,
                }
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
