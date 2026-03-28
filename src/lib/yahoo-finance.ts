import yahooFinance from 'yahoo-finance2';

export type HistoryPeriod = '1m' | '3m' | '6m' | '1y';

export const formatCode = (code: string): string => {
  const normalized = code.trim().toUpperCase();
  if (/^\d{4}$/.test(normalized) && !normalized.endsWith('.T')) {
    return `${normalized}.T`;
  }
  return normalized;
};

const getPeriod1 = (period: HistoryPeriod): Date => {
  const now = new Date();
  const period1 = new Date(now);

  switch (period) {
    case '1m':
      period1.setMonth(now.getMonth() - 1);
      break;
    case '3m':
      period1.setMonth(now.getMonth() - 3);
      break;
    case '6m':
      period1.setMonth(now.getMonth() - 6);
      break;
    case '1y':
      period1.setFullYear(now.getFullYear() - 1);
      break;
    default:
      period1.setMonth(now.getMonth() - 6);
  }

  return period1;
};

export const searchStocks = async (query: string) => {
  try {
    return await yahooFinance.search(query, {
      quotesCount: 10,
      newsCount: 0,
      enableFuzzyQuery: true
    });
  } catch (error) {
    console.error('yahooFinance.search failed', { query, error });
    throw error;
  }
};

export const getQuote = async (code: string) => {
  const symbol = formatCode(code);
  try {
    return await yahooFinance.quote(symbol);
  } catch (error) {
    console.error('yahooFinance.quote failed', { code, symbol, error });
    throw error;
  }
};

export const getHistory = async (code: string, period: HistoryPeriod) => {
  const symbol = formatCode(code);
  const period1 = getPeriod1(period);
  const period2 = new Date();

  try {
    return await yahooFinance.chart(symbol, {
      period1,
      period2,
      interval: '1d'
    });
  } catch (error) {
    console.error('yahooFinance.chart failed', { code, symbol, period, error });
    throw error;
  }
};

export const getProfile = async (code: string) => {
  const symbol = formatCode(code);
  try {
    return await yahooFinance.quoteSummary(symbol, {
      modules: ['price', 'summaryDetail', 'financialData', 'defaultKeyStatistics', 'earnings']
    });
  } catch (error) {
    console.error('yahooFinance.quoteSummary failed', { code, symbol, error });
    throw error;
  }
};
