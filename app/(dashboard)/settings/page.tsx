"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { changePassword, getApiErrorMessage, getProfile } from "@/lib/api";
import { getInitials } from "@/lib/format";

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-6 w-64" />
      </div>
      <Skeleton className="h-36 w-full rounded-2xl" />
      <Skeleton className="h-72 w-full rounded-2xl" />
    </div>
  );
}

export default function SettingsPage() {
  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate({
      currentPassword,
      newPassword,
      confirmPassword,
    });
  };

  if (profileQuery.isLoading) {
    return <SettingsSkeleton />;
  }

  const profile = profileQuery.data;
  const displayName = profile?.name || profile?.username || "Mr. Raja";
  const userHandle = `@${profile?.username || "admin"}`;
  const avatarUrl = profile?.avatar?.url || "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl font-semibold text-[var(--text-primary)]">Setting</h1>
        <p className="mt-1 text-xl text-[var(--text-secondary)]">Edit your personal information</p>
      </div>

      <Card className="rounded-2xl border border-[var(--border-strong)]">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <Avatar className="h-28 w-28">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-display text-3xl font-semibold text-[var(--text-primary)]">{displayName}</h2>
            <p className="mt-1 text-xl text-[var(--text-secondary)]">{userHandle}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-[var(--border-strong)]">
        <CardContent className="space-y-5 p-5">
          <h3 className="font-display text-3xl font-semibold text-[var(--text-primary)]">Change password</h3>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="h-12 px-8 text-lg" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
