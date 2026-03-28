import { formatNumber } from '@/utils/format';

type Props = { score: number };

export const AIJudgment = ({ score }: Props) => {
  const label = score > 0.3 ? '買いの可能性が高い' : score < -0.3 ? '売りの可能性が高い' : '様子見';

  return (
    <div className="rounded-xl border border-slate-700 bg-bgSecondary p-4">
      <h3 className="mb-3 text-lg font-semibold">AI総合判断</h3>
      <div className="mb-3 h-3 w-full rounded-full bg-slate-800">
        <div
          className="h-3 rounded-full bg-accentCyan"
          style={{ width: `${((score + 1) / 2) * 100}%` }}
        />
      </div>
      <p className="font-semibold">スコア: {formatNumber(score, 3)} / 判断: {label}</p>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-slate-300">
        <li>テクニカルとファンダメンタルズの重み付けスコアを統合。</li>
        <li>ニュース評価はPhase 1では0として計算。</li>
        <li>指標が中立の場合は判断を抑制。</li>
      </ul>
      <p className="mt-3 text-xs text-slate-400">※これは参考情報です。投資判断は自己責任で行ってください。</p>
    </div>
  );
};
