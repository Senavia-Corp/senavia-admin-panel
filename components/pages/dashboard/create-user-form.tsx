import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { MultiSelect } from "@/components/atoms/multiselect";
import { RoleDropdown } from "@/components/atoms/role-dropdown";
import { Trash2 } from "lucide-react";

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

export function CreateUserForm() {
  const { register, handleSubmit, setValue, watch } =
    useForm<CreateUserFormValues>();
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [selectedRole, setSelectedRole] = useState<number | undefined>(
    undefined
  );
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSubmit = (data: CreateUserFormValues) => {
    // Aquí puedes manejar el envío del formulario
    console.log({
      ...data,
      role: selectedRole,
      permissions: selectedPermissions,
      profileImage,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setProfileImageUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setProfileImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full border-[20px] border-[#04081E] rounded-lg p-4 md:p-[60px] lg:p-[111px] bg-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mx-auto p-8 bg-white rounded-lg shadow-none"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {/* Columna izquierda */}
          <div>
            <div className="mb-2">
              <div className="text-gray-800 text-sm">ID: 0000</div>
              <div className="border-b border-gray-200 mt-1" />
            </div>
            <label className="block text-sm font-medium mb-1 mt-4">Name</label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="User Full Name"
              {...register("name")}
            />
            <label className="block text-sm font-medium mb-1 mt-4">
              E-mail
            </label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="User e-mail"
              {...register("email")}
            />
            <label className="block text-sm font-medium mb-1 mt-4">
              Password
            </label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="********"
              {...register("password")}
            />
            <label className="block text-sm font-medium mb-1 mt-4">
              Phone Number
            </label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="User Phone Number"
              {...register("phone")}
            />
            <label className="block text-sm font-medium mb-1 mt-4">
              Adress
            </label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="User Adress"
              {...register("address")}
            />
          </div>
          {/* Columna derecha */}
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <RoleDropdown
              value={selectedRole}
              onChange={setSelectedRole}
              placeholder="Select a role..."
              className="w-full"
            />
            <label className="block text-sm font-medium mb-1 mt-4">
              Custom Permissions
            </label>
            <MultiSelect
              value={selectedPermissions}
              onChange={setSelectedPermissions}
              placeholder="Select permissions..."
            />
            <label className="block text-sm font-medium mb-1 mt-4">
              Profile Picture
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="flex-1 border rounded px-3 py-2 text-sm"
                  value={profileImage?.name || "No image"}
                  readOnly
                />
                {profileImageUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    title="Remove image"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {profileImageUrl ? (
                <div className="w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                  <img
                    src={profileImageUrl}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No image</span>
                </div>
              )}

              <button
                type="button"
                className="px-4 py-2 bg-[#181B29] text-white rounded-full text-sm hover:bg-[#252938] transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload new image
              </button>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-[50px]">
          <button
            type="submit"
            className="w-full md:w-2/3 bg-[#99CC33] text-white py-2 rounded-full text-lg font-medium"
          >
            Add user
          </button>
        </div>
      </form>
    </div>
  );
}
