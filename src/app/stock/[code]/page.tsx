import { AIJudgment } from '@/components/ai/AIJudgment';
import { PriceChart } from '@/components/chart/PriceChart';
import { FundamentalsCard } from '@/components/fundamentals/FundamentalsCard';
import { TechnicalSignals } from '@/components/indicators/TechnicalSignals';
import { JudgmentForm } from '@/components/journal/JudgmentForm';
import { NewsFeed } from '@/components/news/NewsFeed';
import { calculateTechnicalSignals } from '@/lib/indicators';
import { calculateCompositeScore } from '@/lib/scoring';
import { PricePoint } from '@/types/stock';
import { formatNumber, formatPercent } from '@/utils/format';

type Props = { params: { code: string } };

const getJson = async <T,>(url: string): Promise<T> => {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

export default async function StockDashboardPage({ params }: Props) {
  const code = params.code;

  const [quote, historyRes, profile] = await Promise.all([
    getJson<any>(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/quote/${code}`),
    getJson<{ data: PricePoint[] }>(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/history/${code}?range=6mo`),
    getJson<any>(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/profile/${code}`)
  ]);

  const history = historyRes.data ?? [];
  const technical = calculateTechnicalSignals(history);
  const fundamentals = {
    per: profile.summaryDetail?.trailingPE,
    pbr: profile.defaultKeyStatistics?.priceToBook,
    roe: (profile.financialData?.returnOnEquity ?? 0) * 100,
    dividendYield: (profile.summaryDetail?.dividendYield ?? 0) * 100
  };
  const score = calculateCompositeScore(technical, fundamentals);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 rounded-xl border border-slate-700 bg-bgSecondary p-4 md:grid-cols-5">
        <div className="md:col-span-4">
          <h2 className="text-2xl font-bold">{quote.longName ?? code}</h2>
          <p className="text-slate-300">
            {formatNumber(quote.regularMarketPrice)} 円 ({formatPercent(quote.regularMarketChangePercent)}) / 出来高 {formatNumber(quote.regularMarketVolume, 0)}
          </p>
        </div>
        <div className="flex items-center justify-end">
          <span className="rounded-full bg-accentBlue/20 px-3 py-1 text-sm text-accentCyan">上昇傾向</span>
        </div>
        <div className="md:col-span-5">
          <div className="mb-2 flex gap-2 text-xs">
            {['1ヶ月', '3ヶ月', '6ヶ月', '1年'].map((v) => (
              <span key={v} className="rounded bg-slate-800 px-2 py-1">{v}</span>
            ))}
          </div>
          <PriceChart data={history} />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <NewsFeed news={profile.news ?? []} />
          <div className="rounded-xl border border-slate-700 bg-bgSecondary p-4 text-sm">
            <h3 className="mb-2 text-lg font-semibold">決算ハイライト</h3>
            <p>売上高: {formatNumber(profile.financialData?.totalRevenue)}</p>
            <p>営業CF: {formatNumber(profile.financialData?.operatingCashflow)}</p>
            <p>利益率: {formatPercent((profile.financialData?.profitMargins ?? 0) * 100)}</p>
          </div>
        </div>

        <div className="space-y-4">
          <TechnicalSignals technical={technical} />
          <FundamentalsCard fundamentals={fundamentals} />
          <AIJudgment score={score} />
        </div>
      </section>

      <JudgmentForm code={code} />
    </div>
  );
}
