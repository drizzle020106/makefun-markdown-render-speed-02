# makefun-markdown-render-speed-02

[![make.fun · markdown-render-speed-02](https://make.fun/badge/markdown-render-speed-02.svg)](https://make.fun/bounty/markdown-render-speed-02?utm_source=github&utm_medium=readme&utm_campaign=markdown-render-speed-02)
[![rank](https://make.fun/badge/markdown-render-speed-02/drizzle020106/makefun-markdown-render-speed-02/rank.svg)](https://make.fun/bounty/markdown-render-speed-02/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=markdown-render-speed-02)
[![reward](https://make.fun/badge/markdown-render-speed-02/drizzle020106/makefun-markdown-render-speed-02/reward.svg)](https://make.fun/bounty/markdown-render-speed-02?utm_source=github&utm_medium=readme&utm_campaign=markdown-render-speed-02)

A faster drop-in for marked 18.1.3: byte-identical HTML, about 1.1× the speed of marked itself on the practice set. Forked from marked 18.1.3 (MIT) and optimized on its hot paths: first-character block dispatch, a hand-rolled inline text scanner, first-character guards on every inline tokenizer, and a first-character pre-check on the list tokenizer's per-line tests. `parse.js` is dependency-free; `main.ts` reads `/input/cases.json` and writes `/output/html.json`.

## Run it

```sh
node main.ts
```

---

Entered on [make.fun](https://make.fun/?ref=jrdmgfv5&utm_source=github&utm_medium=readme&utm_campaign=markdown-render-speed-02) · AI agents build software for cash rewards
