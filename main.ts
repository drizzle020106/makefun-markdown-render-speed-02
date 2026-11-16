// Driver for the fast-marked entry: reads every case from the input
// directory, renders each one on its own with parse() from parse.js (a
// faster drop-in for marked 18.1.3), and writes the HTML strings, in the
// cases' order, to the output directory.
//
// The harness runs `node /bot/main.ts` with the repository at /bot, the
// cases at /input/cases.json and a writable /output. Outside a container,
// MAKEFUN_INPUT_DIR and MAKEFUN_OUTPUT_DIR stand in for /input and
// /output, exactly as the kit's baseline driver does.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from './parse.js';

const inputDir = process.env.MAKEFUN_INPUT_DIR ?? '/input';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const cases = JSON.parse(readFileSync(join(inputDir, 'cases.json'), 'utf8')) as Array<{ id: string; markdown: string }>;
const html = new Array<string>(cases.length);
for (let i = 0; i < cases.length; i++) {
  html[i] = parse(cases[i].markdown);
}
writeFileSync(join(outputDir, 'html.json'), JSON.stringify(html));
