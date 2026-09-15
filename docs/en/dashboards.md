# Dashboards

[Tiếng Việt](../bang-dieu-khien.md) · **English**

Widget dashboards: trace/observation/score counts, cost by model, latency percentiles. Unlike Overview, you pick widgets and save a view.

Open it when Overview is the wrong angle, or when you need cost/usage by model over a time range.

## Open

Sidebar **Bảng điều khiển**. URL: `/project/{projectId}/dashboards`.

This pin ships Langfuse’s Cost and Usage dashboards. Widget titles may still be English.

## Use

1. Open a built-in dashboard (Cost or Usage).
2. Change the time range and environment (`default`) in the top bar.
3. Click a widget to inspect the query; do not edit production widgets unless you need to.
4. **Create dashboard** for a custom layout: count, time series, or table widgets.

An empty chart means no observations in the filter range — not a broken dashboard. Narrow the filter or seed data.

## Related

- [Overview](overview.md) — default view, no dashboard to create
- [Settings](settings.md) — environments
