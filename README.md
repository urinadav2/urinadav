# SMB Ad Budget Allocator

A lightweight browser app that helps a small/medium business decide how to allocate a monthly advertising budget across channels.

## How it works

The app:
1. Applies each platform's minimum spend requirement.
2. Computes a quality score using `Expected ROAS × Confidence`.
3. Distributes remaining budget proportionally to quality scores.
4. Shows final dollar allocation and percentage share per platform.

## Run locally

Because this is a static app, you can open `index.html` directly or use a static server:

```bash
python -m http.server 8000
```

Then visit <http://localhost:8000>.
