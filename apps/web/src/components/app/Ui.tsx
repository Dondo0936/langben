import { cn } from "@/lib/format";
import type { TraceStatus } from "@/lib/types";

export function StatusPill({ status }: { status: TraceStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-1.5 py-px text-[10px] font-medium uppercase tracking-wide",
        status === "ok" && "bg-emerald-50 text-emerald-700",
        status === "error" && "bg-red-50 text-red-700",
        status === "unset" && "bg-zinc-100 text-zinc-500",
      )}
    >
      {status === "ok" ? "OK" : status === "error" ? "Error" : "—"}
    </span>
  );
}

export function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="rounded-md border border-dashed border-line bg-white p-10 text-center">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted">{hint}</p>
    </div>
  );
}

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-white p-3">
      <div className="text-[11px] text-muted">{label}</div>
      <div className="mt-1 text-xl font-semibold tabular">{value}</div>
    </div>
  );
}

export function TableShell({
  children,
  className,
  tableClassName,
}: {
  children: React.ReactNode;
  className?: string;
  tableClassName?: string;
}) {
  return (
    <div className={cn("overflow-x-auto rounded-md border border-line bg-white", className)}>
      <table className={cn("w-full text-left text-[13px]", tableClassName)}>{children}</table>
    </div>
  );
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return <thead className="border-b border-line bg-paper-2 text-xs font-medium text-muted">{children}</thead>;
}
