export const Uint8Array2Hex = (input: Uint8Array) => {
  return Buffer.from(input).toString('hex');
}

export const Hex2Base64 = (input: string) => {
  return Buffer.from(input, 'hex').toString('base64')
}

export const base64ToArrayBuffer = (str: string): ArrayBuffer =>
  Buffer.from(str, "base64").buffer

export const arrayBufferToBase64 = (buffer: ArrayBuffer): string =>
  Buffer.from(buffer).toString("base64")

export const fromDateTime = (date: Date) => {
  const rft = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" })

  const SECOND = 1000;
  const MINUTE = 60 * SECOND;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const WEEK = 7 * DAY;
  const MONTH = 30 * DAY;
  const YEAR = 365 * DAY;
  
  const intervals = [
      { ge: YEAR, divisor: YEAR, unit: 'year' },
      { ge: MONTH, divisor: MONTH, unit: 'month' },
      { ge: WEEK, divisor: WEEK, unit: 'week' },
      { ge: DAY, divisor: DAY, unit: 'day' },
      { ge: HOUR, divisor: HOUR, unit: 'hour' },
      { ge: MINUTE, divisor: MINUTE, unit: 'minute' },
      { ge: 30 * SECOND, divisor: SECOND, unit: 'seconds' },
      { ge: 0, divisor: 1, text: 'just now' },
  ];

  const now: number = new Date(Date.now()).getTime();
  const diff: number = now - (typeof date === 'object' ? date : new Date(date)).getTime();
  const diffAbs: number = Math.abs(diff);
  
  for (const interval of intervals) {
    if (diffAbs >= interval.ge) {
        const x = Math.round(Math.abs(diff) / interval.divisor);
        const isFuture = diff < 0;
        const unit: any = interval.unit
        return interval.unit ? rft.format(isFuture ? x : -x, unit) : interval.text;
    }
  }
}