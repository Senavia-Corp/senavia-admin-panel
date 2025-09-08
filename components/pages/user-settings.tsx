import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import type { User } from "@/types/user-management";

interface UserSettingsFormValues {
  email: string;
  password: string;
  name: string;
  address: string;
}

interface UserSettingsProps {
  user?: User | null;
}

export default function UserSettings({ user }: UserSettingsProps) {
  const { register, handleSubmit, watch } = useForm<UserSettingsFormValues>({
    defaultValues: {
      email: user?.email || "email@example.com",
      password: "••••••••••••",
      name: user?.name || "User name",
      address: user?.address || "No address provided",
    },
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSubmit = (data: UserSettingsFormValues) => {
    console.log({ ...data, profileImage });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setProfileImageUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="bg-gray-100 p-4 sm:p-4 rounded-lg">
      <div className="mx-auto w-full bg-white rounded-lg shadow-md p-6 sm:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Account Info
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* My Profile Section */}
          <section className="mb-6 flex-shrink-0">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              Profile
            </h2>
            <div className="bg-gray-50 rounded-lg px-7 sm:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                <div className="h-14 w-14 bg-gradient-to-r from-[#abd45a] via-[#39cac0] to-[#abd45a] rounded-full flex items-center justify-center">
                  {profileImageUrl ? (
                    <img
                      src={profileImageUrl}
                      alt="Profile"
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-lg">U</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">
                    {user?.name || "Name"}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {user?.email || "email@example.com"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full bg-[#abd45a] text-white border-0 hover:bg-[#9bc04e] hover:text-white hover:shadow-[0_0_15px_rgba(171,212,90,0.7)] px-4 py-2 font-bold text-[12px] sm:text-[14px] h-auto min-h-8 transition-all flex items-center justify-center mt-3 sm:mt-0 w-full sm:w-auto whitespace-nowrap"
              >
                Change Profile Image
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </section>

          {/* Account Details Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-3 flex-shrink-0">
              Account Details
            </h2>
            <div className="space-y-3">
              {/* Email */}
              <div className="bg-gray-50 rounded-lg px-7 sm:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-md">
                <div className="text-center sm:text-left w-full">
                  <p className="font-medium text-gray-800">Email</p>
                  <p className="text-sm text-gray-500">{watch("email")}</p>
                </div>
                <button
                  type="button"
                  className="rounded-full bg-[#abd45a] hover:bg-[#9bc04e] text-white border-0 hover:text-white hover:shadow-[0_0_15px_rgba(171,212,90,0.7)] px-5 py-1 font-bold text-[14px] h-8 transition-all flex items-center justify-center mt-3 sm:mt-0 w-full sm:w-auto"
                >
                  Change
                </button>
              </div>

              {/* Password */}
              <div className="bg-gray-50 rounded-lg px-7 sm:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-md">
                <div className="text-center sm:text-left w-full">
                  <p className="font-medium text-gray-800">Password</p>
                  <p className="text-sm text-gray-500">{watch("password")}</p>
                </div>
                <button
                  type="button"
                  className="rounded-full bg-[#abd45a] hover:bg-[#9bc04e] text-white border-0 hover:text-white hover:shadow-[0_0_15px_rgba(171,212,90,0.7)] px-5 py-1 font-bold text-[14px] h-8 transition-all flex items-center justify-center mt-3 sm:mt-0 w-full sm:w-auto"
                >
                  Change
                </button>
              </div>

              {/* Name */}
              <div className="bg-gray-50 rounded-lg px-7 sm:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-md">
                <div className="text-center sm:text-left w-full">
                  <p className="font-medium text-gray-800">Name</p>
                  <p className="text-sm text-gray-500">{watch("name")}</p>
                </div>
                <button
                  type="button"
                  className="rounded-full bg-[#abd45a] hover:bg-[#9bc04e] text-white border-0 hover:text-white hover:shadow-[0_0_15px_rgba(171,212,90,0.7)] px-5 py-1 font-bold text-[14px] h-8 transition-all flex items-center justify-center mt-3 sm:mt-0 w-full sm:w-auto"
                >
                  Change
                </button>
              </div>

              {/* Address */}
              <div className="bg-gray-50 rounded-lg px-7 sm:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-md mt-3 sm:mt-0">
                <div className="text-center sm:text-left w-full">
                  <p className="font-medium text-gray-800">Address</p>
                  <p className="text-sm text-gray-500">{watch("address")}</p>
                </div>
                <button
                  type="button"
                  className="rounded-full bg-[#abd45a] hover:bg-[#9bc04e] text-white border-0 hover:text-white hover:shadow-[0_0_15px_rgba(171,212,90,0.7)] px-5 py-1 font-bold text-[14px] h-8 transition-all flex items-center justify-center mt-3 sm:mt-0 w-full sm:w-auto"
                >
                  Change
                </button>
              </div>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}
