import test from "node:test";
import { Order, type Item } from "../../src/07_encapsulation/replace-temp-with-query.ts";
import assert from "node:assert";

const fixedItem: Item = {
  price: 500
}

test('追加の値引き対象であって、正常に値引きされた値段である', (t) => {
  const order = new Order(10, fixedItem);
  const actual = order.price;
  assert.strictEqual(actual, 4750);
});

test('追加の値引き対象でなくて、正常に値引きされた値段である', (t) => {
  const order = new Order(1, fixedItem);
  const actual = order.price;
  assert.strictEqual(actual, 490);
});
