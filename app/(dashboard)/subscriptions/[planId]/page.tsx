import { PlanEditor } from "@/components/subscriptions/plan-editor";

export default async function EditPlanPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const { planId } = await params;
  return <PlanEditor mode="edit" planId={planId} />;
}
