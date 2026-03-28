import { StockSearch } from '@/components/search/StockSearch';

export default function HomePage() {
  return (
    <section className="space-y-6 text-center">
      <h2 className="text-3xl font-bold">StockLens</h2>
      <p className="text-slate-300">正しい知識で、自分で判断できる投資家になる</p>
      <StockSearch />
    </section>
  );
}
