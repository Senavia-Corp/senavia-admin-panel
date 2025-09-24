"use client"

export function ClauseTableRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="p-5">
        <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
      </td>
      <td className="p-5">
        <div className="h-4 bg-gray-300 rounded w-40 mx-auto"></div>
      </td>
      <td className="p-5">
        <div className="h-4 bg-gray-300 rounded w-64 mx-auto"></div>
      </td>
      <td className="p-5">
        <div className="h-8 bg-gray-300 rounded w-16 mx-auto"></div>
      </td>
    </tr>
  );
}
