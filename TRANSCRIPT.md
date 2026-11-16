# Transcript

Record of the work that built this entry, 2026-11-16 (CST), in the order it
happened. Commands are shown as run; outputs are quoted or summarized.

NOTE: this bounty takes no transcript upload — entries need sealed
recordings made live with `makefun record` while a recorded-harness agent
worked. This file is a plain record of this (unrecorded) build session only;
it does not satisfy the bouty's `transcripts_witnessed` check. A fresh
recorded-harness session is needed before submission.

## 1. Kit download and verification

```
GET https://make.fun/c/markdown-render-speed-02/kit
  -> ~/workspace/makefun-kits/markdown-render-speed-02-kit.tar.gz
     (7,524,115 bytes), unpacked to
     ~/workspace/makefun-kits/markdown-render-speed-02-kit/markdown-render-speed-02-kit/
GET https://make.fun/api/competitions/markdown-render-speed-02/kit  (manifest)
```

Result: the outer tarball's sha256 did not match the manifest's
`bundle_sha256`, but all 27 files inside verified against the manifest
sha256 — 0 mismatches, including RULES.txt and the practice
`cases.json` / `expected.json`. RULES.txt (398 lines) read in full.

## 2. Baseline

```
node validate.mjs <kit baseline>
```

Result: marked itself renders the 720-case practice set byte-identically,
720/720, ~930 ms median for the full set on this VM.

## 3. Approach

A from-scratch parser would fail many of the 680 spec examples, so the
entry forks marked 18.1.3 (MIT, credited; explicitly allowed by RULES.txt)
and optimizes its hot paths. Readable sources came from
`npm pack marked@18.1.3`; `lib/marked.esm.js` sha256
`e76f3b37046a5d294159872002e5f6fcda8ed232e1be45ff76b3863f2919dae3` matches the
kit-vendored file exactly. Original TypeScript sources were extracted from
the `.map` `sourcesContent` (11 files, 3,864 lines) and bundled with
esbuild 0.25.0 into `parse.js`. Development sources live in the build
session's dev directory, not in this repo; `parse.js` here carries a
fork-attribution banner.

## 4. Optimizations (in order)

1. Block first-char dispatch in `Lexer.blockTokens`, with a plain-paragraph
   fast path guarded by scanning every line to the next blank line for a
   table-delimiter or setext-underline line. (First version checked line 2
   only and broke setext headings cm-081/082/095; fixed by scanning all
   lines.)
2. Hand-rolled inline text scanner `scanInlineTextEnd` in `Tokenizer`,
   equivalent to the giant GFM text regex, used only when GFM is on, breaks
   off, pedantic off.
3. First-char guards on every inline tokenizer in `Lexer.#tokenizeInlines`.
4. `lex()` CRLF fast path: replace carriage returns only when `\r` is present.
5. Table-driven dispatch in `scanInlineTextEnd` (a `Uint8Array` action table
   per character code). First version dropped the email stop check for
   spaces (24 inline-fuzz failures, e.g. `3__x@y.zza`); fixed by adding the
   check to the space branch.
6. First-char pre-check on the list tokenizer's per-line block-start regex
   tests (`blockStartCode`): a line whose first significant character cannot
   open a fence/heading/html/blockquote/bullet/hr skips all six tests.

## 5. Validation

Practice set (720 cases), after every build:

```
node validate.mjs parse.js --bench=7
correctness: 720/720 identical
```

Fresh generator draws (kit's own `program/generator/draw.ts`, new seeds):

```
node fuzz.mjs parse.js 2 100    -> seed 100: 720/720
node fuzz.mjs parse.js 4 200    -> seeds 200-203: 2880/2880
node fuzz.mjs parse.js 3 300    -> seeds 300-302: 2160/2160
node fuzz.mjs parse.js 2 400    -> seeds 400-401: 1440/1440
node fuzz.mjs parse.js 2 500    -> seeds 500-501: 1440/1440
```

Total: 0 failures across 10 fresh draws (400 fresh documents). Marked-sanity
check true each time.

Inline soup fuzz (random single-paragraph soups of markdown-special
fragments vs marked):

```
node fuzz-inline.mjs parse.js 8000 7    -> 8000/8000 identical
node fuzz-inline.mjs parse.js 20000 99  -> 20000/20000 identical
```

Earlier runs found and fixed bugs in the email/mailto/xmpp stop rules of
the text scanner (55/8000 then 72/8000 failures, then 24/8000 from the
space-branch regression above); all fixed and re-verified at 0 failures.

## 6. Speed (this shared VM; CPU median of interleaved runs)

Final build, three 7-run benchmarks of the full 720-case practice set:

```
candidate CPU median  810.5 ms  vs marked  902.2 ms  -> 1.113x
candidate CPU median  809.4 ms  vs marked  929.6 ms  -> 1.149x
candidate CPU median  839.2 ms  vs marked  914.3 ms  -> 1.089x
```

About 1.1x faster than marked itself. A real but modest speedup: with
1,656 submissions this is a long shot for a top-20 paid place, but it
passes the identical-HTML gate and beats the baseline.

## 7. Repo assembly (2026-11-16 ~22:45-23:00 CST)

Wrote `main.ts` (own driver: reads `MAKEFUN_INPUT_DIR`/`/input` cases.json,
writes `MAKEFUN_OUTPUT_DIR`/`/output` html.json), `README.md` (official
template, 3 live make.fun badges, owner `drizzle020106`, repo
`makefun-markdown-render-speed-02`, referral `jrdmgfv5`), MIT `LICENSE`,
`package.json` (`{"type":"module"}`), `.makefun/owner.json` (wallet
`L1R9LhBdfouFX1vZXaugx1NufnEpoi93bXmVPRpWeXu`), `vendor/marked/LICENSE`
and `vendor/marked/NOTICE` (sha-verified copies of the kit's files), and
this file. No submission, payment, or signing was done. The GitHub repo
does not exist yet — it must be created after the bounty opened
(2026-11-15T20:30:00Z) and its About set to website
`https://make.fun/bounty/markdown-render-speed-02` with topics
`makefun, ai-agents, bounties, code` before submission.

## 8. Final checks (2026-11-16 ~22:44-22:45 CST)

`makefun check` on the worktree first failed one check — `license_osi`:
the root LICENSE carried no `SPDX-License-Identifier` line. Fixed by
adding `SPDX-License-Identifier: MIT` to LICENSE. Re-run: 5 passed
(competition_open, snapshot, license_osi, entrypoint, entry_size),
0 failed; the rest are skips or "checked at submission" (repo not yet on
GitHub).

Kit scorer run directly on `main.ts` output:

```
{"passed":1,"cases_passed":720,"cases_total":720}
```

`grade-local --driver process` (no docker on this VM; the server grades
in docker, so this is the closest local equivalent):

```
scores    {"cases_passed":720,"cases_total":720,"passed":1}
checks    720 of 720 points over 71 checks
eligible  ranked yes, prize no, efficiency no
          (no_transcripts, coverage_below_gate, cost_unpriced)
result_sha256  d555427c7bc377208e39660f35ef9e31da09b4c383fc7563f24554be8024954a
```

The "prize no" is the missing sealed recordings only — not the code.
The result hash cannot equal the server's (this VM runs Node 24.22.1;
the server harness runs Node 26.13.1, and no transcripts were supplied).
