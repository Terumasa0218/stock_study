import { Fundamentals } from '@/types/stock';
import { formatNumber, formatPercent } from '@/utils/format';

type Props = { fundamentals: Fundamentals };

const levelColor = (value: number | undefined, low: number, high: number) => {
  if (value === undefined) return 'text-signalNeutral';
  if (value < low) return 'text-signalBuy';
  if (value > high) return 'text-signalSell';
  return 'text-signalNeutral';
};

export const FundamentalsCard = ({ fundamentals }: Props) => {
  return (
    <div className="rounded-xl border border-slate-700 bg-bgSecondary p-4">
      <h3 className="mb-3 text-lg font-semibold">ファンダメンタルズ</h3>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className={levelColor(fundamentals.per, 12, 20)}>PER: {formatNumber(fundamentals.per)}</div>
        <div className={levelColor(fundamentals.pbr, 1, 2)}>PBR: {formatNumber(fundamentals.pbr)}</div>
        <div className={levelColor(fundamentals.roe, 8, 20)}>ROE: {formatPercent(fundamentals.roe)}</div>
        <div className="text-slate-200">配当利回り: {formatPercent(fundamentals.dividendYield)}</div>
      </div>
    </div>
  );
};
