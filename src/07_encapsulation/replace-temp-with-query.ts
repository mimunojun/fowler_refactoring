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

  get basePrice() {
    return this.quantity * this.item.price;
  }

  get discountFactor() {
    var result = 0.98;
    if (this.basePrice > 1000) result -= 0.03;
    return result;
  }

  get price() {
    return this.basePrice * this.discountFactor;
  }
}
