'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

type SearchResult = {
  symbol: string;
  shortname?: string;
  longname?: string;
  exchDisp?: string;
};

export const StockSearch = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('検索に失敗しました');
      const data = (await res.json()) as { quotes: SearchResult[] };
      setResults(data.quotes ?? []);
    } catch (error) {
      console.error(error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl rounded-xl border border-slate-700 bg-bgSecondary p-6 shadow-lg">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="証券コード or 企業名を入力"
          className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-2 outline-none focus:border-accentCyan"
        />
        <button type="submit" className="rounded-lg bg-accentBlue px-4 py-2 text-white hover:bg-blue-500">
          検索
        </button>
      </form>

      {loading && <p className="mt-3 text-sm text-slate-400">検索中...</p>}
      {results.length > 0 && (
        <ul className="mt-4 max-h-64 overflow-auto rounded-lg border border-slate-700">
          {results.map((item) => (
            <li key={item.symbol}>
              <button
                type="button"
                className="flex w-full justify-between border-b border-slate-800 px-4 py-3 text-left hover:bg-slate-800"
                onClick={() => router.push(`/stock/${item.symbol.replace('.T', '')}`)}
              >
                <span>{item.longname ?? item.shortname ?? item.symbol}</span>
                <span className="text-slate-400">{item.symbol}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
