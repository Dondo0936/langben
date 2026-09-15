# Datasets

[Tiếng Việt](../tap-du-lieu.md) · **English**

A dataset is a set of items (input, optional expected output) used to compare prompts, run experiments, or hold a gold set. Not a live Zalo session.

Open it when you want to regress a bot reply across many cases, not when you are inspecting production DH-88421.

## Open

Sidebar **Tập dữ liệu**. URL: `/project/{projectId}/datasets`.

Requires `datasets:read`.

## Use

1. Create a dataset, add items (input, optional expected output).
2. Add from a trace: [Traces](traces.md) has **Add to datasets**.
3. Run with [Evaluators](evaluators.md) or [Experiments](experiments.md) when that is on.
4. The demo seed does not fill a dataset.

## Related

- [Traces](traces.md) — source of real items
- [Experiments](experiments.md)
- [Prompts](prompts.md)
