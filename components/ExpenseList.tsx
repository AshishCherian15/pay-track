
import React from 'react';
import { Trash2, Receipt, Calendar, CreditCard } from 'lucide-react';
import { Expense, CATEGORY_COLORS, CATEGORY_ICONS } from '../types';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onViewReceipt: (expense: Expense) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete, onViewReceipt }) => {
  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-slate-100">
        <div className="bg-blue-50 w-28 h-28 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
          <CreditCard className="text-blue-200 w-12 h-12" />
        </div>
        <h4 className="text-slate-900 text-3xl font-black mb-3 tracking-tighter">Empty Timeline</h4>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">No logs found in this category</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {expenses.map((expense) => (
        <div 
          key={expense.id} 
          className="group bg-white rounded-[2.5rem] p-7 border border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div className="flex items-center gap-7">
            <div 
              className="w-16 h-16 rounded-[1.8rem] flex items-center justify-center text-3xl shadow-sm transition-transform animate-icon-hover flex-shrink-0"
              style={{ backgroundColor: `${CATEGORY_COLORS[expense.category]}15`, border: `1px solid ${CATEGORY_COLORS[expense.category]}30` }}
            >
              {CATEGORY_ICONS[expense.category]}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                <span className="font-black text-slate-900 text-3xl tracking-tighter">₹{expense.amount.toFixed(0)}</span>
                <span className="text-[10px] px-4 py-1.5 rounded-full bg-slate-50 text-slate-500 font-black uppercase tracking-widest border border-slate-100">
                  {expense.category}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-black text-blue-600">{expense.shopName}</span>
                <span className="text-slate-200 font-bold">•</span>
                <span className="text-sm font-bold text-slate-500">{expense.item}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-300 font-black uppercase tracking-widest">
                <Calendar className="w-4 h-4 text-blue-300" />
                {new Date(expense.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                <span className="text-slate-100 mx-2">|</span>
                <span className="font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">{expense.billId}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto self-end sm:self-center">
            <button 
              onClick={() => onViewReceipt(expense)}
              className="flex-1 sm:flex-none p-4 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-2xl transition-all shadow-sm hover:shadow-blue-100 active:scale-90"
              title="Generate Bill"
            >
              <Receipt className="w-6 h-6" />
            </button>
            <button 
              onClick={() => onDelete(expense.id)}
              className="flex-1 sm:flex-none p-4 text-rose-500 bg-rose-50 hover:bg-rose-500 hover:text-white rounded-2xl transition-all shadow-sm hover:shadow-rose-100 active:scale-90"
              title="Delete Entry"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;
