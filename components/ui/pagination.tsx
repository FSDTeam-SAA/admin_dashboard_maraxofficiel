import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const getVisiblePages = (page: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (page <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  if (page >= totalPages - 2) {
    return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "...", page - 1, page, page + 1, "...", totalPages];
};

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getVisiblePages(page, totalPages);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pages.map((item, index) =>
        item === "..." ? (
          <div
            key={`ellipsis-${index}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border)] bg-white"
          >
            <MoreHorizontal className="h-4 w-4 text-[var(--text-muted)]" />
          </div>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(Number(item))}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-md border text-sm font-semibold transition-colors",
              Number(item) === page
                ? "border-[var(--brand-700)] bg-[var(--brand-700)] text-white"
                : "border-[var(--border)] bg-white text-[var(--text-primary)] hover:bg-[var(--brand-50)]"
            )}
          >
            {item}
          </button>
        )
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
