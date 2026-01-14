
export interface Product {
  id: string;
  name: string;
  unitPrice: number;
  category: string;
  createdAt: number;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
}

export interface ProductionLog {
  id: string;
  productId: string;
  employeeId: string;
  quantity: number;
  date: string; // ISO string (YYYY-MM-DD)
  timestamp: number;
}

export type ViewType = 'dashboard' | 'products' | 'production' | 'reports' | 'employees' | 'salary' | 'inquiry';

export interface DailySummary {
  date: string;
  totalQuantity: number;
  totalValue: number;
  logsCount: number;
}
