
import React, { useState, useMemo } from 'react';
import { ProductionLog, Product, Employee } from '../types';
import { 
  Search, 
  Calendar, 
  User, 
  Package, 
  FileSpreadsheet, 
  Filter,
  TrendingUp,
  Cloud,
  Clock,
  ChevronDown,
  ChevronRight,
  Info,
  DollarSign,
  Tag
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ProductionInquiryProps {
  logs: ProductionLog[];
  products: Product[];
  employees: Employee[];
}

const ProductionInquiry: React.FC<ProductionInquiryProps> = ({ logs, products, employees }) => {
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [filterEmployee, setFilterEmployee] = useState('all');
  const [filterProduct, setFilterProduct] = useState('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const isWithinDate = log.date >= dateRange.start && log.date <= dateRange.end;
      const matchesEmp = filterEmployee === 'all' || log.employeeId === filterEmployee;
      const matchesProd = filterProduct === 'all' || log.productId === filterProduct;
      return isWithinDate && matchesEmp && matchesProd;
    }).sort((a, b) => b.timestamp - a.timestamp);
  }, [logs, dateRange, filterEmployee, filterProduct]);

  const stats = useMemo(() => {
    const totalQty = filteredLogs.reduce((s, l) => s + l.quantity, 0);
    const totalVal = filteredLogs.reduce((sum, l) => {
      const p = products.find(prod => prod.id === l.productId);
      return sum + (p ? p.unitPrice * l.quantity : 0);
    }, 0);
    
    const groupedByDate: Record<string, number> = {};
    filteredLogs.forEach(l => {
      groupedByDate[l.date] = (groupedByDate[l.date] || 0) + l.quantity;
    });
    
    const chartData = Object.entries(groupedByDate)
      .map(([date, qty]) => ({ date, qty }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return { totalQty, totalVal, chartData };
  }, [filteredLogs, products]);

  const handleQuickFilter = (type: 'today' | 'week' | 'month') => {
    const end = new Date().toISOString().split('T')[0];
    let start = '';
    
    if (type === 'today') {
      start = end;
    } else if (type === 'week') {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      start = d.toISOString().split('T')[0];
    } else if (type === 'month') {
      const d = new Date();
      d.setDate(1);
      start = d.toISOString().split('T')[0];
    }
    setDateRange({ start, end });
  };

  const syncToGoogleSheets = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const header = "Ngay,Nhan Vien,Mau Do Choi,So Luong,Don Gia,Thanh Tien\n";
      const csvContent = filteredLogs.map(l => {
        const emp = employees.find(e => e.id === l.employeeId)?.name || '---';
        const prod = products.find(p => p.id === l.productId);
        const val = prod ? prod.unitPrice * l.quantity : 0;
        return `${l.date},${emp},${prod?.name || '---'},${l.quantity},${prod?.unitPrice || 0},${val}`;
      }).join("\n");

      const blob = new Blob(["\uFEFF" + header + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ToyTrack_Sheets_${dateRange.start}_${dateRange.end}.csv`;
      link.click();
      
      setIsSyncing(false);
      alert("Dữ liệu đã được xuất và sẵn sàng tải lên Google Sheets!");
    }, 1500);
  };

  const toggleRow = (id: string) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Filters Section */}
      <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
              <Search size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-800 tracking-tight">Tra cứu sản lượng chi tiết</h3>
              <p className="text-sm text-gray-400 font-medium">Tìm kiếm và thống kê theo đa tiêu chí</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button onClick={() => handleQuickFilter('today')} className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95">Hôm nay</button>
            <button onClick={() => handleQuickFilter('week')} className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95">Tuần này</button>
            <button onClick={() => handleQuickFilter('month')} className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95">Tháng này</button>
            <button 
              onClick={syncToGoogleSheets}
              disabled={isSyncing}
              className={`px-5 py-2.5 ${isSyncing ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-green-600/20 active:scale-95`}
            >
              {isSyncing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Cloud size={14} />}
              {isSyncing ? 'Đang đồng bộ...' : 'Lưu vào Sheets'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Từ ngày</label>
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                type="date" 
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Đến ngày</label>
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                type="date" 
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Nhân viên</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <select 
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 bg-white transition-all outline-none appearance-none"
                value={filterEmployee}
                onChange={(e) => setFilterEmployee(e.target.value)}
              >
                <option value="all">Tất cả nhân viên</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Mẫu đồ chơi</label>
            <div className="relative group">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <select 
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 bg-white transition-all outline-none appearance-none"
                value={filterProduct}
                onChange={(e) => setFilterProduct(e.target.value)}
              >
                <option value="all">Tất cả mẫu hàng</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-indigo-600 rounded-[32px] p-8 text-white shadow-xl shadow-indigo-600/20 flex items-center justify-between border border-white/10 relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-indigo-200 text-xs font-black uppercase tracking-widest mb-1">Tổng sản lượng kỳ này</p>
            <h3 className="text-5xl font-black">{stats.totalQty.toLocaleString()} <span className="text-xl font-medium text-indigo-300">chiếc</span></h3>
          </div>
          <TrendingUp size={64} className="text-white/10 group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Tổng doanh thu gia công</p>
            <h3 className="text-5xl font-black text-gray-900">{stats.totalVal.toLocaleString()} <span className="text-xl font-medium text-gray-300">đ</span></h3>
          </div>
          <FileSpreadsheet size={64} className="text-gray-50 group-hover:rotate-12 transition-transform duration-700" />
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
        </div>
      </div>

      {/* List Section */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-white">
          <h3 className="font-black text-gray-800 uppercase tracking-widest text-xs flex items-center gap-2">
            Nhật ký sản xuất (Click để xem chi tiết)
          </h3>
          <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full uppercase tracking-tighter">{filteredLogs.length} kết quả</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-16"></th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Thời gian</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nhân viên</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">S.Lượng</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLogs.map(log => {
                const emp = employees.find(e => e.id === log.employeeId);
                const prod = products.find(p => p.id === log.productId);
                const subtotal = prod ? prod.unitPrice * log.quantity : 0;
                const isExpanded = expandedRowId === log.id;

                return (
                  <React.Fragment key={log.id}>
                    <tr 
                      onClick={() => toggleRow(log.id)}
                      className={`cursor-pointer transition-all hover:bg-indigo-50/20 group ${isExpanded ? 'bg-indigo-50/30' : ''}`}
                    >
                      <td className="px-8 py-5">
                        <ChevronRight 
                          size={18} 
                          className={`text-indigo-400 transition-transform duration-300 ${isExpanded ? 'rotate-90 text-indigo-600' : ''}`} 
                        />
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-sm font-black text-gray-900">{log.date}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(log.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-black text-xs shadow-sm group-hover:scale-110 transition-transform">
                            {emp?.name.charAt(0)}
                          </div>
                          <span className="text-sm font-bold text-gray-700">{emp?.name || '---'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-black text-right text-indigo-600 font-mono">
                        {log.quantity.toLocaleString()}
                      </td>
                      <td className="px-8 py-5 text-sm font-black text-right text-gray-900 font-mono">
                        {subtotal.toLocaleString()}đ
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-indigo-50/10 animate-in slide-in-from-top-2 duration-300">
                        <td colSpan={5} className="px-16 py-6 border-l-4 border-indigo-500">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-500 shadow-sm border border-indigo-100">
                                <Package size={20} />
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Mẫu đồ chơi</p>
                                <p className="text-sm font-black text-gray-800">{prod?.name || '---'}</p>
                                <div className="mt-2 flex items-center gap-2">
                                  <Tag size={12} className="text-gray-400" />
                                  <span className="text-[10px] font-bold text-gray-500 uppercase bg-gray-100 px-2 py-0.5 rounded-full">{prod?.category || 'Chưa phân loại'}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-green-500 shadow-sm border border-green-100">
                                <DollarSign size={20} />
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Đơn giá gia công</p>
                                <p className="text-lg font-black text-green-600 font-mono">{prod?.unitPrice.toLocaleString()}đ <span className="text-[10px] text-gray-400">/ chiếc</span></p>
                                <div className="mt-2 flex items-center gap-2">
                                  <Info size={12} className="text-gray-400" />
                                  <span className="text-[10px] font-medium text-gray-500 italic">Giá niêm yết theo danh mục mẫu hàng</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Search className="text-gray-100" size={80} />
                      <p className="text-gray-400 font-black uppercase tracking-widest text-sm italic">Không có dữ liệu phù hợp</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductionInquiry;
