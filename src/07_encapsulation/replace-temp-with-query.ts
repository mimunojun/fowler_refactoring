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

  get price() {
    var basePrice = this.quantity * this.item.price;
    var discountFactor = 0.98;
    if (basePrice > 1000) discountFactor -= 0.03;
    return basePrice * discountFactor;
  }
}
