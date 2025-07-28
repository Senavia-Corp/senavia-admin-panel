import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { MultiSelect } from "@/components/atoms/multiselect";

interface CreateUserFormValues {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: string;
  permissions: string[];
  profileImage?: File;
}

const roles = [
  { id: "1", name: "Admin" },
  { id: "2", name: "User" },
];
const allPermissions = [
  "Permission 1",
  "Permission 2",
  "Permission 3",
  "Permission 4",
  "Permission 5",
];

export function CreateUserForm() {
  const { register, handleSubmit, setValue, watch } =
    useForm<CreateUserFormValues>();
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSubmit = (data: CreateUserFormValues) => {
    // Aquí puedes manejar el envío del formulario
    console.log({ ...data, permissions: selectedPermissions, profileImage });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setProfileImageUrl(URL.createObjectURL(file));
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
            <select
              className="w-full border rounded px-3 py-2 text-sm"
              {...register("role")}
            >
              <option value="">Dropdown here - Role Name - Role ID</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            <label className="block text-sm font-medium mb-1 mt-4">
              Custom Permissions
            </label>
            <MultiSelect
              options={allPermissions}
              value={selectedPermissions}
              onChange={setSelectedPermissions}
              placeholder="Select permissions..."
            />
            <label className="block text-sm font-medium mb-1 mt-4">
              Profile Picture
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="w-full border rounded px-3 py-2 text-sm"
                value={profileImage?.name || "Picture.png"}
                readOnly
              />
              {profileImageUrl && (
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover shadow"
                />
              )}
              <button
                type="button"
                className="ml-2 px-2 py-1 bg-[#181B29] text-white rounded-full text-xs"
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
            Add / Update User
          </button>
        </div>
      </form>
    </div>
  );
}
