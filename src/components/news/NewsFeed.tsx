type NewsItem = { title: string; publisher?: string; link: string; providerPublishTime?: number };

type Props = { news: NewsItem[] };

export const NewsFeed = ({ news }: Props) => {
  return (
    <div className="rounded-xl border border-slate-700 bg-bgSecondary p-4">
      <h3 className="mb-3 text-lg font-semibold">ニュース</h3>
      <ul className="space-y-2 text-sm">
        {news.slice(0, 6).map((item) => (
          <li key={item.link} className="rounded bg-slate-900 p-3">
            <a href={item.link} target="_blank" rel="noreferrer" className="font-medium text-accentCyan hover:underline">
              {item.title}
            </a>
            <p className="text-slate-400">{item.publisher}</p>
          </li>
        ))}
        {news.length === 0 && <li className="text-slate-400">ニュースが見つかりませんでした。</li>}
      </ul>
    </div>
  );
};
