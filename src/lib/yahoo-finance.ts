import yahooFinance from 'yahoo-finance2';

const addTokyoSuffix = (code: string): string => {
  if (/^\d{4}$/.test(code) && !code.endsWith('.T')) {
    return `${code}.T`;
  }
  return code;
};

export const normalizeSymbol = (code: string): string => addTokyoSuffix(code.trim().toUpperCase());

export const searchStocks = async (query: string) => {
  return yahooFinance.search(query, {
    quotesCount: 10,
    newsCount: 0,
    enableFuzzyQuery: true
  });
};

export const getQuote = async (code: string) => {
  return yahooFinance.quote(normalizeSymbol(code));
};

export const getHistorical = async (code: string, period1: Date, period2: Date) => {
  return yahooFinance.historical(normalizeSymbol(code), {
    period1,
    period2,
    interval: '1d'
  });
};

export const getQuoteSummary = async (code: string) => {
  return yahooFinance.quoteSummary(normalizeSymbol(code), {
    modules: ['price', 'summaryDetail', 'defaultKeyStatistics', 'financialData', 'assetProfile']
  });
};
