
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Expense, CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from '../types';

interface ExpenseSummaryProps {
  expenses: Expense[];
}

const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ expenses }) => {
  const chartData = useMemo(() => {
    return CATEGORIES.map(cat => {
      const total = expenses
        .filter(e => e.category === cat)
        .reduce((sum, e) => sum + e.amount, 0);
      return {
        name: cat,
        amount: total,
        color: CATEGORY_COLORS[cat]
      };
    }).filter(d => d.amount > 0);
  }, [expenses]);

  return (
    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Category Analytics</h3>
      </div>
      
      {chartData.length > 0 ? (
        <div className="h-64 w-full mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: -10, right: 30, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={80} 
                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 900 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '15px' }}
                itemStyle={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Total Spent']}
              />
              <Bar dataKey="amount" radius={[0, 10, 10, 0]} barSize={28}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center text-slate-300 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
          <p className="text-[10px] font-black uppercase tracking-widest">No activity recorded</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {chartData.map((data) => (
          <div key={data.name} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-white shadow-sm transition-transform hover:scale-[1.02]">
            <div className="flex items-center gap-3">
              <span className="text-xl bg-white w-10 h-10 flex items-center justify-center rounded-xl shadow-sm">
                {CATEGORY_ICONS[data.name as keyof typeof CATEGORY_ICONS]}
              </span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{data.name}</span>
            </div>
            <span className="text-sm font-black text-slate-900">₹{data.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseSummary;
