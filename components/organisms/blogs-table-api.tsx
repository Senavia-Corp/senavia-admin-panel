"use client";

import { ThemeBadge } from "@/components/atoms/theme-badge";
import { ActionButton } from "@/components/atoms/action-button";

interface BlogTableRowProps {
  blog: Blog;
  onView: (blog: Blog) => void;
  onDelete: (blog: Blog) => void;
}
interface Blog {
  id: string;
  title: string;
  createdAt: Date;
  topic: string;
}

export function BlogTableApi({ blog,onView,onDelete }: BlogTableRowProps) {
  const formatDate = (date: string | Date) => {
    const realDate = new Date(date);
    if (isNaN(realDate.getTime())) return "Invalid date";
    return realDate.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  };

  
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="w-24 px-6 py-4 text-sm text-gray-900 truncate">
        {blog.id}
      </td>
      <td className="flex-1 px-6 py-4 text-sm text-gray-900 truncate">
        {blog.title}
      </td>
      <td className="w-32 px-6 py-4 text-sm text-gray-900">
        {formatDate(blog.createdAt)}
      </td>
      <td className="w-40 px-6 py-4">
        <ThemeBadge theme={blog.topic} />
      </td>
       <td className="w-32 px-6 py-4">
        <div className="flex space-x-2">
          <ActionButton type="view" onClick={() => onView(blog)} className="text-gray-700 hover:text-gray-900" />
          <ActionButton type="delete" onClick={() => onDelete(blog)} className="text-gray-700 hover:text-gray-900" />
        </div>
      </td>
    </tr>
  );
}
