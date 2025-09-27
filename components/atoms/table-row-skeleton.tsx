"use client";

interface TableRowSkeletonProps {
  columns: number;
  actions: number;
}

export function TableRowSkeleton({ columns, actions }: TableRowSkeletonProps) {
  const totalColumns = columns + 1; // +1 for actions column
  const columnWidth = `w-1/${totalColumns}`;

  return (
    <tr className="bg-[#F8F8F8] animate-pulse">
      {/* Data columns */}
      {Array.from({ length: columns }, (_, index) => (
        <td
          key={index}
          className={`${columnWidth} px-6 py-[10px] text-center align-middle`}
        >
          <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
        </td>
      ))}

      {/* Actions column */}
      <td className={`${columnWidth} px-6 py-[10px] text-center align-middle`}>
        <div className="flex justify-center items-center h-full space-x-2">
          {Array.from({ length: actions }, (_, index) => (
            <div key={index} className="h-8 w-8 bg-gray-300 rounded"></div>
          ))}
        </div>
      </td>
    </tr>
  );
}
