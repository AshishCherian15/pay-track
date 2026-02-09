
import React from 'react';
import { X, Printer, ArrowLeft } from 'lucide-react';
import { Expense, CATEGORY_ICONS } from '../types';

interface ReceiptModalProps {
  expense: Expense;
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ expense, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xl no-print animate-in fade-in duration-200">
      <div className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-md flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="bg-blue-50 text-blue-600 p-2.5 rounded-xl hover:bg-blue-100 transition-all active:scale-90" title="Close Preview">
              <ArrowLeft className="w-5 h-5"/>
            </button>
            <h3 className="font-black text-slate-900 text-xl tracking-tighter uppercase">Bill View</h3>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-600 p-2"><X className="w-6 h-6"/></button>
        </div>
        
        <div className="p-8 sm:p-10 overflow-y-auto scrollbar-hide flex-grow">
          <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 text-center relative overflow-hidden shadow-inner">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-600"></div>
            
            <h4 className="font-black text-3xl text-blue-900 mb-1 tracking-tighter">PAY TRACK</h4>
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-blue-400 mb-10 opacity-80">Official Transaction Certificate</p>
            
            <div className="space-y-6 text-left">
              <div className="border-b border-dashed border-slate-300 pb-4 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Serial Number</span>
                <span className="font-mono font-black text-xs text-slate-800 bg-white px-2 py-1 rounded-md border border-slate-100">{expense.billId}</span>
              </div>
              <div className="border-b border-dashed border-slate-300 pb-4 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Timestamp</span>
                <span className="font-bold text-xs text-slate-700">{expense.date}</span>
              </div>
              <div className="border-b border-dashed border-slate-300 pb-4 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Vendor Entity</span>
                <span className="font-black text-xs text-blue-600">{expense.shopName}</span>
              </div>
              <div className="border-b border-dashed border-slate-300 pb-4 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Commodity</span>
                <span className="font-bold text-xs text-slate-700">{expense.item}</span>
              </div>
              <div className="border-b border-dashed border-slate-300 pb-4 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Classification</span>
                <span className="text-xs font-bold text-slate-600">{CATEGORY_ICONS[expense.category]} {expense.category}</span>
              </div>
              <div className="border-b border-dashed border-slate-300 pb-4 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Unit Breakdown</span>
                <span className="font-bold text-xs text-slate-700">{expense.quantity} Units × ₹{expense.unitCost.toLocaleString()}</span>
              </div>
              
              <div className="pt-8 flex flex-col items-center">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-2">Total Settled Amount</span>
                <div className="flex items-baseline gap-1 animate-pulse">
                  <span className="text-2xl font-bold text-blue-400">₹</span>
                  <span className="text-6xl font-black text-blue-700 tracking-tighter">{expense.amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-200">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Authenticated Ledger Entry</p>
               <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Developed by Ashish Cherian</p>
            </div>
          </div>
        </div>
        
        <div className="p-8 sm:px-10 sm:pb-12 pt-4 shrink-0">
          <button 
            onClick={() => window.print()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-6 rounded-[2rem] uppercase text-[11px] tracking-widest shadow-2xl shadow-blue-200 transition-all flex items-center justify-center gap-4 active:scale-95"
          >
            <Printer className="w-5 h-5"/> Export & Print ₹{expense.amount.toLocaleString()} Receipt
          </button>
        </div>
      </div>

      {/* Print only template */}
      <div className="print-only fixed inset-0 bg-white p-20 font-mono text-black">
        <div className="border-[8px] border-black p-16 max-w-2xl mx-auto">
          <div className="text-center mb-16 border-b-4 border-black pb-10">
            <h1 className="text-6xl font-black mb-2 tracking-tighter">PAY TRACK</h1>
            <p className="text-xl font-black uppercase tracking-[0.5em]">Payment Confirmation</p>
            <p className="text-sm mt-4 font-bold opacity-60 italic">Owner & Developer: Ashish Cherian</p>
          </div>
          
          <div className="space-y-8 text-2xl">
            <div className="flex justify-between border-b-2 border-black pb-2"><span>BILL ID:</span> <strong>{expense.billId}</strong></div>
            <div className="flex justify-between border-b-2 border-black pb-2"><span>TIMESTAMP:</span> <strong>{expense.date}</strong></div>
            <div className="flex justify-between border-b-2 border-black pb-2"><span>VENDOR:</span> <strong>{expense.shopName}</strong></div>
            <div className="flex justify-between border-b-2 border-black pb-2"><span>ITEM:</span> <strong>{expense.item}</strong></div>
            <div className="flex justify-between border-b-2 border-black pb-2"><span>QUANTITY:</span> <strong>{expense.quantity} Units</strong></div>
            <div className="flex justify-between border-b-2 border-black pb-2"><span>UNIT RATE:</span> <strong>₹{expense.unitCost.toLocaleString()}</strong></div>
            <div className="flex justify-between border-b-2 border-black pb-2"><span>CATEGORY:</span> <strong>{expense.category.toUpperCase()}</strong></div>
            
            <div className="pt-16 flex justify-between items-baseline border-t-[10px] border-black mt-10">
              <span className="text-5xl font-black">NET TOTAL:</span>
              <span className="text-8xl font-black">₹{expense.amount.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-32 text-center border-t-2 border-black pt-10">
            <p className="text-lg font-black uppercase tracking-[0.2em] mb-4">Verification Stamp • Certified Ledger</p>
            <div className="h-20 w-full bg-black mb-10"></div>
            <p className="text-sm font-bold opacity-50">&copy; 2026 Pay Track System | Ashish Cherian Projects</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
