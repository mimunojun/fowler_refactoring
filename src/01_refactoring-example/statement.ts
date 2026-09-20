import { createStatementData, type Invoice, type Plays, type StatementData } from "./createStatement.ts";

function usd(current: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(current);
}

export function statement(invoice: Invoice, plays: Plays): string {
  return renderPlainText(createStatementData(invoice, plays));
}

export function htmlStatement(invoice: Invoice, plays: Plays): string {
  return renderHtml(createStatementData(invoice, plays));
}

function renderPlainText(data: StatementData): string {
  let result = `Statement for ${data.customer}\n`;

  for (let enrichedPerf of data.performances) {
    result += ` ${enrichedPerf.playInfo.name}: ${usd(enrichedPerf.amount / 100)} (${enrichedPerf.audience} seats)\n`;
  }

  result += `Amount owed is ${usd(data.totalAmount / 100)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits\n`;
  return result;
}

function renderHtml(data: StatementData): string {
  let result = `<h1>Statement for ${data.customer}</h1>\n`;
  result += "<table>\n";
  result += "<tr><th>play</th><th>seats</th><th>cost</th></tr>";
  for (let perf of data.performances) {
    result += `  <tr><td>${perf.playInfo.name}</td><td>${perf.audience}</td>`;
    result += `<td>${usd(perf.amount)}</td></tr>\n`;
  }
  result += "</table>\n";
  result += `<p>Amount owed is <em>${usd(data.totalAmount)}</em></p>\n`;
  result += `<p> You earned <em>${data.totalVolumeCredits}</em> credits</p>\n`;
  return result;
}
