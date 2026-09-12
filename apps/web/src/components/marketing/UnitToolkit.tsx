"use client";

import { useMemo, useState } from "react";
import type { Lang } from "@/lib/types";

const HOBBY_WHEN_CLOUD = 50_000;

export function UnitToolkit({ lang }: { lang: Lang }) {
  const vi = lang === "vi";
  const [conversations, setConversations] = useState(800);
  const [turns, setTurns] = useState(4);
  const [observations, setObservations] = useState(4);
  const [scores, setScores] = useState(0);

  const traces = conversations * turns;
  const obsTotal = traces * observations;
  const scoreTotal = traces * scores;
  const units = traces + obsTotal + scoreTotal;
  const tokensIfConfused = traces * 800;

  const breakdown = useMemo(
    () => [
      { label: vi ? "Vết (trace)" : "Traces", value: traces, why: vi ? "Mỗi lượt hội thoại = 1 vết" : "Each turn is 1 trace" },
      { label: vi ? "Quan sát (observation)" : "Observations", value: obsTotal, why: vi ? "Inbound, NLU, generation, outbound…" : "Inbound, NLU, generation, outbound…" },
      { label: vi ? "Điểm đánh giá (score)" : "Scores", value: scoreTotal, why: vi ? "Chỉ tính khi bạn gửi điểm" : "Only if you send a score" },
    ],
    [vi, traces, obsTotal, scoreTotal],
  );

  return (
    <div className="panel p-5 md:p-6">
      <p className="eyebrow">
        {vi ? "Bộ công cụ · không phải token" : "Toolkit · not tokens"}
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">
        {vi ? "Đơn vị là gì?" : "What is a unit?"}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        {vi
          ? "Đơn vị là đơn vị tính usage Cloud (khi Cloud mở). Một đơn vị = một vết, hoặc một quan sát, hoặc một điểm đánh giá. Token LLM (input/output) chỉ dùng ước chi phí model — không phải đơn vị."
          : "A unit is the Cloud usage meter (when Cloud opens). One unit = one trace, or one observation, or one score. LLM tokens (input/output) only estimate model cost — they are not units."}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          {
            k: vi ? "Không phải token" : "Not tokens",
            v: vi
              ? "Lần sinh 412 + 38 token vẫn là 1 quan sát = 1 đơn vị."
              : "A generation with 412 + 38 tokens is still 1 observation = 1 unit.",
          },
          {
            k: vi ? "Tự vận hành" : "Self-host",
            v: vi
              ? "MIT: không đếm đơn vị, không overage. Bạn trả infra."
              : "MIT: units are not metered. You pay infra.",
          },
          {
            k: vi ? "Cloud (sắp có)" : "Cloud (coming soon)",
            v: vi
              ? "Hobby dự kiến 50k đơn vị/tháng khi chúng tôi host."
              : "Hobby is planned at 50k units/month when we host it.",
          },
        ].map((c) => (
          <div key={c.k} className="panel p-4">
            <div className="text-sm font-medium">{c.k}</div>
            <p className="mt-1 text-sm text-muted">{c.v}</p>
          </div>
        ))}
      </div>

      <div className="panel mt-8 p-4">
        <h3 className="font-medium">{vi ? "Ví dụ có sẵn: Zalo «hủy đơn»" : "Shipped example: Zalo “cancel order”"}</h3>
        <p className="mt-1 text-sm text-muted">
          {vi
            ? "1 vết + inbound + FPT NLU + Anthropic generation + outbound = 5 đơn vị. Generation mang 450 token — vẫn chỉ 1 quan sát."
            : "1 trace + inbound + FPT NLU + Anthropic generation + outbound = 5 units. The generation carries 450 tokens — still 1 observation."}
        </p>
        <p className="mt-2 font-mono text-xs text-ink-2">1 + 4 + 0 scores = 5 {vi ? "đơn vị" : "units"}</p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="font-medium">{vi ? "Ước lượng bot của bạn" : "Estimate your bot"}</h3>
          <Slider
            label={vi ? "Hội thoại / tháng" : "Conversations / month"}
            value={conversations}
            min={10}
            max={5000}
            step={10}
            onChange={setConversations}
          />
          <Slider
            label={vi ? "Lượt / hội thoại" : "Turns / conversation"}
            value={turns}
            min={1}
            max={20}
            onChange={setTurns}
          />
          <Slider
            label={vi ? "Quan sát / lượt" : "Observations / turn"}
            value={observations}
            min={1}
            max={12}
            onChange={setObservations}
          />
          <Slider
            label={vi ? "Điểm đánh giá / lượt" : "Scores / turn"}
            value={scores}
            min={0}
            max={3}
            onChange={setScores}
          />
        </div>
        <div className="panel p-5">
          <div className="text-[11px] uppercase tracking-[0.16em] text-muted">
            {vi ? "Tổng đơn vị / tháng" : "Total units / month"}
          </div>
          <div className="mt-1 font-mono text-4xl font-semibold tabular text-ink">
            {units.toLocaleString(vi ? "vi-VN" : "en-US")}
          </div>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {breakdown.map((row) => (
              <li key={row.label} className="flex justify-between gap-3 border-b border-white/10 pb-2">
                <span>
                  {row.label}
                  <span className="mt-0.5 block text-[11px] text-muted">{row.why}</span>
                </span>
                <span className="tabular text-ink">{row.value.toLocaleString(vi ? "vi-VN" : "en-US")}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-ink">
            {vi
              ? `Khi Cloud mở, Hobby 50k ≈ ${Math.max(1, Math.floor(HOBBY_WHEN_CLOUD / (1 + observations + scores))).toLocaleString("vi-VN")} lượt kiểu này.`
              : `When Cloud opens, Hobby 50k covers about ${Math.max(1, Math.floor(HOBBY_WHEN_CLOUD / (1 + observations + scores))).toLocaleString("en-US")} turns like this.`}
          </p>
          <p className="mt-2 text-xs text-muted line-through">
            {vi
              ? `Không tính: ${tokensIfConfused.toLocaleString("vi-VN")} token (sai đơn vị).`
              : `Not this: ${tokensIfConfused.toLocaleString("en-US")} tokens (wrong meter).`}
          </p>
          <p className="mt-3 text-sm text-muted">
            {vi
              ? "Tự vận hành hôm nay: không có trần đơn vị."
              : "Self-host today: no unit cap."}
          </p>
        </div>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="mt-4 block text-sm">
      <span className="flex justify-between gap-3">
        <span>{label}</span>
        <span className="tabular text-muted">{value.toLocaleString()}</span>
      </span>
      <input
        type="range"
        className="mt-2 w-full accent-accent"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}
