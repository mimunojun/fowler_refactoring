export type Reading = {
  temp: number;
  time: string;
};

type Station = {
  name: string;
  readings: Reading[];
};

export function readingsOutsideRange(station: Station, range: NumberRange) {
  return station.readings.filter((r) => !range.Contains(r.temp));
}

export class NumberRange {
  // `readonly`アクセサにより、専用のgetter, setterを作成しなくて良い。
  readonly min: number;
  readonly max: number;

  constructor(min: number, max: number) {
    this.min = min;
    this.max = max;
  }

  public Contains(arg: number): boolean {
    return arg >= this.min && arg <= this.max;
  }
}
