# Overview

[Tiếng Việt](../tong-quan.md) · **English**

Project home: trace count, model cost, scores, and time series.

Open it when you want to know the project is alive — ingest flowing, which model spends tokens, which scores exist — before inspecting one turn.

## Open

Sidebar **Tổng quan**. URL: `/project/{projectId}`.

## Use

1. Sign in, pick org **Vết**, project **Bot Zalo shop**.
2. The **Vết** card counts traces. Names you will see: `zalo-oa · hủy đơn`, `zalo-oa · hủy DH-88421`, `lark · im.message.receive_v1`.
3. **Chi phí model** is tokens × price. Local demo is usually $0.00.
4. **Scores** counts ingested scores (for example `# helpful`).
5. Scroll to the charts. Click a trace name on the card to go to [Traces](traces.md).

This page does not create data. If everything is zero, seed or Gửi thử — see [Start here](../README.en.md#path-for-a-new-operator).

## Related

- [Dashboards](dashboards.md) — the same numbers, custom layout
- [Traces](traces.md) — each turn
- [Scores](scores.md) — the score table
