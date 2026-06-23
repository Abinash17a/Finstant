import { Sidebar } from "@/components/SideBar";

export default function WithSidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="sticky top-0 h-screen shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
        <Sidebar />
      </aside>
      <main className="flex-1 overflow-x-auto overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}