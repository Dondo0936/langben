Langfuse OSS is a git submodule, pinned in `vendor/langfuse.pin` (v4.33.0).

```bash
git submodule update --init --recursive
# or
bash scripts/bootstrap-langfuse.sh
```

Do not vendor `ee/`. Vết UI diffs go in `overlay/langfuse/`.
