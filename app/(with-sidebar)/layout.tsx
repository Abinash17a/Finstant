import { Sidebar } from "@/components/SideBar";

export default function WithSidebarLayout({ children }: { children: React.ReactNode }) {
  return (
<div className="flex min-h-screen bg-gray-50">
  {/* Sidebar */}
  <aside className="w-20 sm:w-24 md:w-28 lg:w-32 shrink-0 bg-white border-r border-gray-200">
    <Sidebar />
  </aside>

  {/* Main */}
  <main className="flex-1 overflow-x-auto p-6">
    {children}
  </main>
</div>
  );
}
