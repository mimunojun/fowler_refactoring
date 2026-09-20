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

export type Plays = {
  [playID: string]: PlayInfo;
};

type EnrichedPerformance = Performance & {
  playInfo: PlayInfo;
  amount: number;
  volumeCredits: number;
};

export type StatementData = {
  customer: string;
  performances: EnrichedPerformance[];
  totalAmount: number;
  totalVolumeCredits: number;
};

export function createStatementData(invoice: Invoice, plays: Plays): StatementData {
  const enrichedPerformances = invoice.performances.map(enrichPerformance);
  const totalVolumeCredits = totalVolumeCreditsFor(enrichedPerformances);
  const totalAmount = totalAmountFor(enrichedPerformances);

  const statementData: StatementData = {
    customer: invoice.customer,
    performances: enrichedPerformances,
    totalAmount,
    totalVolumeCredits,
  };
  return statementData;

  function enrichPerformance(perf: Performance): EnrichedPerformance {
    const calculator = new PerformanceCalculator(perf, playInfoFor(perf));
    const playInfo = calculator.playInfo;
    const amount = calculator.amount;
    const volumeCredits = calculator.volumeCredits;
    return { ...perf, playInfo, amount, volumeCredits: volumeCredits };
  }

  function playInfoFor(perf: Performance): PlayInfo {
    const result = plays[perf.playID];
    if (result == null) {
      throw new Error(`unknown playID: ${perf.playID}`);
    }
    return result;
  }

  function totalVolumeCreditsFor(enrichedPerformances: EnrichedPerformance[]): number {
    return enrichedPerformances.reduce((acc, val) => acc + val.volumeCredits, 0);
  }

  function totalAmountFor(enrichedPerformances: EnrichedPerformance[]): number {
    return enrichedPerformances.reduce((acc, val) => acc + val.amount, 0);
  }
}

class PerformanceCalculator {
  performance: Performance;
  playInfo: PlayInfo;

  constructor(perf: Performance, playInfo: PlayInfo) {
    this.performance = perf;
    this.playInfo = playInfo;
  }

  get amount() {
    let result = 0;
    switch (this.playInfo.type) {
      case "tragedy":
        result = 40000;
        if (this.performance.audience > 30) {
          result += 1000 * (this.performance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (this.performance.audience > 20) {
          result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        break;
      default:
        throw new Error(`unknown type: ${this.playInfo.type}`);
    }
    return result;
  }

  get volumeCredits() {
    let result = 0;
    result += Math.max(this.performance.audience - 30, 0);
    if ("comedy" === this.playInfo.type) result += Math.floor(this.performance.audience / 5);
    return result;
  }
}
