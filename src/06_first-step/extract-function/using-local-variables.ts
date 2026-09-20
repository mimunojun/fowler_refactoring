// 関数の抽出
// 例: ローカル変数を使用する場合
//
// 関数の抽出が、その関数の入れ子関数として**行われない**場合であって、
// 参照されるローカル変数が再代入されない場合。

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

  printDetails(invoice, outstanding);

  function printBanner() {
    console.log("***********************");
    console.log("**** Customer Owes ****");
    console.log("***********************");
  }
}

/**
 * 処理で参照しているローカル変数を、ただ参照しているだけなので
 * 引数でそれらを渡せば良い。
 */
function printDetails(invoice: Invoice, outstanding: number) {
  if (invoice.dueDate === undefined) {
    throw new Error('dueDateが未定義');
  }

  // 明細の印字 (print details)
  console.log(`name: ${invoice.customer}`);
  console.log(`amount: ${outstanding}`);
  console.log(`due: ${invoice.dueDate.toLocaleDateString()}`);
}
