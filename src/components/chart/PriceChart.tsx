'use client';

import { PricePoint } from '@/types/stock';
import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type Props = {
  data: PricePoint[];
};

export const PriceChart = ({ data }: Props) => {
  return (
    <div className="h-80 rounded-xl border border-slate-700 bg-bgSecondary p-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis yAxisId="left" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64748b', fontSize: 10 }} />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="close" stroke="#3b82f6" dot={false} name="終値" />
          <Bar yAxisId="right" dataKey="volume" fill="#06b6d4" name="出来高" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
