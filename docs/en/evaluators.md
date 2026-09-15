# Evaluators

[Tiếng Việt](../bo-danh-gia.md) · **English**

Evaluators (LLM-as-judge or heuristic) run on traces/datasets and write [Scores](scores.md). They do not replace Gửi thử. They do not replace a human reading the tree.

Open them when you already have turns (or a [Dataset](datasets.md)) and you want repeatable scoring — for example «did the reply mention the order id».

## Open

Sidebar **Bộ đánh giá**. URL: `/project/{projectId}/evals`.

Requires `evaluator:read` or `evaluationRule:read`.

## Use

1. Create an evaluator: judge model, judge prompt, output score name.
2. Attach a rule: run on new traces, or on a dataset.
3. Read jobs/results; scores land in the Scores table.
4. Empty onboarding is normal on the demo — the cancel-order seed does not create evaluators.

Needs an LLM connection like [Playground](playground.md). No model → the job fails.

## Related

- [Scores](scores.md) — where results show up
- [Datasets](datasets.md) — inputs for a batch run
- [Annotation](annotation.md) — when a human should score, not an LLM
