// 問い合わせによる一時変数の置き換え
//
// 関数の抽出の前段階として、これを行うと効果的かもしれない。
// なぜなら、抽出先の関数から問い合わせを行えば良くなり、
// パラメータとして変数を渡す必要が無くなる可能性があるためだ。

export type Item = {
  price: number;
}
export class Order {
  quantity: number;
  item: Item;

  constructor(quantity: number, item: Item) {
    this.quantity = quantity;
    this.item = item;
  }

  /**
   * 問い合わせとして置き換え。
   */
  get basePrice() {
    return this.quantity * this.item.price;
  }

  /**
   * 問い合わせとして置き換え。
   */
  get discountFactor() {
    var result = 0.98;
    if (this.basePrice > 1000) result -= 0.03;
    return result;
  }

  /**
   * basePrice, discountFactorはprice()の中で計算していたが、
   * 「問い合わせによる一時変数の置き換え」によって、
   * それぞれクエリとしてクラスにgetterを定義し、それを呼ぶ形になった。
   */
  get price() {
    return this.basePrice * this.discountFactor;
  }
}
