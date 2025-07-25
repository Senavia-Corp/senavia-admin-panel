"use client";

import { RoleBadge } from "@/components/atoms/role-badge";
import { ActionButton } from "@/components/atoms/action-button";
import type { User } from "@/types/user-management";

interface UserTableRowProps {
  user: User;
  onView: (user: User) => void;
  onDelete: (user: User) => void;
  isLast?: boolean;
  isFirst?: boolean;
}

export function UserTableRow({
  user,
  onView,
  onDelete,
  isLast,
  isFirst,
}: UserTableRowProps) {
  const borderClasses = `${isFirst ? " border-t-[10px] border-white" : ""}${
    !isLast ? " border-b-[10px] border-white" : ""
  }`;
  return (
    <tr className={`bg-[#F8F8F8]${borderClasses}`}>
      <td className="w-1/6 px-6 py-[10px] font-sans font-light text-sm leading-none tracking-normal text-center align-middle text-gray-900 truncate">
        {user.id}
      </td>
      <td className="w-1/6 px-6 py-[10px] font-sans font-light text-sm leading-none tracking-normal text-center align-middle text-gray-900 truncate">
        {user.name}
      </td>
      <td className="w-1/6 px-6 py-[10px] text-center align-middle">
        <RoleBadge role={user.role} />
      </td>
      <td className="w-1/6 px-6 py-[10px] font-sans font-light text-sm leading-none tracking-normal text-center align-middle text-gray-900 truncate">
        {user.email}
      </td>
      <td className="w-1/6 px-6 py-[10px] font-sans font-light text-sm leading-none tracking-normal text-center align-middle text-gray-900 truncate">
        {user.phone}
      </td>
      <td className="w-1/6 px-6 py-[10px] text-center align-middle">
        <div className="flex justify-center items-center h-full space-x-2">
          <ActionButton type="view" onClick={() => onView(user)} />
          <ActionButton type="delete" onClick={() => onDelete(user)} />
        </div>
      </td>
    </tr>
  );
}
