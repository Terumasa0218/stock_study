import { getHistorical } from '@/lib/yahoo-finance';
import { NextRequest, NextResponse } from 'next/server';

const rangeToDays = (range: string): number => {
  switch (range) {
    case '1mo':
      return 30;
    case '3mo':
      return 90;
    case '6mo':
      return 180;
    case '1y':
      return 365;
    default:
      return 180;
  }
};

export async function GET(request: NextRequest, { params }: { params: { code: string } }) {
  try {
    const range = request.nextUrl.searchParams.get('range') ?? '6mo';
    const period2 = new Date();
    const period1 = new Date(period2);
    period1.setDate(period2.getDate() - rangeToDays(range));

    const data = await getHistorical(params.code, period1, period2);
    return NextResponse.json({
      data: data.map((item) => ({
        date: item.date.toISOString().slice(0, 10),
        open: item.open ?? 0,
        high: item.high ?? 0,
        low: item.low ?? 0,
        close: item.close ?? 0,
        volume: item.volume ?? 0
      }))
    });
  } catch (error) {
    return NextResponse.json({ error: 'ヒストリカルデータ取得に失敗しました', detail: String(error) }, { status: 500 });
  }
}
