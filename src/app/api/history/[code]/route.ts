import { getHistory, type HistoryPeriod } from '@/lib/yahoo-finance';
import { NextRequest, NextResponse } from 'next/server';

const normalizeRange = (range: string): HistoryPeriod => {
  switch (range) {
    case '1m':
    case '1mo':
      return '1m';
    case '3m':
    case '3mo':
      return '3m';
    case '6m':
    case '6mo':
      return '6m';
    case '1y':
      return '1y';
    default:
      return '6m';
  }
};

export async function GET(request: NextRequest, { params }: { params: { code: string } }) {
  try {
    const range = normalizeRange(request.nextUrl.searchParams.get('range') ?? '6m');
    const chart = await getHistory(params.code, range);

    return NextResponse.json({
      data: (chart.quotes ?? []).map((item) => ({
        date: item.date?.toISOString().slice(0, 10) ?? '',
        open: item.open ?? 0,
        high: item.high ?? 0,
        low: item.low ?? 0,
        close: item.close ?? 0,
        volume: item.volume ?? 0
      }))
    });
  } catch (error) {
    console.error('History API error', { code: params.code, error });
    return NextResponse.json({ error: 'ヒストリカルデータ取得に失敗しました', detail: String(error) }, { status: 500 });
  }
}
