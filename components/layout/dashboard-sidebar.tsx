"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { CreditCard, LayoutDashboard, LogOut, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type DashboardSidebarProps = {
  onNavigate?: () => void;
};

const menuItems = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "User List", href: "/users", icon: Users },
  { title: "Subscription", href: "/subscriptions", icon: CreditCard },
  { title: "Settings", href: "/settings", icon: Settings },
];

export function DashboardSidebar({ onNavigate }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const confirmLogout = async () => {
    setLogoutModalOpen(false);
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <>
      <div className="flex h-full flex-col bg-[#3b63a5]">
        <div className="flex justify-center py-8">
          <div className="relative h-[95px] w-[140px]">
            <Image src="/logo.png" alt="InfinityFX logo" fill className="object-contain" priority />
          </div>
        </div>

        <nav className="flex-1 space-y-1 pr-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-r-xl px-4 py-3 text-base font-medium transition-colors",
                  active
                    ? "bg-white text-[#2f4f84]"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3">
          <Button
            variant="ghost"
            className="h-11 w-full justify-start gap-3 px-3 text-base font-medium text-white hover:bg-white/10 hover:text-white"
            onClick={() => setLogoutModalOpen(true)}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>

      <Dialog open={logoutModalOpen} onOpenChange={setLogoutModalOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout from the dashboard?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button variant="outline">No</Button>
            </DialogClose>
            <Button onClick={confirmLogout}>Yes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
