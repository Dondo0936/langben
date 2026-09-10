import { cn } from "@/lib/format";
import type { TraceStatus } from "@/lib/types";

export function StatusPill({ status }: { status: TraceStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium",
        status === "ok" && "bg-emerald-100 text-emerald-800",
        status === "error" && "bg-red-100 text-red-800",
        status === "unset" && "bg-stone-100 text-stone-600",
      )}
    >
      {status === "ok" ? "ổn" : status === "error" ? "lỗi" : "—"}
    </span>
  );
}

export function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-white p-10 text-center">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted">{hint}</p>
    </div>
  );
}

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <div className="text-xs text-muted">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular">{value}</div>
    </div>
  );
}
