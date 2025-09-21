"use client";

export function ContractTableRowSkeleton() {
  return (
    <tr className="bg-[#F8F8F8] animate-pulse">
      <td className="w-1/6 px-6 py-[10px] text-center align-middle">
        <div className="h-4 bg-gray-300 rounded w-16 mx-auto"></div>
      </td>
      <td className="w-1/6 px-6 py-[10px] text-center align-middle">
        <div className="h-4 bg-gray-300 rounded w-24 mx-auto"></div>
      </td>
      <td className="w-1/6 px-6 py-[10px] text-center align-middle">
        <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
      </td>
      <td className="w-1/6 px-6 py-[10px] text-center align-middle">
        <div className="h-6 bg-gray-300 rounded-full w-16 mx-auto"></div>
      </td>
      <td className="w-1/6 px-6 py-[10px] text-center align-middle">
        <div className="flex justify-center items-center h-full space-x-2">
          <div className="h-8 w-8 bg-gray-300 rounded"></div>
          <div className="h-8 w-8 bg-gray-300 rounded"></div>
          <div className="h-8 w-8 bg-gray-300 rounded"></div>
        </div>
      </td>
    </tr>
  );
}
