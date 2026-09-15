# Scores

[Tiếng Việt](../diem.md) · **English**

A **score** is a quality label on a turn, observation, or session — for example `helpful = 1`. Not a token. Not a billing unit.

Open it when you already have a turn on [Sessions](sessions.md) and you want to record «this turn was fine / not fine».

## Open

Sidebar **Điểm** (Đánh giá agent). URL: `/project/{projectId}/scores`.

## Use

1. The table: timestamp, name (`helpful`), value, comment, trace. The demo seed has two cancel-order rows.
2. Attach a new score: open [Sessions](sessions.md) or [Traces](traces.md) → add score (name + value). Gửi thử does **not** create scores.
3. The **Phân tích** tab needs a score name in the dropdown. Empty dropdown → «Select a Score». That is not an error.
4. Declare score names under Settings → score configs before you score in bulk.
5. Production: the SDK sends the score with the trace (pk/sk in [Settings](settings.md)).

Do not use Phân tích until the Điểm table has rows.

## Related

- [Sessions](sessions.md) — where you score a turn by hand
- [Evaluators](evaluators.md) — automatic scoring
- [Overview](overview.md) — score counts
