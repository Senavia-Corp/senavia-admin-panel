import React, { useState, useRef, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { User } from "@/types/user-management";
import { UserManagementService } from "@/services/user-management-service";
import { useToast } from "@/hooks/use-toast";
import EditableField from "@/components/atoms/editable-field";
import { RoleDropdown } from "@/components/atoms/role-dropdown";
import { MultiSelect } from "@/components/atoms/multiselect";

// Using User as base for form values; add only the extra fields we need

interface UserSettingsProps {
  user?: User | null;
  onUserUpdated?: (updatedUser: User) => void;
}

export default function UserSettings({
  user,
  onUserUpdated,
}: UserSettingsProps) {
  const { toast } = useToast();
  const formMethods = useForm<
    User & {
      password: string;
      profileImage: File | null;
      roleId: number;
      permissionIds: number[];
    }
  >({
    defaultValues: {
      email: user?.email || "email@example.com",
      password: "••••••••••••",
      name: user?.name || "User name",
      phone: user?.phone || "No phone provided",
      address: user?.address || "No address provided",
      profileImage: null,
      roleId: user?.role?.id || 0,
      permissionIds:
        user?.permissions?.map((p: any) => p.permission?.id || p.id) || [],
    },
  });
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    resetField,
    formState: { isDirty, dirtyFields },
  } = formMethods;

  const [userState, setUserState] = useState<User | null>(user ?? null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedRole, setSelectedRole] = useState<number | undefined>(
    user?.role?.id
  );
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>(
    user?.permissions?.map((p: any) => p.permission?.id || p.id) || []
  );

  const [isLoading, setIsLoading] = useState(false);
  type EditableFieldName = "password" | "name" | "phone" | "address";
  const [editingFields, setEditingFields] = useState<Set<EditableFieldName>>(
    new Set()
  );

  // Update selected values when user prop changes
  useEffect(() => {
    if (user) {
      const roleId = user.role?.id;
      const permissionIds =
        user.permissions?.map((p: any) => p.permission?.id || p.id) || [];

      setSelectedRole(roleId);
      setSelectedPermissions(permissionIds);
      setUserState(user);

      // Update form default values
      reset({
        email: user.email || "email@example.com",
        password: "••••••••••••",
        name: user.name || "User name",
        phone: user.phone || "No phone provided",
        address: user.address || "No address provided",
        profileImage: null,
        roleId: roleId || 0,
        permissionIds: permissionIds,
      });
    }
  }, [user, reset]);

  const onSubmit = async (
    data: User & {
      password: string;
      profileImage: File | null;
      roleId: number;
      permissionIds: number[];
    }
  ) => {
    if (!userState?.id && !user?.id) return;

    setIsLoading(true);
    try {
      // Build payload based on dirty fields and changed values
      const updateData: any = {};
      if (dirtyFields.name) updateData.name = data.name;
      if (dirtyFields.phone) updateData.phone = data.phone;
      if (dirtyFields.address) updateData.address = data.address;
      if (dirtyFields.password && data.password !== "••••••••••••") {
        updateData.password = data.password;
      }
      if (data.profileImage !== null) {
        updateData.imageUrl = data.profileImage;
      }

      // Check if role changed
      if (selectedRole && selectedRole !== userState?.role?.id) {
        updateData.roleId = selectedRole;
      }

      // Check if permissions changed
      const originalPermissionIds =
        userState?.permissions?.map((p: any) => p.permission?.id || p.id) || [];
      if (
        JSON.stringify(selectedPermissions.sort()) !==
        JSON.stringify(originalPermissionIds.sort())
      ) {
        updateData.permissions = selectedPermissions;
      }

      const apiResult = await UserManagementService.patchUser(
        (userState?.id as string) || (user?.id as string),
        updateData
      );

      const updatedUser = Array.isArray(apiResult) ? apiResult[0] : apiResult;

      // Update original values with the response
      setUserState(updatedUser);

      // Update selected values
      setSelectedRole(updatedUser.role?.id);
      setSelectedPermissions(
        updatedUser.permissions?.map((p: any) => p.permission?.id || p.id) || []
      );

      // Sync form with updated values
      reset(
        {
          email: updatedUser.email || "email@example.com",
          password: "••••••••••••",
          name: updatedUser.name || "User name",
          phone: updatedUser.phone || "No phone provided",
          address: updatedUser.address || "No address provided",
          profileImage: null,
          roleId: updatedUser.role?.id || 0,
          permissionIds:
            updatedUser.permissions?.map(
              (p: any) => p.permission?.id || p.id
            ) || [],
        },
        { keepDirty: false, keepTouched: false }
      );

      // exit edit mode for all fields after save
      setEditingFields(new Set());

      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
        setImagePreviewUrl("");
      }

      // Show success toast
      toast({
        title: "Success",
        description: "User updated successfully",
        variant: "default",
      });

      // Notify parent component about the update
      if (onUserUpdated) {
        onUserUpdated(updatedUser);
      }

      console.log("User updated successfully:", updatedUser);
    } catch (error: any) {
      console.log("🔍 Selected Permissions:", selectedPermissions);
      console.error("Error updating user:", error);

      // Show error toast
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("profileImage", file);
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
      const nextUrl = URL.createObjectURL(file);
      setImagePreviewUrl(nextUrl);
    }
  };

  const handleRemoveImage = () => {
    setValue("profileImage", null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl("");
    }
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Derive display values
  const selectedImageFile = watch("profileImage");
  const displayProfileImageUrl = imagePreviewUrl || userState?.imageUrl || "";

  // Toggle helper for controlled EditableField
  const toggleEditing = (fieldName: EditableFieldName) => {
    setEditingFields((prev) => {
      const next = new Set(prev);
      if (next.has(fieldName)) {
        next.delete(fieldName);
        resetField(fieldName);
      } else {
        next.add(fieldName);
      }
      return next as Set<EditableFieldName>;
    });
  };
  // Local editing state per field no longer used by atom; keep toggle for potential external use

  return (
    <div className="bg-gray-100 p-4 sm:p-4 rounded-lg">
      <div className="mx-auto w-full bg-white rounded-lg shadow-md p-6 sm:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Account Info
          </h1>
        </div>

        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* My Profile Section */}
            <section className="mb-6 flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                Profile
              </h2>
              <div
                className={`bg-gray-50 rounded-lg px-7 sm:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md ${
                  isLoading ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                  <div className="h-14 w-14 bg-gradient-to-r from-[#abd45a] via-[#39cac0] to-[#abd45a] rounded-full flex items-center justify-center">
                    {displayProfileImageUrl ? (
                      <img
                        src={displayProfileImageUrl}
                        alt="Profile"
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-lg">U</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {userState?.name || "Name"}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {userState?.email || "email@example.com"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {selectedImageFile !== null &&
                    selectedImageFile !== undefined && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        disabled={isLoading}
                        className="rounded-full bg-red-500 hover:bg-red-600 text-white border-0 px-4 py-2 font-bold text-[12px] sm:text-[14px] h-auto min-h-8 transition-all flex items-center justify-center whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Remove
                      </button>
                    )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="rounded-full bg-[#abd45a] text-white border-0 hover:bg-[#9bc04e] hover:text-white hover:shadow-[0_0_15px_rgba(171,212,90,0.7)] px-4 py-2 font-bold text-[12px] sm:text-[14px] h-auto min-h-8 transition-all flex items-center justify-center whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {selectedImageFile !== null &&
                    selectedImageFile !== undefined
                      ? "Change Image"
                      : "Change Profile Image"}
                  </button>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={isLoading}
                />
              </div>
            </section>

            {/* Role and Permissions Section */}
            <section className="mb-6 flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                Role & Permissions
              </h2>
              <div className="space-y-3">
                {/* Role */}
                <div
                  className={`bg-gray-50 rounded-lg px-7 sm:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md ${
                    isLoading ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 mb-1">Role</p>
                    <div className="w-full max-w-xs">
                      <RoleDropdown
                        value={selectedRole}
                        onChange={setSelectedRole}
                        placeholder="Select a role..."
                        disabled={isLoading}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div
                  className={`bg-gray-50 rounded-lg px-7 sm:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md ${
                    isLoading ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 mb-1">
                      Custom Permissions
                    </p>
                    <div className="w-full max-w-2xl">
                      <MultiSelect
                        value={selectedPermissions}
                        onChange={setSelectedPermissions}
                        placeholder="Select permissions..."
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Account Details Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-700 mb-3 flex-shrink-0">
                Account Details
              </h2>
              <div className="space-y-3">
                {/* Password */}
                <EditableField
                  fieldName="password"
                  label="Password"
                  type="password"
                  isLoading={isLoading}
                  isEditing={editingFields.has("password")}
                  onToggle={() => toggleEditing("password")}
                />

                {/* Name */}
                <EditableField
                  fieldName="name"
                  label="Name"
                  type="text"
                  isLoading={isLoading}
                  isEditing={editingFields.has("name")}
                  onToggle={() => toggleEditing("name")}
                />

                {/* Phone */}
                <EditableField
                  fieldName="phone"
                  label="Phone"
                  type="tel"
                  isLoading={isLoading}
                  isEditing={editingFields.has("phone")}
                  onToggle={() => toggleEditing("phone")}
                />

                {/* Address */}
                <EditableField
                  fieldName="address"
                  label="Address"
                  type="text"
                  isLoading={isLoading}
                  isEditing={editingFields.has("address")}
                  onToggle={() => toggleEditing("address")}
                />
              </div>
            </section>

            {/* Save Changes Button */}
            {(isDirty ||
              Boolean(selectedImageFile) ||
              selectedRole !== userState?.role?.id ||
              JSON.stringify(selectedPermissions.sort()) !==
                JSON.stringify(
                  (
                    userState?.permissions?.map(
                      (p: any) => p.permission?.id || p.id
                    ) || []
                  ).sort()
                )) && (
              <div className="mt-6 flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#abd45a] hover:bg-[#9bc04e] text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:shadow-[0_0_15px_rgba(171,212,90,0.7)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading && (
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
