import { getQuoteSummary } from '@/lib/yahoo-finance';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { code: string } }) {
  try {
    const profile = await getQuoteSummary(params.code);
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: '企業情報取得に失敗しました', detail: String(error) }, { status: 500 });
  }
}
