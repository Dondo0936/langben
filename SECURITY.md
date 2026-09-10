# Security

Report vulnerabilities privately if you can; otherwise open a GitHub issue without secrets or customer payloads.

- Ingest and OTLP secrets are stored as SHA-256 hashes and compared with `timingSafeEqual`. The Playground Anthropic key is read only on the server. There are no `NEXT_PUBLIC_` secrets.
- Channel webhook secrets are stored so signatures can be verified. The console API does not return them. Payloads are stored as received; this build does not redact phone/email/address or drop Viettel ASR audio. Minimize PII in the bot before it reaches Vết.
- Zalo OA MAC is required. Unsigned or invalid hooks receive 401.
- Cloud production requires `VET_SESSION_SECRET`. Set it for self-host as well; do not ship the placeholder.
