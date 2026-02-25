"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate, getInitials } from "@/lib/format";
import { getAdminUsers } from "@/lib/api";

const PAGE_SIZE = 10;

function UserTableSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-44" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-7 w-20 rounded-full" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const query = useQuery({
    queryKey: ["admin-users", page, search],
    queryFn: () =>
      getAdminUsers({
        page,
        limit: PAGE_SIZE,
        search: search.trim() || undefined,
      }),
  });

  const users = query.data?.users || [];
  const pagination = query.data?.pagination;

  const resultsLabel = useMemo(() => {
    if (!pagination || pagination.total === 0) {
      return "Showing 0 results";
    }

    const from = (pagination.page - 1) * pagination.limit + 1;
    const to = Math.min(pagination.page * pagination.limit, pagination.total);
    return `Showing ${from} to ${to} of ${pagination.total} results`;
  }, [pagination]);

  return (
    <Card className="overflow-hidden border border-[var(--border)]">
      <CardContent className="space-y-4 p-0">
        <div className="flex flex-col gap-4 border-b border-[var(--border)] bg-white px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)]">User List</h1>
            <p className="text-sm text-[var(--text-muted)]">Track users and their subscription status</p>
          </div>
          <div className="relative w-full max-w-[340px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <Input
              value={search}
              onChange={(event) => {
                setPage(1);
                setSearch(event.target.value);
              }}
              placeholder="Search by coach name or email"
              className="h-11 pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto px-2 pb-2 md:px-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Coach Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead>Spent on Subscription</TableHead>
                <TableHead>Plan Name</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {query.isLoading ? (
                <UserTableSkeleton />
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-14 text-center text-[var(--text-muted)]">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-14 w-14 rounded-xl">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xl font-semibold leading-tight text-[var(--text-primary)]">
                            {user.name}
                          </p>
                          <p className="text-sm text-[var(--text-muted)]">#{user._id.slice(-5)}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-[var(--text-secondary)]">{user.email}</TableCell>
                    <TableCell className="text-sm text-[var(--text-secondary)]">
                      {formatDate(user.joinedDate)}
                    </TableCell>
                    <TableCell className="text-sm text-[var(--text-secondary)]">
                      {formatCurrency(user.spentOnSubscription, "USD")}
                    </TableCell>
                    <TableCell className="text-sm text-[var(--text-secondary)]">{user.planName}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={user.status === "Paid" ? "success" : "danger"}>{user.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-4 border-t border-[var(--border)] bg-white px-4 py-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-[var(--text-muted)]">{resultsLabel}</p>
          {pagination ? (
            <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
