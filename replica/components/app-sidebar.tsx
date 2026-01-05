// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar";
// import Link from "next/link";

// export function AppSidebar() {
//   return (
//     <Sidebar>
//       {/* <SidebarHeader /> */}
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupContent>
//             <SidebarMenu>
//                 <SidebarMenuItem>
//                     <SidebarMenuButton>
//                         <Link href={"/orders"}>
//                             <span>Orders</span>
//                         </Link>
                        

//                     </SidebarMenuButton>
//                 </SidebarMenuItem>
//                 <SidebarMenuItem>
//                     <SidebarMenuButton>
//                         <Link href={"/"}>
//                             <span>backward</span>
//                         </Link>
                        

//                     </SidebarMenuButton>
//                 </SidebarMenuItem>
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   );
// }
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSidebar } from "@/components/ui/sidebar";


export function AppSidebar() {
    const { setOpen } = useSidebar();
  return (
    <Sidebar
      collapsible="icon"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="
        mt-16
        h-[calc(100vh-4rem)]
        group
        data-[state=collapsed]:w-16
        data-[state=expanded]:w-64
        transition-all duration-300
        z-10
      "
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>

              {/* Orders */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Orders">
                  <Link href="/orders" className="flex items-center gap-3">
                    <ShoppingCart className="h-5 w-5" />

                    <span
                      className="
                        whitespace-nowrap
                        opacity-0
                        group-data-[state=expanded]:opacity-100
                        transition-opacity
                      "
                    >
                      Orders
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Back */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Back">
                  <Link href="/" className="flex items-center gap-3">
                    <ArrowLeft className="h-5 w-5" />

                    <span
                      className="
                        whitespace-nowrap
                        opacity-0
                        group-data-[state=expanded]:opacity-100
                        transition-opacity
                      "
                    >
                      Back
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
