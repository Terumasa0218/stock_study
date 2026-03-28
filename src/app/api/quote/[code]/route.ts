import { getQuote } from '@/lib/yahoo-finance';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { code: string } }) {
  try {
    const quote = await getQuote(params.code);
    return NextResponse.json(quote);
  } catch (error) {
    console.error('Quote API error', { code: params.code, error });
    return NextResponse.json({ error: '株価取得に失敗しました', detail: String(error) }, { status: 500 });
  }
}
