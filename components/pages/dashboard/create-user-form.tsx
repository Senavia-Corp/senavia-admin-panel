import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { MultiSelect } from "@/components/atoms/multiselect";
import { RoleDropdown } from "@/components/atoms/role-dropdown";
import { ImageSelector } from "@/components/atoms/image-selector";
import { Loader2 } from "lucide-react";
import { UserManagementService } from "@/services/user-management-service";
import type { CreateUserData, User } from "@/types/user-management";
import { useToast } from "@/hooks/use-toast";

interface CreateUserFormValues {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: number;
  permissions: number[];
  profileImage?: File;
}

interface CreateUserFormProps {
  onUserCreated?: (user: User) => void;
  onSuccess?: () => void;
}

export function CreateUserForm({
  onUserCreated,
  onSuccess,
}: CreateUserFormProps = {}) {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm<CreateUserFormValues>();
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [selectedRole, setSelectedRole] = useState<number | undefined>(
    undefined
  );
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: CreateUserFormValues) => {
    try {
      // Validate role
      if (!selectedRole) {
        setError("role", {
          type: "required",
          message: "Please select a role for the user.",
        });
        return;
      } else {
        clearErrors("role");
        setValue("role", selectedRole);
      }

      // Validate permissions
      if (selectedPermissions.length === 0) {
        setError("permissions", {
          type: "required",
          message: "Please select at least one permission.",
        });
        return;
      } else {
        clearErrors("permissions");
        setValue("permissions", selectedPermissions);
      }

      setIsLoading(true);

      const createUserData: CreateUserData = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        address: data.address,
        roleId: selectedRole,
        permissions:
          selectedPermissions.length > 0 ? selectedPermissions : undefined,
        imageUrl: profileImage || undefined,
      };

      const backendResponse = await UserManagementService.createUser(
        createUserData
      );
      console.log("New user created:", backendResponse);

      // Transform backend response to User format
      const newUser: User = {
        id: backendResponse.id.toString(),
        name: backendResponse.name,
        email: backendResponse.email,
        phone: backendResponse.phone,
        address: backendResponse.address,
        imageUrl: backendResponse.imageUrl,
        role: backendResponse.role,
        permissions:
          backendResponse.permissions?.map(
            (userPerm: any) => userPerm.permission
          ) || [],
        createdAt: new Date(backendResponse.createdAt),
        updatedAt: new Date(backendResponse.updatedAt),
      };

      // Call the callback to update parent component
      if (onUserCreated) {
        onUserCreated(newUser);
      }

      // Reset form after successful creation
      reset();
      setSelectedPermissions([]);
      setSelectedRole(undefined);
      setProfileImage(null);

      toast({
        title: "Success",
        description: "User created successfully!",
      });

      // Call success callback to navigate back
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to create user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (file: File | null) => {
    setProfileImage(file);
  };

  return (
    <div
      className={`w-full border-[20px] border-[#04081E] rounded-lg p-4 md:p-[60px] lg:p-[111px] bg-white `}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`w-full mx-auto p-8 bg-white rounded-lg shadow-none ${
          isLoading ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {/* Columna izquierda */}
          <div>
            {/*   <div className="mb-2">
              <div className="text-gray-800 text-sm">ID: 0000</div>
              <div className="border-b border-gray-200 mt-1" />
            </div> */}
            <label className="block text-sm font-medium mb-1 mt-4">
              Name *
            </label>
            <input
              className={`w-full border rounded px-3 py-2 text-sm ${
                errors.name ? "border-red-500" : ""
              } ${isLoading ? "bg-gray-100 cursor-not-allowed" : ""}`}
              placeholder="User Full Name"
              disabled={isLoading}
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
            <label className="block text-sm font-medium mb-1 mt-4">
              E-mail *
            </label>
            <input
              className={`w-full border rounded px-3 py-2 text-sm ${
                errors.email ? "border-red-500" : ""
              } ${isLoading ? "bg-gray-100 cursor-not-allowed" : ""}`}
              placeholder="User e-mail"
              disabled={isLoading}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
            <label className="block text-sm font-medium mb-1 mt-4">
              Password *
            </label>
            <input
              type="password"
              className={`w-full border rounded px-3 py-2 text-sm ${
                errors.password ? "border-red-500" : ""
              } ${isLoading ? "bg-gray-100 cursor-not-allowed" : ""}`}
              placeholder="********"
              disabled={isLoading}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
            <label className="block text-sm font-medium mb-1 mt-4">
              Phone Number *
            </label>
            <input
              className={`w-full border rounded px-3 py-2 text-sm ${
                errors.phone ? "border-red-500" : ""
              } ${isLoading ? "bg-gray-100 cursor-not-allowed" : ""}`}
              placeholder="User Phone Number"
              disabled={isLoading}
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[\+]?[1-9][\d]{0,15}$/,
                  message: "Invalid phone number format",
                },
              })}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.phone.message}
              </p>
            )}
            <label className="block text-sm font-medium mb-1 mt-4">
              Address *
            </label>
            <input
              className={`w-full border rounded px-3 py-2 text-sm ${
                errors.address ? "border-red-500" : ""
              } ${isLoading ? "bg-gray-100 cursor-not-allowed" : ""}`}
              placeholder="User Address"
              disabled={isLoading}
              {...register("address", {
                required: "Address is required",
                minLength: {
                  value: 5,
                  message: "Address must be at least 5 characters",
                },
              })}
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">
                {errors.address.message}
              </p>
            )}
          </div>
          {/* Columna derecha */}
          <div>
            <label className="block text-sm font-medium mb-1">Role *</label>
            <RoleDropdown
              value={selectedRole}
              onChange={(value) => {
                setSelectedRole(value);
                if (value) {
                  clearErrors("role");
                  setValue("role", value);
                }
              }}
              placeholder="Select a role..."
              className={`w-full ${errors.role ? "border-red-500" : ""}`}
              disabled={isLoading}
            />
            {errors.role && (
              <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
            )}
            <label className="block text-sm font-medium mb-1 mt-4">
              Custom Permissions *
            </label>
            <div
              className={`${
                errors.permissions ? "border border-red-500 rounded" : ""
              }`}
            >
              <MultiSelect
                value={selectedPermissions}
                onChange={(value) => {
                  setSelectedPermissions(value);
                  if (value.length > 0) {
                    clearErrors("permissions");
                    setValue("permissions", value);
                  }
                }}
                placeholder="Select permissions..."
                disabled={isLoading}
              />
            </div>
            {errors.permissions && (
              <p className="text-red-500 text-xs mt-1">
                {errors.permissions.message}
              </p>
            )}
            <label className="block text-sm font-medium mb-1 mt-4">
              Profile Picture
            </label>
            <ImageSelector
              value={profileImage}
              onChange={handleImageChange}
              placeholder="No image selected"
              disabled={isLoading}
              previewSize="medium"
              uploadButtonText="Upload new image"
              showUploadButton={true}
              showRemoveButton={true}
              showPreview={true}
              showFileName={true}
            />
          </div>
        </div>
        <div className="flex justify-center mt-[50px]">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-2/3 bg-[#99CC33] text-white py-2 rounded-full text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Creating user...
              </>
            ) : (
              "Add user"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
