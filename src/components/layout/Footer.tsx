export const Footer = () => {
  return (
    <footer className="mt-8 border-t border-slate-800 px-6 py-4 text-xs text-slate-400">
      <div className="mx-auto flex w-full max-w-7xl justify-between gap-4">
        <span>© {new Date().getFullYear()} StockLens</span>
        <span>※投資判断は自己責任で行ってください。</span>
      </div>
    </footer>
  );
};
