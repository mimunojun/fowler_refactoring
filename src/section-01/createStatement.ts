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
    return enrichedPerformances.reduce((acc, val) => acc + val.volumeCredits, 0);
  }

  function totalAmountFor(enrichedPerformances: EnrichedPerformance[]): number {
    return enrichedPerformances.reduce((acc, val) => acc + val.amount, 0);
  }
}
