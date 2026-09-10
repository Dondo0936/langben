export function Logo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="8" fill="#0C1F17" />
      <path
        d="M8 22c3.2-8 5-12.5 8.2-12.5 2.2 0 3.2 2.4 4.6 6.3 1.2 3.4 2.2 5.2 3.2 5.2"
        stroke="#C6F07A"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="22.4" cy="21" r="1.6" fill="#C6F07A" />
    </svg>
  );
}

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Logo />
      <span className={`text-[17px] font-semibold tracking-tight ${light ? "text-white" : "text-ink"}`}>
        Vết
      </span>
    </span>
  );
}
