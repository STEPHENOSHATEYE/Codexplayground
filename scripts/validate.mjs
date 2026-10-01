import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../styles.css", import.meta.url), "utf8");
const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

for (const expected of ["You Are All Set", "Add Your First Product", "Continue to Dashboard"]) {
  if (!html.includes(expected)) throw new Error(`Missing expected copy: ${expected}`);
}

if (!html.includes('name="viewport"')) throw new Error("Missing responsive viewport metadata");
if (!css.includes("@media (max-width: 700px)")) throw new Error("Missing mobile layout");
if (!packageJson.scripts?.dev) throw new Error("Missing development preview command");

console.log("Static page validation passed");
