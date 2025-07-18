"use client";

import { useState, useEffect } from "react";
import { UsersTable } from "@/components/organisms/users-table";
import { NewUserDetailTabs } from "@/components/organisms/new-user-detail-tabs";

import { CreateUserDialog } from "@/components/organisms/create-user-dialog";
import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";
import { UserManagementService } from "@/services/user-management-service";
import type { User, UserRole } from "@/types/user-management";
import DashboardPage from "./dashboard/dashboard-page";

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, [searchTerm, roleFilter]);

  const loadUsers = async () => {
    try {
      const usersData = await UserManagementService.getUsers(
        searchTerm,
        roleFilter
      );
      setUsers(usersData);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const loadRoles = async () => {
    try {
      const rolesData = await UserManagementService.getUserRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error("Error loading roles:", error);
    }
  };

  const handleDeleteUser = async (user: User) => {
    try {
      await UserManagementService.deleteUser(user.id);
      setUserToDelete(null);
      loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (selectedUser) {
    return (
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="flex items-center space-x-2">
                <img
                  src="/images/senavia-logo.png"
                  alt="Senavia Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">U</span>
                </div>
                <span className="text-sm font-medium">Username</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Full Screen */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 h-full w-full ">
            <NewUserDetailTabs onBack={() => setSelectedUser(null)}>
              <DashboardPage />
            </NewUserDetailTabs>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center space-x-2">
              <img
                src="/images/senavia-logo.png"
                alt="Senavia Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">U</span>
              </div>
              <span className="text-sm font-medium">Username</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
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
              <UsersTable
                users={users}
                roles={roles}
                onAddUser={() => setShowCreateDialog(true)}
                onViewUser={setSelectedUser}
                onDeleteUser={setUserToDelete}
                onSearch={setSearchTerm}
                onRoleFilter={setRoleFilter}
              />
            </div>
          </div>
        </div>
      </main>

      <CreateUserDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={loadUsers}
        roles={roles}
      />

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
