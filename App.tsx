
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  BarChart, 
  Users, 
  Wallet,
  Menu,
  X,
  Search
} from 'lucide-react';
import { Product, Employee, ProductionLog, ViewType } from './types';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import ProductionEntry from './components/ProductionEntry';
import ReportView from './components/ReportView';
import EmployeeList from './components/EmployeeList';
import SalaryReport from './components/SalaryReport';
import ProductionInquiry from './components/ProductionInquiry';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('products');
      return saved ? JSON.parse(saved) : [
        { id: 'p1', name: 'Gấu bông Teddy 30cm', unitPrice: 12000, category: 'Đồ chơi vải', createdAt: Date.now() },
        { id: 'p2', name: 'Bộ xếp hình gỗ 20 khối', unitPrice: 25000, category: 'Đồ chơi gỗ', createdAt: Date.now() },
        { id: 'p3', name: 'Ô tô nhựa mini', unitPrice: 8000, category: 'Đồ chơi nhựa', createdAt: Date.now() }
      ];
    } catch (e) {
      return [];
    }
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const saved = localStorage.getItem('employees');
      return saved ? JSON.parse(saved) : [
        { id: 'e1', name: 'Nguyễn Văn A', role: 'Thợ may nhồi bông' },
        { id: 'e2', name: 'Trần Thị B', role: 'Thợ hoàn thiện gỗ' }
      ];
    } catch (e) {
      return [];
    }
  });

  const [logs, setLogs] = useState<ProductionLog[]>(() => {
    try {
      const saved = localStorage.getItem('logs');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('employees', JSON.stringify(employees));
    localStorage.setItem('logs', JSON.stringify(logs));
  }, [products, employees, logs]);

  const navItems = [
    { id: 'dashboard', label: 'Thống kê tổng quan', icon: LayoutDashboard },
    { id: 'production', label: 'Ghi nhận sản lượng', icon: ClipboardList },
    { id: 'inquiry', label: 'Tra cứu sản lượng', icon: Search },
    { id: 'products', label: 'Danh mục đồ chơi', icon: Package },
    { id: 'employees', label: 'Quản lý nhân sự', icon: Users },
    { id: 'salary', label: 'Tính lương sản phẩm', icon: Wallet },
    { id: 'reports', label: 'Báo cáo ngày', icon: BarChart },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <aside className={`bg-slate-900 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} hidden md:flex flex-col shadow-xl`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/30">T</div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight">ToyTrack</span>}
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ViewType)}
              className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all ${
                activeView === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full flex items-center justify-center p-2 hover:bg-slate-800 rounded-lg transition-colors">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-20 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-600" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-800">
              {navItems.find(i => i.id === activeView)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">Quản lý xưởng đồ chơi</p>
              <p className="text-xs text-indigo-500 font-medium">{new Date().toLocaleDateString('vi-VN')}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg flex items-center justify-center text-white font-bold">
              TOY
            </div>
          </div>
        </header>

        <div className="p-6 max-w-7xl mx-auto">
          {activeView === 'dashboard' && (
            <Dashboard logs={logs} products={products} employees={employees} onNavigate={setActiveView} />
          )}
          {activeView === 'products' && (
            <ProductList products={products} setProducts={setProducts} />
          )}
          {activeView === 'production' && (
            <ProductionEntry 
              logs={logs} 
              setLogs={setLogs} 
              products={products} 
              employees={employees} 
            />
          )}
          {activeView === 'inquiry' && (
            <ProductionInquiry 
              logs={logs} 
              products={products} 
              employees={employees} 
            />
          )}
          {activeView === 'employees' && (
            <EmployeeList employees={employees} setEmployees={setEmployees} />
          )}
          {activeView === 'salary' && (
            <SalaryReport logs={logs} products={products} employees={employees} />
          )}
          {activeView === 'reports' && (
            <ReportView logs={logs} products={products} employees={employees} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
