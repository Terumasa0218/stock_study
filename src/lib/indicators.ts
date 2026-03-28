import { PricePoint, Signal, TechnicalSignals } from '@/types/stock';

const sma = (values: number[], period: number): number | undefined => {
  if (values.length < period) return undefined;
  const recent = values.slice(-period);
  return recent.reduce((sum, v) => sum + v, 0) / period;
};

const emaSeries = (values: number[], period: number): number[] => {
  if (values.length === 0) return [];
  const k = 2 / (period + 1);
  const result: number[] = [values[0]];
  for (let i = 1; i < values.length; i += 1) {
    result.push(values[i] * k + result[i - 1] * (1 - k));
  }
  return result;
};

const calcRsi = (closes: number[], period = 14): number | undefined => {
  if (closes.length <= period) return undefined;
  const changes = closes.slice(1).map((c, i) => c - closes[i]);
  const recent = changes.slice(-period);
  const gains = recent.filter((v) => v > 0);
  const losses = recent.filter((v) => v < 0).map((v) => Math.abs(v));
  const avgGain = gains.reduce((a, b) => a + b, 0) / period;
  const avgLoss = losses.reduce((a, b) => a + b, 0) / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
};

const stddev = (values: number[]): number => {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
};

const byThreshold = (value: number, strongBuy: number, buy: number, sell: number, strongSell: number): Signal => {
  if (value >= strongBuy) return 'strong_buy';
  if (value >= buy) return 'buy';
  if (value <= strongSell) return 'strong_sell';
  if (value <= sell) return 'sell';
  return 'neutral';
};

export const calculateTechnicalSignals = (history: PricePoint[]): TechnicalSignals => {
  const closes = history.map((p) => p.close);
  const latest = closes.at(-1) ?? 0;

  const sma5 = sma(closes, 5);
  const sma25 = sma(closes, 25);
  const sma75 = sma(closes, 75);
  const sma200 = sma(closes, 200);

  const rsi14 = calcRsi(closes, 14);

  const ema12 = emaSeries(closes, 12);
  const ema26 = emaSeries(closes, 26);
  const macdSeries = ema12.map((v, i) => v - (ema26[i] ?? v));
  const macdSignalSeries = emaSeries(macdSeries, 9);
  const macd = macdSeries.at(-1);
  const macdSignal = macdSignalSeries.at(-1);

  const bbMiddle = sma(closes, 20);
  const recent20 = closes.slice(-20);
  const sd = recent20.length === 20 ? stddev(recent20) : undefined;
  const bbUpper = bbMiddle !== undefined && sd !== undefined ? bbMiddle + sd * 2 : undefined;
  const bbLower = bbMiddle !== undefined && sd !== undefined ? bbMiddle - sd * 2 : undefined;

  const maDiff = sma25 ? ((latest - sma25) / sma25) * 100 : 0;
  const maSignal = byThreshold(maDiff, 10, 3, -3, -10);

  const rsiSignal = rsi14 === undefined ? 'neutral' : rsi14 < 20 ? 'strong_buy' : rsi14 < 35 ? 'buy' : rsi14 > 80 ? 'strong_sell' : rsi14 > 65 ? 'sell' : 'neutral';

  const macdGap = macd !== undefined && macdSignal !== undefined ? macd - macdSignal : 0;
  const macdSignalLabel = byThreshold(macdGap, 1, 0.1, -0.1, -1);

  const bbSignal =
    bbUpper === undefined || bbLower === undefined
      ? 'neutral'
      : latest < bbLower
        ? 'buy'
        : latest > bbUpper
          ? 'sell'
          : 'neutral';

  return {
    sma5,
    sma25,
    sma75,
    sma200,
    rsi14,
    macd,
    macdSignal,
    bbUpper,
    bbMiddle,
    bbLower,
    maSignal,
    rsiSignal,
    macdSignalLabel,
    bbSignal
  };
};
