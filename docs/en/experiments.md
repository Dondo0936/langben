# Experiments

[Tiếng Việt](../thi-nghiem.md) · **English**

Run a [Dataset](datasets.md) through a prompt/model and compare outputs. On Vết (Langfuse v4.33.0) this item is **off by default** (`experimentsV4Enabled`). The sidebar hides it until the flag is on.

Open it only when you are comparing two prompt versions on a gold set. Not the place to read Zalo turns.

## Open

Sidebar **Thí nghiệm** — only with the flag on. URL: `/project/{projectId}/experiments`.

## Use

1. Confirm the flag and that the dataset has items.
2. Create an experiment: dataset, prompt or model.
3. Run it, read the output / score comparison table.
4. Default `scripts/up.sh`: skip this item.

## Related

- [Datasets](datasets.md)
- [Prompts](prompts.md)
- [Scores](scores.md)
