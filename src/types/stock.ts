export type Signal = 'strong_buy' | 'buy' | 'neutral' | 'sell' | 'strong_sell';

export type PricePoint = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type TechnicalSignals = {
  sma5?: number;
  sma25?: number;
  sma75?: number;
  sma200?: number;
  rsi14?: number;
  macd?: number;
  macdSignal?: number;
  bbUpper?: number;
  bbMiddle?: number;
  bbLower?: number;
  maSignal: Signal;
  rsiSignal: Signal;
  macdSignalLabel: Signal;
  bbSignal: Signal;
};

export type Fundamentals = {
  per?: number;
  pbr?: number;
  roe?: number;
  dividendYield?: number;
};
