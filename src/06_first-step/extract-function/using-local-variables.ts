type Order = {
  amount: number;
}

export type Invoice = {
  dueDate: Date | undefined;
  customer: string;
  orders: Order[];
}

class Clock {
  static get today(): Date {
    return new Date();
  }
}

export function printOwing(invoice: Invoice) {
  let outstanding = 0;

  printBanner();

  // 未払金の計算 (calculate outstanding)
  for (const o of invoice.orders) {
    outstanding += o.amount;
  }

  // 締め日の記録 (record due date)
  const today = Clock.today;

  invoice.dueDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30);

  // 明細の印字 (print details)
  console.log(`name: ${invoice.customer}`);
  console.log(`amount: ${outstanding}`);
  console.log(`due: ${invoice.dueDate.toLocaleDateString()}`);

  function printBanner() {
    console.log("***********************");
    console.log("**** Customer Owes ****");
    console.log("***********************");
  }
}
