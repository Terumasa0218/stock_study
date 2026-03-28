'use client';

import { useState } from 'react';

type Action = 'buy' | 'sell' | 'wait';

type Props = { code: string };

export const JudgmentForm = ({ code }: Props) => {
  const [action, setAction] = useState<Action>('wait');
  const [memo, setMemo] = useState('');
  const [saved, setSaved] = useState(false);

  const save = () => {
    const key = `stocklens:journal:${code}`;
    const payload = {
      action,
      memo,
      code,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(payload));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="rounded-xl border border-slate-700 bg-bgSecondary p-4">
      <h3 className="mb-3 text-lg font-semibold">判断記録</h3>
      <div className="mb-3 flex gap-2">
        <button onClick={() => setAction('buy')} className={`rounded px-3 py-2 ${action === 'buy' ? 'bg-signalBuy' : 'bg-slate-800'}`}>買う</button>
        <button onClick={() => setAction('sell')} className={`rounded px-3 py-2 ${action === 'sell' ? 'bg-signalSell' : 'bg-slate-800'}`}>売る</button>
        <button onClick={() => setAction('wait')} className={`rounded px-3 py-2 ${action === 'wait' ? 'bg-signalNeutral' : 'bg-slate-800'}`}>待つ</button>
      </div>
      <textarea
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="判断理由をメモ"
        className="h-24 w-full rounded border border-slate-600 bg-slate-900 p-2"
      />
      <button onClick={save} className="mt-3 rounded bg-accentBlue px-4 py-2">記録する</button>
      {saved && <p className="mt-2 text-sm text-signalBuy">保存しました。</p>}
    </div>
  );
};
