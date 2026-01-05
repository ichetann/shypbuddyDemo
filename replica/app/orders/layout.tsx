import Navbar from "../(components)/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <Navbar />

      {/* Sidebar overlays content */}
      <div className="relative">
        <AppSidebar />

        {/* Orders page goes full width */}
        <main className="mt-16 pl-6 pt-6 bg-[#1a222c] text-white max-w-8xl">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
