# Idea 1 — Claude-for-Excel pipeline-point eval kit

**Status:** parked / saved (2026-09-09)  
**Type:** L1 capability eval pack, not a general agent benchmark  
**Wedge:** score one step in spreadsheet-agent inference, then compose into a full eval pipeline

This is the “Claude in Excel scorer + full eval pipeline” idea from product research. Do not merge it into a general synthetic-data generator. Keep it as a **vertical eval kit**.

---

## Why this exists

End-to-end spreadsheet benchmarks already exist:

- [SpreadsheetBench](https://spreadsheetbench.github.io/) / SpreadsheetBench 2 — workflow-level tasks (financial modeling, debugging, visualization). Best frontier models ~35% task accuracy; debugging ~12%. Claude for Excel ~15% on a hard 30-example product subset.
- Dominant failure mode in SpreadsheetBench 2: **insufficient inspection** and **wrong target-cell selection**, not “cannot use Excel at all.”

That is a **pipeline-point** failure. Macro scores detect it; they do not help you regress-test it.

Anthropic’s [Claude for Excel](https://claude.com/docs/office-agents/excel) product surface:

- Read workbooks, cell-level citations
- Update assumptions while preserving formula relationships
- Debug errors and root causes
- Build / populate models, multi-tab workbooks
- Native ops: sort, filter, pivot, validation
- Explicit warnings: not a final deliverable without review; prompt-injection via cells/formulas/comments

A useful OSS kit scores the **steps that product actually depends on**, with deterministic graders where possible.

---

## Pipeline map (what to score)

```
User instruction
  → Inspect workbook (sheets, used range, named ranges)
  → Locate target cells / ranges          ← excel-target
  → Read formula graph / precedents       ← excel-inspect
  → Plan edits (what changes, what must not)
  → Apply edits                           ← excel-edit
  → Preserve formula relationships        ← excel-deps
  → Recalc / check #REF! #VALUE! #DIV/0!  ← excel-recalc
  → Cite cells in the answer              ← excel-cite
  → Leave unrelated cells untouched       ← excel-noop
  → Final artifact / numeric outcome      ← excel-outcome (L3)
```

L3 (`excel-outcome`) is SpreadsheetBench territory. **Own L1–L2.** Use L3 only as an optional last gate.

---

## Full eval pipeline (product spec)

Not “run a model and LLM-judge the workbook.” A staged pipeline:

### Stage 0 — Fixtures

- Small, versioned `.xlsx` workbooks (single-sheet and multi-sheet)
- Each fixture has:
  - `workbook.xlsx`
  - `instruction.md` (natural-language task)
  - `spec.yaml` (ground truth: target cells, forbidden cells, expected values, citation cells)
  - optional `oracle.json` (human-solved edit list)
- Categories: assumption update, formula debug, cross-sheet lookup, chart-adjacent range, named range, pivot source, error cascade (`#REF!` chain)

### Stage 1 — Agent under test

Adapters:

- Generic tool-calling agent with a fake Excel tool API (`get_range`, `set_range`, `list_sheets`, `get_formula`)
- Optional: CLI scaffold that edits xlsx via `openpyxl` / LibreOffice calc
- Later: product adapters (Claude for Excel is hard to automate; treat as human-operated baseline, not v1)

Record a **trace**: inspection calls, cells read, cells written, final workbook bytes.

### Stage 2 — Deterministic scorers (no LLM required)

| Scorer ID | What it checks | Pass condition |
|-----------|----------------|----------------|
| `excel-target` | Did the agent select the right cells to change? | Intersection with `spec.targets`; penalty for extra cells |
| `excel-noop` | Unrelated cells unchanged | Exact cell-value + formula match vs baseline outside allow-list |
| `excel-deps` | Formula relationships intact | Precedent/dependent graph for edited cells still valid; no new `#REF!` |
| `excel-recalc` | Workbook calculates | Key output cells match expected numbers after calc |
| `excel-inspect` | Inspection depth | Required sheets/ranges were read *before* first write |
| `excel-cite` | Answer cites real cells | Cited `Sheet!A1` exists and is relevant (from spec) |
| `excel-safety` | Destructive bounds | No wipe of whole sheet, no delete of protected named ranges |

### Stage 3 — Hybrid / LLM judge (optional)

Use only when rules cannot see intent:

- Narrative explanation quality (with citations)
- “Did it understand the FP&A question?” given correct numbers
- Prompt-injection resistance (hidden instruction in a comment)

Never let the judge override a failed deterministic scorer.

### Stage 4 — Failure taxonomy

Emit one or more tags per run:

- `wrong_cell` / `label_cell_not_value`
- `skipped_inspection`
- `broke_formula`
- `over_edit`
- `missed_cross_sheet`
- `cited_hallucinated_cell`
- `stopped_at_symptom` (fixed `#VALUE!` display, not root formula)

This is the dashboard layer: **which pipeline point regressed**, not a single accuracy %.

### Stage 5 — Report

Per-run JSON + HTML:

- Scorecard by scorer
- Diff of changed cells
- Formula graph before/after
- Cost/latency if an LLM agent was used
- CI gate: `pipeline-eval run excel-target --gate 0.90`

---

## Suggested pack order (build later)

1. **`excel-target` + `excel-noop`** — smallest, maps to SpreadsheetBench’s main failure
2. **`excel-deps` + `excel-recalc`** — the Claude-for-Excel product promise (“preserve formula relationships”)
3. **`excel-inspect` + `excel-cite`** — product UX (sidebar citations)
4. **`excel-outcome`** — thin wrapper over a SpreadsheetBench-like subset, optional

---

## Positioning vs incumbents

| Incumbent | What they do | Why this is not them |
|-----------|----------------|----------------------|
| SpreadsheetBench 2 | End-to-end workflows, 593 cell edits avg | Too slow for CI; hides *which* step failed |
| BFCL | Tool-call AST | Wrong domain; no workbook semantics |
| Inspect / Harbor / Terminal-Bench | General eval infra | Use as runner later; do not become them |
| Claude for Excel docs | Product, not eval | No public micro-benchmark for cell pick / deps |

**One-liner:** *BFCL for spreadsheet agents — unit tests for cell targeting, inspection, and formula preservation, with an optional full-workbook gate.*

---

## Risks

- Excel recalc fidelity (openpyxl does not fully calc; may need LibreOffice / Excel COM / formulas only)
- Product APIs (Claude for Excel) are not easily scriptable — v1 scores **agents with a spreadsheet tool**, not the add-in
- Fixture quality dominates; bad ground-truth cells make the kit worthless
- Do not expand into a generic eval framework

---

## Next time we build this

Start with 40 fixtures, `excel-target` + `excel-noop` + cell-diff report, CLI, no UI. Add deps/recalc once calc engine choice is settled.
