// "use client";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useRouter } from "next/navigation";

// type Props = {
//   orderId: string;
//   status: string;
// //   onEdit: () => void;
//   onDelete: () => void;
// };

// export default function OrderActions({
//   status,
// //   onEdit,
//   onDelete,
// }: Props) {
//     const router = useRouter();
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <button className="p-2 rounded hover:bg-gray-100">
//           ⋮
//         </button>
//       </DropdownMenuTrigger>

//       <DropdownMenuContent align="end" className="w-32">
//         {/* Edit hidden if READY_TO_SHIP */}
//         {status !== "READY_TO_SHIP" && (
//           <DropdownMenuItem onClick={() =>
//               router.push({
//                 pathname: "/update-order",
//                 query: { orderId },
//               } as any)
//             }>
//             Edit
//           </DropdownMenuItem>
//         )}

//         <DropdownMenuItem
//           onClick={onDelete}
//           className="text-red-600 focus:text-red-600"
//         >
//           Delete
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }


"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

type Props = {
  orderId: string;
  status: string;
  onDelete: () => void;
  onCancel: () => void;
};

export default function OrderActions({
  orderId,
  status,
  onDelete,
  onCancel,
}: Props) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 rounded hover:bg-gray-100">⋮</button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-32">
        {/* Edit hidden if READY_TO_SHIP */}
        {status !== "READY_TO_SHIP" && (
          <DropdownMenuItem
            onClick={() => router.push(`/update-order?orderId=${orderId}`)}
          >
            Edit
          </DropdownMenuItem>
        )}

        {/* CANCEL if READY_TO_SHIP */}
        {status === "READY_TO_SHIP" ? (
          <DropdownMenuItem
            onClick={onCancel}
            className="text-orange-600 focus:text-orange-600"
          >
            Cancel
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={onDelete}
            className="text-red-600 focus:text-red-600"
          >
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
