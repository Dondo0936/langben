# Alerts

[Tiếng Việt](../canh-bao.md) · **English**

Alerts watch a metric (error traces, latency, cost) and notify when it crosses a threshold. Available on Langfuse v4 when the project is not in legacy write mode.

Open it when production has traffic and you need to know the channel went quiet or error rate jumped — not to inspect one turn.

## Open

Sidebar **Cảnh báo**. URL: `/project/{projectId}/alerts`.

If the item is missing: the account lacks `alerts:read`, or write mode is `legacy`.

## Use

1. Create an alert: metric, threshold, evaluation window.
2. Attach a notification channel (email / webhook, depending on the instance).
3. Silence by environment if staging should not page.

Alerts do not replace [Traces](traces.md). When the pager fires, open Traces filtered to status error.

## Related

- [Overview](overview.md) — look at the numbers before you set a threshold
- [Settings](settings.md) — member permissions
