"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

type DashboardShellProps = {
  children: React.ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();

  const user = useMemo(
    () => ({
      name: session?.user?.name || "Mr. Raja",
      email: session?.user?.email || "example@gmail.com",
      avatar:
        (session?.user as { avatar?: { url?: string } } | undefined)?.avatar?.url || "",
    }),
    [session]
  );

  return (
    <div className="flex min-h-screen bg-[var(--app-bg)]">
      <aside className="hidden h-screen w-[235px] shrink-0 lg:sticky lg:top-0 lg:block">
        <DashboardSidebar />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">
          <aside className="h-full w-[235px] bg-[#3b63a5] shadow-xl">
            <div className="flex justify-end p-3">
              <button
                type="button"
                className="rounded-md p-1 text-white hover:bg-white/10"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <DashboardSidebar onNavigate={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader user={user} onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-7">{children}</main>
      </div>
    </div>
  );
}
