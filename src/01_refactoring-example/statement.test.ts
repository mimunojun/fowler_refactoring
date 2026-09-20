import { test } from "node:test";
import assert from "node:assert";
import { statement } from "./statement.ts";
import { type Invoice, type Plays } from "./createStatement.ts";

test("一番外側から実行して、正常にStatementが表示される", (t) => {
  const invoices = fixedInvoices();
  const plays = fixedPlays();

  for (const invoice of invoices) {
    const print = statement(invoice, plays);
    const expected = `Statement for BigCo
 Hamlet: $650.00 (55 seats)
 As You Like It: $580.00 (35 seats)
 Othello: $500.00 (40 seats)
Amount owed is $1,730.00
You earned 47 credits
`;
    assert.strictEqual(print, expected);
  }
});

function fixedInvoices(): Invoice[] {
  return [
    {
      customer: "BigCo",
      performances: [
        {
          playID: "hamlet",
          audience: 55,
        },
        {
          playID: "as-like",
          audience: 35,
        },
        {
          playID: "othello",
          audience: 40,
        },
      ],
    },
  ];
}

function fixedPlays(): Plays {
  return {
    hamlet: { name: "Hamlet", type: "tragedy" },
    "as-like": { name: "As You Like It", type: "comedy" },
    othello: { name: "Othello", type: "tragedy" },
  };
}
