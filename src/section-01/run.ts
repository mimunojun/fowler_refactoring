import { statement } from "./statement.ts";
import { type Invoice, type Play } from "./statement.ts";

import { readFileSync } from "node:fs";

const invoices: Invoice[] = JSON.parse(
  readFileSync(new URL("./invoices.json", import.meta.url), "utf-8"),
);
const plays: Play = JSON.parse(
  readFileSync(new URL("./plays.json", import.meta.url), "utf-8"),
);

for (const invoice of invoices) {
  console.log(statement(invoice, plays));
}
