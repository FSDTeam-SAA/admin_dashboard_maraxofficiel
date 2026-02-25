"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Crown, Pencil, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/format";
import { getSubscriptionPlans, type SubscriptionPlan } from "@/lib/api";

const PAGE_SIZE = 8;

const iconMap = {
  sparkle: Sparkles,
  zap: Zap,
  crown: Crown,
};

function PlanCardSkeleton() {
  return (
    <Card className="rounded-2xl border border-[#86a7ff] bg-[#5f8df5] p-4">
      <div className="space-y-4">
        <Skeleton className="h-6 w-40 bg-white/40" />
        <Skeleton className="h-10 w-48 bg-white/40" />
        <Skeleton className="h-4 w-full bg-white/30" />
        <Skeleton className="h-4 w-[80%] bg-white/30" />
        <Skeleton className="h-11 w-full rounded-full bg-white/30" />
      </div>
    </Card>
  );
}

function PlanCard({ plan }: { plan: SubscriptionPlan }) {
  const Icon = iconMap[plan.icon] || Sparkles;

  return (
    <Card className="group rounded-2xl border border-[#86a7ff] bg-gradient-to-b from-[#5a88ee] to-[#4f7df3] text-white shadow-md transition-transform hover:-translate-y-0.5">
      <CardContent className="space-y-5 p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white/15 p-2">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="font-display text-2xl font-semibold">{plan.name}</h3>
        </div>

        <p className="text-5xl font-bold leading-none">
          {formatCurrency(plan.price, plan.currency)}
          <span className="ml-2 text-2xl font-medium">
            /{plan.billingCycle === "month" ? "month" : "one-time"}
          </span>
        </p>

        <p className="text-lg text-white/85">{plan.description}</p>

        <div className="border-t border-white/40 pt-4">
          <h4 className="mb-3 text-3xl font-semibold">What You Get</h4>
          <div className="space-y-2">
            {plan.benefits.map((benefit, index) => (
              <div key={`${plan._id}-${index}`} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#4be07a]" />
                <p className="text-xl text-white">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        <Link href={`/subscriptions/${plan._id}`}>
          <Button className="h-12 w-full rounded-full bg-[var(--brand-700)] text-2xl hover:bg-[var(--brand-800)]">
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default function SubscriptionsPage() {
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ["subscription-plans", page],
    queryFn: () =>
      getSubscriptionPlans({
        page,
        limit: PAGE_SIZE,
      }),
  });

  const plans = query.data?.plans || [];
  const pagination = query.data?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="text-center sm:text-left">
          <h1 className="font-display text-4xl font-semibold text-[var(--brand-700)]">Flexible Plan</h1>
          <p className="mt-1 text-xl text-[var(--text-secondary)]">
            Create a plan that works best for you and your team
          </p>
        </div>
        <Link href="/subscriptions/new">
          <Button className="h-12 px-7 text-lg">Add New Plan</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {query.isLoading
          ? Array.from({ length: 4 }).map((_, index) => <PlanCardSkeleton key={index} />)
          : plans.map((plan) => <PlanCard key={plan._id} plan={plan} />)}
      </div>

      {pagination ? (
        <div className="flex justify-end">
          <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </div>
      ) : null}
    </div>
  );
}
