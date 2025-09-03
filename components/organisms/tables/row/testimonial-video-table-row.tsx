"use client";

import { ActionButton } from "@/components/atoms/action-button";
import type { TestimonialVideo } from "@/types/testimonial-video-management";

interface Props {
  item: TestimonialVideo;
  onView: (item: TestimonialVideo) => void;
  onDelete: (item: TestimonialVideo) => void;
}

export function TestimonialVideoTableRow({ item, onView, onDelete }: Props) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="w-24 px-6 py-4 text-sm text-gray-900 truncate">
        {item.id.substring(0, 8)}
      </td>
      <td className="flex-1 px-6 py-4 text-sm text-gray-900 truncate">
        {item.title}
      </td>
      <td className="w-32 px-6 py-4">
        <div className="flex space-x-2">
          <ActionButton type="view" onClick={() => onView(item)} />
          <ActionButton type="delete" onClick={() => onDelete(item)} />
        </div>
      </td>
    </tr>
  );
}
