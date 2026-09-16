Public brochure (Vercel) and Docker platform live in this app.

```bash
# from repo root — brochure only. Do not set VET_SURFACE=platform.
npm install
npm run dev
```

http://localhost:43173 — landing, docs, Kênh / Lộ trình, webhooks.

Docker Compose sets `VET_SURFACE=platform` and strips the landing page, so `:43173` is Kênh / Lộ trình / webhooks. The tracing console is Langfuse OSS on port 3000.
