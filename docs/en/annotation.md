# Annotation

[Tiếng Việt](../gan-nhan.md) · **English**

Annotation queues: a human reads a turn and fills a label form. Use when LLM-as-judge is not enough, or when you are still defining the rubric.

## Open

Sidebar **Gán nhãn**. URL: `/project/{projectId}/annotation-queues`.

Requires `annotationQueues:read`.

## Use

1. Create a queue: name, form (label fields).
2. Put traces/observations in the queue (from Traces or a rule).
3. Open the queue, label in order. Results become scores / annotations on that object.
4. The demo stays empty until you create a queue.

## Related

- [Scores](scores.md)
- [Evaluators](evaluators.md)
- [Traces](traces.md)
