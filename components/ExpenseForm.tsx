
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { CATEGORIES, Category, CATEGORY_ICONS } from '../types';

interface ExpenseFormProps {
  onSubmit: (expense: { 
    amount: number; 
    category: Category; 
    date: string; 
    notes: string; 
    shopName: string; 
    item: string; 
    quantity: number; 
    unitCost: number; 
  }) => void;
  onCancel: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit, onCancel }) => {
  const [shopName, setShopName] = useState('');
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unitCost, setUnitCost] = useState('');
  const [amount, setAmount] = useState('0');
  const [category, setCategory] = useState<Category>('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const q = parseFloat(quantity) || 0;
    const c = parseFloat(unitCost) || 0;
    setAmount((q * c).toFixed(2));
  }, [quantity, unitCost]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!shopName || !item || !unitCost) {
      setError('Required fields are missing');
      return;
    }

    const finalAmount = parseFloat(amount);
    if (isNaN(finalAmount) || finalAmount <= 0) {
      setError('Amount must be greater than zero');
      return;
    }
    
    onSubmit({
      amount: finalAmount,
      category,
      date,
      notes,
      shopName: shopName,
      item: item,
      quantity: parseFloat(quantity) || 1,
      unitCost: parseFloat(unitCost)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vendor / Entity Name</label>
          <input
            required
            type="text"
            placeholder="e.g. Amazon, VTU Canteen"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Purchased Item</label>
          <input
            required
            type="text"
            placeholder="e.g. Laptop, Lunch"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quantity</label>
          <input
            required
            type="number"
            step="any"
            min="0.01"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unit Price (₹)</label>
          <input
            required
            type="number"
            step="any"
            placeholder="0.00"
            value={unitCost}
            onChange={(e) => setUnitCost(e.target.value)}
            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Transaction Date</label>
          <input
            required
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
         <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Classification</label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full pl-6 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all cursor-pointer font-bold text-slate-800 appearance-none"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{CATEGORY_ICONS[cat]} {cat}</option>
              ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-blue-400 text-xs">▼</div>
          </div>
        </div>
        <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-50 flex items-center justify-between">
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Net Total:</span>
          <span className="text-3xl font-black text-blue-600">₹{parseFloat(amount).toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reference Notes</label>
        <textarea
          placeholder="Enter additional details..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all resize-none h-28 font-medium text-slate-700 placeholder:text-slate-300"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-rose-50 text-rose-500 px-6 py-4 rounded-2xl border border-rose-100 animate-shake">
          <AlertCircle className="w-4 h-4" />
          <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 flex items-center justify-center gap-2 px-8 py-5 rounded-2xl border border-slate-100 text-slate-400 font-black hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px] active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel
        </button>
        <button
          type="submit"
          className="flex-[2] flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 uppercase tracking-[0.2em] text-[10px]"
        >
          <Save className="w-5 h-5" />
          Secure Entry
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
