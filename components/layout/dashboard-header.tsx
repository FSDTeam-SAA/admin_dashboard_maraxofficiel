"use client";

import { Bell, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/format";

type DashboardHeaderProps = {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  onOpenSidebar: () => void;
};

export function DashboardHeader({ user, onOpenSidebar }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-20 border-b border-[var(--border)] bg-white">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onOpenSidebar}>
          <Menu className="h-5 w-5" />
        </Button>

        <div className="ml-auto flex items-center gap-4">
          <button
            type="button"
            className="relative rounded-full bg-[var(--surface-muted)] p-2 text-[var(--text-secondary)]"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#f15e5e]" />
          </button>

          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10 border border-[var(--border)]">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-[var(--text-primary)]">{user.name}</p>
              <p className="text-sm text-[var(--text-muted)]">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
