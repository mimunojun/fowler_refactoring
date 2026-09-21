import test from "node:test";
import assert from "node:assert";
import { printOwing } from "../../src/06_first-step/using-local-variables.ts";
import { type Invoice } from "../../src/06_first-step/using-local-variables.ts";


test("printOwing()が正常に出力される", (t) => {
  let capturedOutput = '';
  console.log = (text: string) => {
    capturedOutput += text + '\n';
  }

  const expectedOutput = `***********************
**** Customer Owes ****
***********************
name: Spec Smith
amount: 7800
due: 10/21/2026
`;

  printOwing(fixedInvoice());
  assert.strictEqual(capturedOutput, expectedOutput)
});

function fixedInvoice(): Invoice {
  return {
    dueDate: undefined,
    customer: "Spec Smith",
    orders: [
      {
        amount: 500
      },
      {
        amount: 1500
      },
      {
        amount: 200
      },
      {
        amount: 5600
      },
    ]
  }
}
