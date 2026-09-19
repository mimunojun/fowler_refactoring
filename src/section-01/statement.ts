type Performance = {
  playID: string;
  audience: number;
};

export type Invoice = {
  customer: string;
  performances: Performance[];
};

type PlayInfo = {
  name: string;
  type: string;
};

export type Play = {
  [playID: string]: PlayInfo;
};

export function statement(invoice: Invoice, plays: Play): string {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = 0;

    if (play == null) {
      throw new Error(`unknown playID: ${perf.playID}`);
    }

    thisAmount = amountFor(play, perf)

    // ボリューム特典のポイントを加算
    volumeCredits += Math.max(perf.audience - 30, 0);
    // 喜劇医のときは10人につき、さらにポイントを加算
    if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);
    //　注文の内訳を出力
    result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
    totalAmount += thisAmount;
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;
}

function amountFor(play: PlayInfo, perf: Performance): number {
  let result = 0;
  switch (play.type) {
    case "tragedy":
      result = 40000;
      if (perf.audience > 30) {
        result += 1000 * (perf.audience - 30);
      }
      break;
    case "comedy":
      result = 30000;
      if (perf.audience > 20) {
        result += 10000 + 500 * (perf.audience - 20);
      }
      result += 300 * perf.audience;
      break;
    default:
      throw new Error(`unknown type: ${play.type}`);
  }
  return result;
}
