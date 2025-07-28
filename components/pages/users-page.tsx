"use client";

import { useState, useEffect } from "react";
import { UsersTable } from "@/components/organisms/users-table";
import { DetailTabs } from "../molecules/detail-tabs";

import { DeleteConfirmDialog } from "@/components/organisms/delete-confirm-dialog";

import { UserManagementService } from "@/services/user-management-service";
import type { User, UserRole } from "@/types/user-management";
import DashboardPage from "./dashboard/dashboard-page";
import { CreateUserForm } from "./dashboard/create-user-form";
import UserSettings from "./user-settings";

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreatePage, setShowCreatePage] = useState(false);
  const [showEditPage, setShowEditPage] = useState(false);
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
      <div className="min-h-screen w-full bg-white ">
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

  if (showCreatePage) {
    return (
      <div className="min-h-screen w-full bg-white ">
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

  if (showEditPage) {
    return (
      <div className="min-h-screen w-full bg-white ">
        <div className="p-6">
          <DetailTabs
            title="Edit User Information"
            onBack={() => setShowEditPage(false)}
          >
            <UserSettings />
          </DetailTabs>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
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
                onEditUser={() => setShowEditPage(true)}
                users={users}
                roles={roles}
                onAddUser={() => setShowCreatePage(true)}
                onViewUser={setSelectedUser}
                onDeleteUser={setUserToDelete}
                onSearch={setSearchTerm}
                onRoleFilter={setRoleFilter}
              />
            </div>
          </div>
        </div>
      </main>

      {/* El modal ya no se usa, solo la página */}

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
