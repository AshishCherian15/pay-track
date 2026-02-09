
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Filter, Receipt, CreditCard, Calendar as CalendarIcon, LogOut, User as UserIcon, ArrowLeft } from 'lucide-react';
import { Expense, Category, CATEGORIES, User } from './types';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import ReceiptModal from './components/ReceiptModal';
import AuthPage from './components/AuthPage';

const SAMPLE_DATA: Omit<Expense, 'id' | 'createdAt' | 'billId' | 'userId'>[] = [
  { category: 'Food', amount: 250, notes: 'Lunch at canteen', shopName: 'VTU Canteen', item: 'Rice Plate', quantity: 1, unitCost: 250, date: '2026-02-02' },
  { category: 'Travel', amount: 120, notes: 'Bus ticket', shopName: 'KSRTC Counter', item: 'Bus Ticket', quantity: 1, unitCost: 120, date: '2026-02-03' },
  { category: 'Bills', amount: 800, notes: 'Electricity bill', shopName: 'BESCOM Office', item: 'Electricity Units', quantity: 80, unitCost: 10, date: '2026-02-04' },
  { category: 'Shopping', amount: 1500, notes: 'Books & stationery', shopName: 'Sapna Book House', item: 'Engineering Books', quantity: 3, unitCost: 500, date: '2026-02-05' },
  { category: 'Food', amount: 300, notes: 'Dinner with friends', shopName: 'Café Coffee Day', item: 'Combo Meal', quantity: 2, unitCost: 150, date: '2026-02-06' },
  { category: 'Travel', amount: 200, notes: 'Cab fare', shopName: 'Ola Cabs', item: 'Ride Fare', quantity: 1, unitCost: 200, date: '2026-02-07' },
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [dateRange, setDateRange] = useState({ start: '2026-02-01', end: '2026-02-28' });
  const [selectedReceipt, setSelectedReceipt] = useState<Expense | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('paytrack_session');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const saved = localStorage.getItem(`paytrack_expenses_${currentUser.username}`);
    if (saved) {
      setExpenses(JSON.parse(saved));
    } else {
      const initial = SAMPLE_DATA.map((item, idx) => ({
        ...item,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: Date.now() - (idx * 100000),
        billId: `PT-2026-${String(idx + 1).padStart(3, '0')}`,
        userId: currentUser.username
      }));
      setExpenses(initial);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`paytrack_expenses_${currentUser.username}`, JSON.stringify(expenses));
    }
  }, [expenses, currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('paytrack_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setExpenses([]);
    localStorage.removeItem('paytrack_session');
  };

  const addExpense = (expenseData: Omit<Expense, 'id' | 'createdAt' | 'billId' | 'userId'>) => {
    if (!currentUser) return;
    const year = new Date(expenseData.date).getFullYear();
    const newExpense: Expense = {
      ...expenseData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      billId: `PT-${year}-${String(expenses.length + 1).padStart(3, '0')}`,
      userId: currentUser.username
    };
    setExpenses(prev => [newExpense, ...prev]);
    setIsFormOpen(false);
  };

  const deleteExpense = (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this entry?")) {
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const catMatch = activeCategory === 'All' || e.category === activeCategory;
      const dateMatch = (!dateRange.start || e.date >= dateRange.start) && 
                        (!dateRange.end || e.date <= dateRange.end);
      return catMatch && dateMatch;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [expenses, activeCategory, dateRange]);

  const totalAmount = useMemo(() => filteredExpenses.reduce((sum, e) => sum + e.amount, 0), [filteredExpenses]);

  if (!currentUser) return <AuthPage onLogin={handleLogin} />;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-50 sticky top-0 z-40 no-print shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg">
              <CreditCard className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-blue-900 tracking-tighter">Pay Track</h1>
              <div className="flex items-center gap-1 opacity-60">
                <UserIcon className="w-2.5 h-2.5 text-blue-400" />
                <p className="text-[10px] font-black uppercase text-blue-400">{currentUser.name}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleLogout} className="p-3 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-2xl transition-all" title="Sign Out">
              <LogOut className="w-5 h-5" />
            </button>
            <button onClick={() => setIsFormOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-xl shadow-blue-100 transition-all active:scale-95">
              <Plus className="w-4 h-4" /> Add Entry
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 flex-grow w-full no-print">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-3xl transition-transform group-hover:scale-110"></div>
              <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Total Spent</p>
              <h2 className="text-6xl font-black tracking-tighter">₹{totalAmount.toLocaleString()}</h2>
            </div>
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <CalendarIcon className="w-4 h-4 text-blue-600" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date Filtering</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[8px] font-bold text-slate-300 uppercase ml-1">From</span>
                  <input type="date" value={dateRange.start} onChange={e => setDateRange(prev => ({...prev, start: e.target.value}))} className="w-full text-xs font-bold p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-bold text-slate-300 uppercase ml-1">To</span>
                  <input type="date" value={dateRange.end} onChange={e => setDateRange(prev => ({...prev, end: e.target.value}))} className="w-full text-xs font-bold p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
              </div>
            </div>
            <ExpenseSummary expenses={filteredExpenses} />
          </div>

          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide px-1">
              <button 
                onClick={() => setActiveCategory('All')} 
                className={`px-7 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === 'All' ? 'bg-blue-900 text-white shadow-lg shadow-blue-100' : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'}`}
              >
                All Records
              </button>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)} 
                  className={`px-7 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <ExpenseList 
              expenses={filteredExpenses} 
              onDelete={deleteExpense} 
              onViewReceipt={setSelectedReceipt} 
            />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-100 py-16 no-print mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-6">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Pay Track Prototype v1.0.4</p>
          </div>
          <div className="text-sm font-medium text-slate-500 space-y-2 mb-10">
             <p className="text-lg text-slate-900 font-black tracking-tight">Owned & Developed by Ashish Cherian</p>
             <p className="text-xs">Professional Software Architecture Portfolio Project</p>
             <div className="pt-2 flex justify-center gap-6">
               <a href="https://github.com/AshishCherian15" target="_blank" className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">GitHub Repository</a>
               <a href="https://www.linkedin.com/in/ashish-cherian-158b49356" target="_blank" className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">LinkedIn Profile</a>
             </div>
          </div>
          <div className="h-px bg-slate-50 w-24 mx-auto mb-10"></div>
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.6em]">&copy; 2026 ASHISH CHERIAN. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200">
            <div className="p-8 border-b border-slate-50 flex items-center gap-4">
              <button onClick={() => setIsFormOpen(false)} className="bg-blue-50 text-blue-600 p-2.5 rounded-xl hover:bg-blue-100 transition-all active:scale-90" title="Return to Dashboard">
                <ArrowLeft className="w-5 h-5"/>
              </button>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Record Entry</h2>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">Populate transaction metadata</p>
              </div>
            </div>
            <div className="p-10 max-h-[75vh] overflow-y-auto scrollbar-hide">
              <ExpenseForm onSubmit={addExpense} onCancel={() => setIsFormOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {selectedReceipt && (
        <ReceiptModal expense={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
      )}
    </div>
  );
};

export default App;
