import test from "node:test";
import { NumberRange, readingsOutsideRange, type Reading } from "./introduce-parameter-object.ts";
import assert from "node:assert";

const fixedStation = {
  name: "ZB1",
  readings: [
    { temp: 47, time: "2016-11-10 09:10" },
    { temp: 53, time: "2016-11-10 09:20" },
    { temp: 58, time: "2016-11-10 09:30" },
    { temp: 53, time: "2016-11-10 09:40" },
    { temp: 51, time: "2016-11-10 09:50" },
  ],
};

console.log(
);

test('範囲外のもののみ表示され、範囲内のものは表示されない', (t) => {
  const floor = 52;
  const ceiling = 70;
  const range = new NumberRange(floor, ceiling)

  const actualList = readingsOutsideRange(
    fixedStation,
    range
  );

  const expected = [
    { temp: 47, time: "2016-11-10 09:10" },
    { temp: 51, time: "2016-11-10 09:50" },
  ];

  assert.deepStrictEqual(actualList, expected)
});

test('範囲内のものしかないので、何も表示されない', (t) => {
  const floor = 40;
  const ceiling = 70;
  const range = new NumberRange(floor, ceiling)

  const actualList = readingsOutsideRange(
    fixedStation,
    range
  );

  const expected: Reading[] = [];

  assert.deepStrictEqual(actualList, expected)
});

test('範囲外のものしかないので、すべて表示される', (t) => {
  const floor = 65;
  const ceiling = 70;
  const range = new NumberRange(floor, ceiling)

  const actualList = readingsOutsideRange(
    fixedStation,
    range
  );

  const expected = [
    { temp: 47, time: "2016-11-10 09:10" },
    { temp: 53, time: "2016-11-10 09:20" },
    { temp: 58, time: "2016-11-10 09:30" },
    { temp: 53, time: "2016-11-10 09:40" },
    { temp: 51, time: "2016-11-10 09:50" },
  ];

  assert.deepStrictEqual(actualList, expected)
});
