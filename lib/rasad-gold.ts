import {readFile} from "node:fs/promises";
import {join} from "node:path";

type Quote = {date: string; rials: number};
type Snapshot = {source: string; currency: string; unit: string; months: Record<string, Quote>};
let cached: {until: number; value: Promise<Snapshot & {reference: Quote; mode: string}>} | undefined;

export function readGoldCalendar(root: string) {
  if (cached && Date.now() < cached.until) return cached.value;
  const value = (async () => {
    const base: Snapshot = JSON.parse(await readFile(join(root, 'gold-closes.json'), 'utf8'));
    const last = Object.values(base.months).sort((first, second) => second.date.localeCompare(first.date))[0];
    try {
      const endpoint = 'https://api.tgju.org/v1/market/indicator/summary-table-data/geram18?lang=en&order_col=timestamp&order_dir=desc&start=0&length=7';
      const result = await fetch(endpoint, {signal: AbortSignal.timeout(3000), cache: 'no-store'});
      if (!result.ok) throw Error('Quote unavailable');
      const latest: unknown[][] = (await result.json()).data;
      if (!Array.isArray(latest) || !latest.length) throw Error('No quotes');
      const months = {...base.months};
      let reference = last;
      for (const record of latest) {
        const date = String(record[6]).replaceAll('/', '-');
        const rials = Number(String(record[3]).replaceAll(',', ''));
        const period = String(record[7]).slice(0, 7).replace('/', '');
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date > new Date().toISOString().slice(0, 10)
          || !/^\d{6}$/.test(period) || !Number.isSafeInteger(rials) || rials <= 0) continue;
        const quote = {date, rials};
        if (!months[period] || date > months[period].date) months[period] = quote;
        if (date > reference.date) reference = quote;
      }
      return {...base, months, reference, mode: 'latest-close'};
    } catch {
      if (cached) cached.until = Date.now() + 5 * 60 * 1000;
      return {...base, reference: last, mode: 'archive'};
    }
  })().catch(error => { cached = undefined; throw error; });
  cached = {until: Date.now() + 60 * 60 * 1000, value};
  return value;
}
