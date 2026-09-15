# Prompts

[Tiếng Việt](../prompt.md) · **English**

A versioned prompt store: name, body, labels (`production`, `latest`). The console does not call the model for your bot — the bot pulls the prompt via API or you copy it into code.

Open it to draft / version a system prompt, not to inspect a Zalo turn (use [Traces](traces.md)).

## Open

Sidebar **Prompt** (Quản lý prompt). URL: `/project/{projectId}/prompts`.

## Use

1. Create a prompt: name, type (text or chat), body.
2. Each save is a version. Attach a label when the bot should pin that version.
3. Open a version to diff against the previous one.
4. **Playground** on a prompt (when offered) sends the body to [Playground](playground.md).

The demo project may be empty. That is expected — the cancel-order seed does not create prompts.

## Related

- [Playground](playground.md) — run it
- [Datasets](datasets.md) — inputs to regress a prompt
