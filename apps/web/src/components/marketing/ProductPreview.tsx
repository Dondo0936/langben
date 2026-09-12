export function ProductPreview() {
  return (
    <div className="overflow-hidden border border-white/15 bg-black/50">
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-white/50">
        <span className="h-2 w-2 rounded-full bg-white" />
        Zalo · user_847712 · phiên 14:02
      </div>
      <div className="grid md:grid-cols-[1fr_220px]">
        <div className="space-y-3 p-4 text-sm">
          <Bubble who="khách" time="14:02:01" text="hủy đơn" />
          <Bubble who="FPT" time="14:02:01" text="intent = cancel_order · 0.93" muted />
          <Bubble who="bot" time="14:03:08" text="Dạ, anh/chị cho em xin mã đơn để hủy ạ?" />
        </div>
        <div className="border-t border-white/10 p-3 text-[11px] text-white/70 md:border-l md:border-t-0">
          <div className="mb-2 font-medium uppercase tracking-[0.14em] text-white/90">Quan sát</div>
          <ol className="space-y-1.5 font-mono">
            <li>channel.inbound</li>
            <li className="pl-3">nlu · fpt</li>
            <li className="pl-3">generation · sonnet</li>
            <li>channel.outbound</li>
          </ol>
          <div className="mt-4 text-white/50">1.5s · 450 tokens · ước tính $0.0018</div>
        </div>
      </div>
    </div>
  );
}

function Bubble({
  who,
  time,
  text,
  muted,
}: {
  who: string;
  time: string;
  text: string;
  muted?: boolean;
}) {
  return (
    <div className={`px-3 py-2 ${muted ? "bg-white/5 text-white/70" : "bg-white/10 text-white"}`}>
      <div className="mb-1 flex gap-2 text-[10px] uppercase tracking-[0.14em] text-white/40">
        <span>{who}</span>
        <span>{time}</span>
      </div>
      {text}
    </div>
  );
}
