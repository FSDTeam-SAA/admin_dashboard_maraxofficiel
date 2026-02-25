import { cn } from "@/lib/utils";

type AuthPanelProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
};

export function AuthPanel({ title, subtitle, children, className }: AuthPanelProps) {
  return (
    <section className={cn("w-full max-w-[560px]", className)}>
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-[var(--text-primary)]">{title}</h1>
        {subtitle ? <p className="mt-3 text-xl text-[var(--text-muted)]">{subtitle}</p> : null}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}
