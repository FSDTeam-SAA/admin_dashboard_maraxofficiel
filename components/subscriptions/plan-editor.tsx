"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Crown,
  Plus,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  createSubscriptionPlan,
  getApiErrorMessage,
  getSubscriptionPlanById,
  type PlanPayload,
  updateSubscriptionPlan,
} from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

type PlanEditorProps = {
  mode: "create" | "edit";
  planId?: string;
};

const iconOptions: Array<{
  key: "sparkle" | "zap" | "crown";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { key: "sparkle", label: "Sparkle", icon: Sparkles },
  { key: "zap", label: "Zap", icon: Zap },
  { key: "crown", label: "Crown", icon: Crown },
];

const defaultForm: PlanPayload = {
  name: "",
  price: 0,
  billingCycle: "month",
  description: "",
  benefits: ["Training Access"],
  icon: "sparkle",
};

export function PlanEditor({ mode, planId }: PlanEditorProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [benefitDraft, setBenefitDraft] = useState("");
  const [form, setForm] = useState<PlanPayload>(defaultForm);
  const [isDirty, setIsDirty] = useState(false);

  const isCreate = mode === "create";

  const planQuery = useQuery({
    queryKey: ["subscription-plan", planId],
    queryFn: () => getSubscriptionPlanById(planId || ""),
    enabled: !isCreate && Boolean(planId),
  });

  const loadedForm = useMemo<PlanPayload>(() => {
    if (!planQuery.data) return defaultForm;
    return {
      name: planQuery.data.name,
      price: planQuery.data.price,
      billingCycle: planQuery.data.billingCycle,
      description: planQuery.data.description,
      benefits: planQuery.data.benefits,
      icon: planQuery.data.icon,
      accentColor: planQuery.data.accentColor,
      sortOrder: planQuery.data.sortOrder,
      isActive: planQuery.data.isActive,
    };
  }, [planQuery.data]);

  const currentForm = isCreate ? form : isDirty ? form : loadedForm;

  const updateForm = (updater: (previous: PlanPayload) => PlanPayload) => {
    setIsDirty(true);
    setForm((previous) => updater(isDirty ? previous : currentForm));
  };

  const mutation = useMutation({
    mutationFn: async (payload: PlanPayload) => {
      if (isCreate) {
        return createSubscriptionPlan(payload);
      }
      return updateSubscriptionPlan(planId || "", payload);
    },
    onSuccess: () => {
      toast.success(`Plan ${isCreate ? "created" : "updated"} successfully`);
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
      queryClient.invalidateQueries({ queryKey: ["subscription-plan", planId] });
      router.push("/subscriptions");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });

  const SelectedIcon = useMemo(() => {
    return iconOptions.find((item) => item.key === currentForm.icon)?.icon || Sparkles;
  }, [currentForm.icon]);

  const addBenefit = () => {
    const sanitized = benefitDraft.trim();
    if (!sanitized) return;
    updateForm((previous) => ({ ...previous, benefits: [...previous.benefits, sanitized] }));
    setBenefitDraft("");
  };

  const removeBenefit = (index: number) => {
    updateForm((previous) => ({
      ...previous,
      benefits: previous.benefits.filter((_, currentIndex) => currentIndex !== index),
    }));
  };

  const submit = () => {
    if (!currentForm.name.trim()) {
      toast.error("Plan name is required");
      return;
    }

    if (currentForm.price <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    if (currentForm.benefits.length === 0) {
      toast.error("At least one benefit is required");
      return;
    }

    mutation.mutate(currentForm);
  };

  if (!isCreate && planQuery.isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-12 w-28 rounded-lg" />
        <Skeleton className="h-10 w-64 rounded-lg" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[520px] rounded-2xl" />
          <Skeleton className="h-[520px] rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/subscriptions">
        <Button variant="default" className="h-12 px-6">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </Link>

      <div className="text-center">
        <h1 className="font-display text-4xl font-semibold text-[var(--brand-700)]">Flexible Plan</h1>
        <p className="mt-1 text-xl text-[var(--text-secondary)]">
          {isCreate ? "Create a plan that works best for you and your team" : "Edit a plan that works best for your team"}
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-2xl border border-[#f0bac1]">
          <CardContent className="space-y-5 p-5">
            <div className="space-y-2">
              <Label htmlFor="plan-name">Plan Name</Label>
              <Input
                id="plan-name"
                value={currentForm.name}
                onChange={(event) =>
                  updateForm((previous) => ({ ...previous, name: event.target.value }))
                }
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="plan-price">Price</Label>
                <Input
                  id="plan-price"
                  type="number"
                  min={0}
                  step={0.01}
                  value={currentForm.price}
                  onChange={(event) =>
                    updateForm((previous) => ({
                      ...previous,
                      price: Number.parseFloat(event.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-cycle">Billing Cycle</Label>
                <select
                  id="plan-cycle"
                  className="h-12 w-full rounded-lg border border-[var(--border-strong)] bg-white px-3 text-base"
                  value={currentForm.billingCycle}
                  onChange={(event) =>
                    updateForm((previous) => ({
                      ...previous,
                      billingCycle: event.target.value as "month" | "one-time",
                    }))
                  }
                >
                  <option value="month">Monthly</option>
                  <option value="one-time">One-time</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan-description">Description</Label>
              <Textarea
                id="plan-description"
                value={currentForm.description}
                onChange={(event) =>
                  updateForm((previous) => ({ ...previous, description: event.target.value }))
                }
                placeholder="Better for large team or company"
              />
            </div>

            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="grid grid-cols-3 gap-3">
                {iconOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => updateForm((previous) => ({ ...previous, icon: option.key }))}
                      className={cn(
                        "flex h-11 items-center justify-center gap-2 rounded-lg border text-sm font-semibold",
                        currentForm.icon === option.key
                          ? "border-[var(--brand-700)] bg-[var(--brand-50)] text-[var(--brand-700)]"
                          : "border-[var(--border)] bg-white text-[var(--text-secondary)]"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Benefits</Label>
              {currentForm.benefits.map((benefit, index) => (
                <div
                  key={`${benefit}-${index}`}
                  className="flex items-center justify-between gap-2 rounded-lg border border-[#efc2c7] bg-[#ffe9eb] px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#3ec164]" />
                    <span className="text-sm text-[var(--text-primary)]">{benefit}</span>
                  </div>
                  <button
                    type="button"
                    className="rounded-md p-1 text-[#f15d5d] hover:bg-[#ffd9dd]"
                    onClick={() => removeBenefit(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              <div className="flex gap-2">
                <Input
                  value={benefitDraft}
                  onChange={(event) => setBenefitDraft(event.target.value)}
                  placeholder="New benefit"
                />
                <Button type="button" className="h-12 px-5" onClick={addBenefit}>
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>

            <Button className="h-12 w-full rounded-full text-xl" onClick={submit} disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : isCreate ? "Create Plan" : "Save Plan"}
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#86a7ff] bg-gradient-to-b from-[#5a88ee] to-[#4f7df3] text-white shadow-md">
          <CardContent className="space-y-5 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white/15 p-2">
                <SelectedIcon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-2xl font-semibold">
                {currentForm.name || "Plan Name"}
              </h3>
            </div>

            <p className="text-5xl font-bold leading-none">
              {formatCurrency(currentForm.price || 0)}
              <span className="ml-2 text-2xl font-medium">
                /{currentForm.billingCycle === "month" ? "month" : "one-time"}
              </span>
            </p>

            <p className="text-lg text-white/85">
              {currentForm.description || "Better for large team or company"}
            </p>

            <div className="border-t border-white/40 pt-4">
              <h4 className="mb-3 text-3xl font-semibold">What You Get</h4>
              <div className="space-y-2">
                {currentForm.benefits.map((benefit, index) => (
                  <div key={`${benefit}-preview-${index}`} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#4be07a]" />
                    <p className="text-xl text-white">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            <Button className="h-12 w-full rounded-full bg-[var(--brand-700)] text-2xl hover:bg-[var(--brand-800)]">
              Done
              <Check className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
