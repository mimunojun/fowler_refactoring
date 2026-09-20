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

type EnrichedPerformance = Performance & {
  playInfo: PlayInfo;
  amount: number;
  volumeCredits: number;
};

type StatementData = {
  customer: string;
  performances: EnrichedPerformance[];
  totalVolumeCredits: number;
};

function usd(current: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(current);
}

export function statement(invoice: Invoice, plays: Play): string {
  const performances = invoice.performances.map(enrichPerformance);
  const totalVolumeCredits = totalVolumeCreditsFor(performances);
  const statementData: StatementData = {
    customer: invoice.customer,
    performances,
    totalVolumeCredits,
  };
  return renderPlainText(statementData);

  function enrichPerformance(perf: Performance): EnrichedPerformance {
    const playInfo = playInfoFor(perf);
    const amount = amountFor(perf, playInfo);
    const volumeCredits = volumeCreditsFor(perf, playInfo);
    return { ...perf, playInfo, amount, volumeCredits: volumeCredits };
  }

  function playInfoFor(perf: Performance): PlayInfo {
    const result = plays[perf.playID];
    if (result == null) {
      throw new Error(`unknown playID: ${perf.playID}`);
    }
    return result;
  }

  function amountFor(perf: Performance, play: PlayInfo): number {
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

  function volumeCreditsFor(perf: Performance, playInfo: PlayInfo): number {
    let result = 0;
    result += Math.max(perf.audience - 30, 0);
    if ("comedy" === playInfo.type) result += Math.floor(perf.audience / 5);
    return result;
  }

  function totalVolumeCreditsFor(enrichedPerformances: EnrichedPerformance[]): number {
    let result = 0;
    for (let enrichedPerf of enrichedPerformances) {
      result += enrichedPerf.volumeCredits;
    }
    return result;
  }
}

export function renderPlainText(data: StatementData): string {
  let result = `Statement for ${data.customer}\n`;

  for (let perf of data.performances) {
    result += ` ${perf.playInfo.name}: ${usd(perf.amount / 100)} (${perf.audience} seats)\n`;
  }

  result += `Amount owed is ${usd(totalAmount() / 100)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits\n`;
  return result;

  function totalAmount(): number {
    let result = 0;
    for (let perf of data.performances) {
      result += perf.amount;
    }
    return result;
  }
}
