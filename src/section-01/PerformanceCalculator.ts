import type { Performance, PlayInfo } from "./createStatement.ts";

export class PerformanceCalculator {
  performance: Performance;
  playInfo: PlayInfo;

  constructor(perf: Performance, playInfo: PlayInfo) {
    this.performance = perf;
    this.playInfo = playInfo;
  }

  get amount(): number {
    throw new Error(`サブクラスの責務`);
  }

  get volumeCredits(): number {
    let result = 0;
    result += Math.max(this.performance.audience - 30, 0);
    return result;
  }
}

export class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 0;
    result = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }
    return result;
  }
}

export class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 0;
    result = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    result += 300 * this.performance.audience;
    return result;
  }

  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
  }
}
