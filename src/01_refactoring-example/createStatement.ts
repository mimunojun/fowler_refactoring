import { ComedyCalculator, TragedyCalculator, type PerformanceCalculator } from "./PerformanceCalculator.ts";

export type Performance = {
  playID: string;
  audience: number;
};

export type Invoice = {
  customer: string;
  performances: Performance[];
};

export type PlayInfo = {
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
    const calculator = createPerformanceCalculator(perf, playInfoFor(perf));
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

function createPerformanceCalculator(perf: Performance, playInfo: PlayInfo): PerformanceCalculator {
  switch (playInfo.type) {
    case "tragedy": return new TragedyCalculator(perf, playInfo);
    case "comedy": return new ComedyCalculator(perf, playInfo);
    default:
      throw new Error(`未知の演劇の種類: ${playInfo.type}`);
  }
}
