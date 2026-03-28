import { TechnicalSignals as TechnicalSignalsType } from '@/types/stock';
import { formatNumber } from '@/utils/format';

const signalColor: Record<string, string> = {
  strong_buy: 'text-signalBuy',
  buy: 'text-signalBuy',
  neutral: 'text-signalNeutral',
  sell: 'text-signalSell',
  strong_sell: 'text-signalSell'
};

type Props = { technical: TechnicalSignalsType };

export const TechnicalSignals = ({ technical }: Props) => {
  const items = [
    { label: 'MA', value: formatNumber(technical.sma25), signal: technical.maSignal },
    { label: 'RSI(14)', value: formatNumber(technical.rsi14), signal: technical.rsiSignal },
    { label: 'MACD', value: formatNumber(technical.macd), signal: technical.macdSignalLabel },
    { label: 'BB', value: `${formatNumber(technical.bbLower)} - ${formatNumber(technical.bbUpper)}`, signal: technical.bbSignal }
  ];

  return (
    <div className="rounded-xl border border-slate-700 bg-bgSecondary p-4">
      <h3 className="mb-3 text-lg font-semibold">テクニカルシグナル</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.label} className="flex items-center justify-between rounded bg-slate-900 px-3 py-2">
            <span>{item.label}: {item.value}</span>
            <span className={signalColor[item.signal]}>{item.signal}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
