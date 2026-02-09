
export type Category = 'Food' | 'Travel' | 'Bills' | 'Shopping' | 'Others';

export interface User {
  username: string;
  name: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  date: string;
  notes: string;
  shopName: string;
  item: string;
  quantity: number;
  unitCost: number;
  createdAt: number;
  billId: string;
  userId: string;
}

export const CATEGORIES: Category[] = [
  'Food',
  'Travel',
  'Bills',
  'Shopping',
  'Others'
];

export const CATEGORY_ICONS: Record<Category, string> = {
  Food: '🍔',
  Travel: '🚌',
  Bills: '💡',
  Shopping: '🛍️',
  Others: '📦'
};

export const CATEGORY_COLORS: Record<Category, string> = {
  Food: '#3b82f6',
  Travel: '#2563eb',
  Bills: '#1d4ed8',
  Shopping: '#60a5fa',
  Others: '#94a3b8'
};
