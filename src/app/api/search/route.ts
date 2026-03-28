import { searchStocks } from '@/lib/yahoo-finance';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get('q');
    if (!q) return NextResponse.json({ quotes: [] });
    const result = await searchStocks(q);
    return NextResponse.json({ quotes: result.quotes ?? [] });
  } catch (error) {
    return NextResponse.json({ error: '検索APIでエラーが発生しました', detail: String(error) }, { status: 500 });
  }
}
