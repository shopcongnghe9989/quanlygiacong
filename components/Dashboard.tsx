
import React, { useMemo, useState } from 'react';
import { ProductionLog, Product, Employee, ViewType } from '../types';
import { TrendingUp, Package, Users, DollarSign, Database, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  logs: ProductionLog[];
  products: Product[];
  employees: Employee[];
  onNavigate: (view: ViewType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ logs, products, employees, onNavigate }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayLogs = logs.filter(l => l.date === today);
    
    const totalQuantity = todayLogs.reduce((sum, l) => sum + l.quantity, 0);
    const totalValue = todayLogs.reduce((sum, l) => {
      const p = products.find(prod => prod.id === l.productId);
      return sum + (p ? p.unitPrice * l.quantity : 0);
    }, 0);

    return {
      todayQuantity: totalQuantity,
      todayValue: totalValue,
      totalEmployees: employees.length,
      activeProducts: products.length
    };
  }, [logs, products, employees]);

  const chartData = useMemo(() => {
    return products.map(p => ({
      name: p.name,
      value: logs.filter(l => l.productId === p.id).reduce((sum, l) => sum + l.quantity, 0)
    })).filter(d => d.value > 0).sort((a, b) => b.value - a.value).slice(0, 5);
  }, [logs, products]);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b'];

  const generateDemoData = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const demoEmployees: Employee[] = [
        { id: 'e1', name: 'Nguyễn Văn Hùng', role: 'Thợ may chính' },
        { id: 'e2', name: 'Trần Thị Mai', role: 'Thợ hoàn thiện' },
        { id: 'e3', name: 'Lê Văn Nam', role: 'Kiểm hàng QC' },
        { id: 'e4', name: 'Phạm Minh Tuấn', role: 'Đóng gói' }
      ];

      const demoProducts: Product[] = [
        { id: 'p1', name: 'Gấu bông Teddy King', unitPrice: 15000, category: 'Đồ chơi vải', createdAt: Date.now() },
        { id: 'p2', name: 'Búp bê vải Handmade', unitPrice: 18000, category: 'Đồ chơi vải', createdAt: Date.now() },
        { id: 'p3', name: 'Robot gỗ lắp ghép', unitPrice: 35000, category: 'Đồ chơi gỗ', createdAt: Date.now() },
        { id: 'p4', name: 'Ô tô đua sạc pin', unitPrice: 12000, category: 'Đồ chơi nhựa', createdAt: Date.now() },
        { id: 'p5', name: 'Xếp hình thông minh', unitPrice: 22000, category: 'Đồ chơi nhựa', createdAt: Date.now() }
      ];

      const demoLogs: ProductionLog[] = [];
      const today = new Date();
      
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        demoEmployees.forEach(emp => {
          const numProds = 2 + Math.floor(Math.random() * 2);
          for (let j = 0; j < numProds; j++) {
            const randomProd = demoProducts[Math.floor(Math.random() * demoProducts.length)];
            demoLogs.push({
              id: `log-${dateStr}-${emp.id}-${j}`,
              productId: randomProd.id,
              employeeId: emp.id,
              quantity: 20 + Math.floor(Math.random() * 50),
              date: dateStr,
              timestamp: date.getTime() + (j * 3600000)
            });
          }
        });
      }

      localStorage.setItem('employees', JSON.stringify(demoEmployees));
      localStorage.setItem('products', JSON.stringify(demoProducts));
      localStorage.setItem('logs', JSON.stringify(demoLogs));
      
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header with Demo Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Tổng quan hệ thống</h2>
          <p className="text-sm text-gray-400 font-medium">Báo cáo hiệu suất sản xuất thời gian thực</p>
        </div>
        <button 
          onClick={generateDemoData}
          disabled={isGenerating}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-indigo-100 text-indigo-600 rounded-2xl font-bold text-sm shadow-sm hover:shadow-md hover:bg-indigo-50 transition-all active:scale-95 disabled:opacity-50"
        >
          {isGenerating ? <RefreshCw size={18} className="animate-spin" /> : <Database size={18} />}
          {isGenerating ? 'Đang khởi tạo...' : 'Nạp dữ liệu mẫu Demo'}
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 group hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
            <Package size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Đồ chơi hôm nay</p>
            <h4 className="text-2xl font-black text-gray-900">{stats.todayQuantity.toLocaleString()}</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 group hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Giá trị gia công</p>
            <h4 className="text-2xl font-black text-gray-900">{stats.todayValue.toLocaleString()} đ</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 group hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Nhân sự xưởng</p>
            <h4 className="text-2xl font-black text-gray-900">{stats.totalEmployees} người</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 group hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Mẫu đồ chơi</p>
            <h4 className="text-2xl font-black text-gray-900">{stats.activeProducts} mã</h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-8 flex items-center gap-2">
            <Package size={20} className="text-indigo-600" /> 
            Top 5 Đồ chơi đạt sản lượng cao
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 500, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc', radius: 12 }}
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '12px 16px' }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-8 flex items-center gap-2">
            <Users size={20} className="text-indigo-600" />
            Nhân viên tích cực nhất
          </h3>
          <div className="space-y-5">
            {employees.map(e => ({
              ...e,
              total: logs.filter(l => l.employeeId === e.id).reduce((s, l) => s + l.quantity, 0)
            })).sort((a, b) => b.total - a.total).slice(0, 5).map((emp, i) => (
              <div key={emp.id} className="flex items-center justify-between group p-2 hover:bg-gray-50 rounded-2xl transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-md bg-gradient-to-br from-indigo-500 to-purple-500`}>
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{emp.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{emp.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-black text-gray-900">{emp.total.toLocaleString()}</p>
                  <p className="text-[9px] text-indigo-500 font-black uppercase tracking-widest">chiếc</p>
                </div>
              </div>
            ))}
            {employees.length === 0 && (
              <div className="py-20 text-center">
                <Users className="mx-auto text-gray-100 mb-4" size={48} />
                <p className="text-gray-400 font-medium italic">Chưa có dữ liệu nhân viên</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
