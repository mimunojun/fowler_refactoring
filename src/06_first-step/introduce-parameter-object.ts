// パラメータオブジェクトの導入 (p.146)
//
// 複数のデータ項目がパラメータとして関数に与えられている場合、
// それらを1つの構造体(あるいはオブジェクトやクラス)として定義して扱うことが可能。
//
// 単にパラメータに渡す数が減るだけではなく、渡しているデータを**新たな抽象に引き上げる**
// ことで、**セマンティクスな理解**を助けることに繋がる可能性がある。
//
// クラスとして定義したならば、そのクラスの振る舞いとしてロジックを移す余地が生まれる(この例のように)。

export type Reading = {
  temp: number;
  time: string;
};

type Station = {
  name: string;
  readings: Reading[];
};

// ロジックはクラスに委譲された。
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

  // ロジックをクラスに委譲した。
  public Contains(arg: number): boolean {
    return arg >= this.min && arg <= this.max;
  }
}
