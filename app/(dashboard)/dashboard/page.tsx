"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Crown, Filter, TrendingUp, Users } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { getDashboardStats } from "@/lib/api";

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 w-full rounded-2xl" />
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-36 w-full rounded-2xl" />
        <Skeleton className="h-36 w-full rounded-2xl" />
        <Skeleton className="h-36 w-full rounded-2xl" />
      </div>
      <Skeleton className="h-[460px] w-full rounded-2xl" />
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => getDashboardStats(),
  });

  const chartData = useMemo(() => data?.monthlyJoinings || [], [data?.monthlyJoinings]);

  if (isLoading) {
    return <OverviewSkeleton />;
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-2xl border-0 bg-[var(--brand-700)]">
        <CardContent className="flex flex-col items-start justify-between gap-4 p-6 md:flex-row md:items-center">
          <div>
            <h1 className="font-display text-4xl font-semibold text-white md:text-5xl">Dashboard</h1>
            <p className="mt-2 text-base text-[#d4e4ff] md:text-lg">Welcome back to your admin panel</p>
          </div>
          <Button variant="outline" className="border-white/50 bg-transparent text-white hover:bg-white/10">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="border-b-4 border-b-[#26b4d9] bg-[#b8e6f6]">
          <CardContent className="p-5">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-4xl font-semibold text-[#1b2738] md:text-5xl">{data?.totalUsers ?? 0}</p>
                <p className="mt-2 text-2xl text-[#3d526b]">Total User</p>
              </div>
              <div className="rounded-full bg-[#23b0d2] p-3 text-white">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-b-4 border-b-[#bf88ff] bg-[#e7d9ff]">
          <CardContent className="p-5">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-4xl font-semibold text-[#1b2738] md:text-5xl">
                  {data?.activeSubscriptions ?? 0}
                </p>
                <p className="mt-2 text-2xl text-[#3d526b]">Active Subscription</p>
              </div>
              <div className="rounded-full bg-[#b37df7] p-3 text-white">
                <Crown className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-b-4 border-b-[#f27563] bg-[#fce1dc] md:col-span-2 xl:col-span-1">
          <CardContent className="p-5">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-4xl font-semibold text-[#1b2738] md:text-5xl">
                  {formatCurrency(data?.totalRevenue ?? 0, "EUR")}
                </p>
                <p className="mt-2 text-2xl text-[#3d526b]">Total Revenue</p>
              </div>
              <div className="rounded-full bg-[#f56757] p-3 text-white">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden border-0 bg-[#6fb4f6]">
        <CardContent className="space-y-4 p-5 sm:p-6">
          <div className="space-y-1">
            <p className="text-3xl font-semibold text-[#1f4ec2]">User Joining Overview</p>
            <p className="text-sm text-[#174290]">
              Monthly user onboarding trend ({data?.year || new Date().getFullYear()})
            </p>
          </div>

          <div className="h-[520px] w-full rounded-xl bg-[#5ca6ed] p-2 sm:p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 20, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="joinsArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2356df" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="#2356df" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="8 8" stroke="#b7d7fb" />
                <XAxis dataKey="label" tick={{ fill: "#ffffff", fontSize: 14 }} axisLine={false} />
                <YAxis tick={{ fill: "#ffffff", fontSize: 14 }} axisLine={false} />
                <Tooltip
                  cursor={{ stroke: "#2c5fdb", strokeWidth: 2 }}
                  contentStyle={{
                    backgroundColor: "#dfeaff",
                    borderRadius: "14px",
                    border: "1px solid #87aaf5",
                    fontSize: "14px",
                  }}
                  formatter={(value) => [`Joined: ${value ?? 0}`, "Users"]}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#2557df"
                  fillOpacity={1}
                  fill="url(#joinsArea)"
                  strokeWidth={3}
                  activeDot={{ r: 6, stroke: "#2557df", strokeWidth: 2, fill: "#fff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="hidden items-center justify-center gap-2 text-xs text-[var(--text-muted)] xl:flex">
        <BarChart3 className="h-4 w-4" />
        Live dashboard data from backend analytics API
      </div>
    </div>
  );
}
