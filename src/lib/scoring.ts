import { Fundamentals, Signal, TechnicalSignals } from '@/types/stock';

const signalToScore = (signal: Signal): number => {
  switch (signal) {
    case 'strong_buy':
      return 1;
    case 'buy':
      return 0.5;
    case 'neutral':
      return 0;
    case 'sell':
      return -0.5;
    case 'strong_sell':
      return -1;
    default:
      return 0;
  }
};

const fundamentalsScore = (f: Fundamentals): number => {
  const per = f.per ? (f.per < 12 ? 0.6 : f.per < 20 ? 0.2 : -0.4) : 0;
  const pbr = f.pbr ? (f.pbr < 1 ? 0.5 : f.pbr < 2 ? 0.1 : -0.4) : 0;
  const roe = f.roe ? (f.roe > 12 ? 0.6 : f.roe > 8 ? 0.3 : -0.2) : 0;
  const div = f.dividendYield ? (f.dividendYield > 3 ? 0.5 : f.dividendYield > 1 ? 0.2 : -0.1) : 0;
  return (per + pbr + roe + div) / 4;
};

export const calculateCompositeScore = (technical: TechnicalSignals, fundamentals: Fundamentals): number => {
  const techSignals = [technical.maSignal, technical.rsiSignal, technical.macdSignalLabel, technical.bbSignal];
  const techScore = techSignals.reduce((sum, s) => sum + signalToScore(s), 0) / techSignals.length;
  const fundScore = fundamentalsScore(fundamentals);
  const newsScore = 0;

  const weighted = techScore * 0.4 + fundScore * 0.35 + newsScore * 0.25;
  return Math.max(-1, Math.min(1, weighted));
};
