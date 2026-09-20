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

type statementData = {
  customer: string;
  performances: Performance[];
};

function usd(current: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(current);
}

export function statement(invoice: Invoice, plays: Play): string {
  let statementData: statementData = {
    customer: invoice.customer,
    performances: invoice.performances,
  };
  return renderPlainText(statementData, plays);
}

export function renderPlainText(data: statementData, plays: Play): string {
  let result = `Statement for ${data.customer}\n`;

  for (let perf of data.performances) {
    result += ` ${playFor(perf).name}: ${usd(amountFor(perf) / 100)} (${perf.audience} seats)\n`;
  }

  result += `Amount owed is ${usd(totalAmount() / 100)}\n`;
  result += `You earned ${totalVolumeCredits()} credits\n`;
  return result;

  function playFor(perf: Performance): PlayInfo {
    const result = plays[perf.playID];
    if (result == null) {
      throw new Error(`unknown playID: ${perf.playID}`);
    }
    return result;
  }

  function amountFor(perf: Performance): number {
    let result = 0;
    switch (playFor(perf).type) {
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
        throw new Error(`unknown type: ${playFor(perf).type}`);
    }
    return result;
  }

  function volumeCreditsFor(perf: Performance): number {
    let result = 0;
    result += Math.max(perf.audience - 30, 0);
    if ("comedy" === playFor(perf).type) result += Math.floor(perf.audience / 5);
    return result;
  }

  function totalVolumeCredits(): number {
    let result = 0;
    for (let perf of data.performances) {
      result += volumeCreditsFor(perf);
    }
    return result;
  }

  function totalAmount(): number {
    let result = 0;
    for (let perf of data.performances) {
      result += amountFor(perf);
    }
    return result;
  }
}
