# Vết

<img src="readme/logo.png" alt="Vết" width="72" align="right" />

[Tiếng Việt](README.md) · **English**

LLM observability plus Vietnamese production channels (Zalo, FPT.AI, Viettel, Lark). Self-hosted. Console is Langfuse OSS v4.33.0.

<p align="center">
  <img src="readme/overview.png" alt="Vết overview: traces, model cost, and scores for Bot Zalo shop" width="900" />
</p>

<table>
  <tr>
    <td width="50%"><img src="readme/session.png" alt="Zalo OA session: hủy đơn, DH-88421, and a helpful score on one thread" /></td>
    <td width="50%"><img src="readme/trace.png" alt="Trace tree: zalo.inbound → fpt.nlu → crm.lookup_order → Claude → zalo.outbound" /></td>
  </tr>
  <tr>
    <td width="50%"><img src="readme/channels.png" alt="Kênh: Zalo OA, Zalo Bot, FPT.AI, Viettel, Lark, Google Chat, Teams" /></td>
    <td width="50%"><img src="readme/routes.png" alt="Lộ trình maps from webhook inbound to NLU, generation, and reply" /></td>
  </tr>
</table>

<p align="center">
  <img src="readme/scores.png" alt="Điểm: helpful = 1 on both hủy-đơn turns" width="900" />
</p>

## Run locally

```bash
git clone --recurse-submodules https://github.com/Dondo0936/langben.git
cd langben
cp .env.console.example .env
bash scripts/up.sh
```

| | URL |
|---|---|
| Console | [http://localhost:3000](http://localhost:3000) |
| Kênh, Lộ trình, `/hooks` | [http://localhost:43173](http://localhost:43173) |

Login: `demo@vet.dev` / `demodemo`. Org Vết, project Bot Zalo shop (`prj-vet-demo`).

First run takes several minutes. If `docker` needs root, the script uses `sudo`. Rotate the demo password and keys before exposing any port.

Docs: [docs/README.en.md](docs/README.en.md).

## Repo layout

```
apps/web                 Kênh / Lộ trình / webhooks
vendor/langfuse          Langfuse OSS submodule (console :3000)
overlay/langfuse         Vietnamese UI overlay on the console
docs                     Console documentation
readme                   GitHub README screenshots
```

See [NOTICE](NOTICE).
