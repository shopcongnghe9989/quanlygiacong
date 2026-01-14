
import React, { useMemo, useState } from 'react';
import { ProductionLog, Product, Employee } from '../types';
import { Wallet, Calendar, Download, Search, ChevronRight, TrendingUp } from 'lucide-react';

interface SalaryReportProps {
  logs: ProductionLog[];
  products: Product[];
  employees: Employee[];
}

const SalaryReport: React.FC<SalaryReportProps> = ({ logs, products, employees }) => {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(1); // First of month
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const salaryData = useMemo(() => {
    return employees.map(emp => {
      // Filter logs for this employee within date range
      const empLogs = logs.filter(l => 
        l.employeeId === emp.id && 
        l.date >= startDate && 
        l.date <= endDate
      );

      // Group by product to see details
      const productionDetails = products.map(p => {
        const qty = empLogs
          .filter(l => l.productId === p.id)
          .reduce((sum, l) => sum + l.quantity, 0);
        return {
          productName: p.name,
          unitPrice: p.unitPrice,
          quantity: qty,
          subtotal: qty * p.unitPrice
        };
      }).filter(d => d.quantity > 0);

      const totalQuantity = productionDetails.reduce((sum, d) => sum + d.quantity, 0);
      const totalSalary = productionDetails.reduce((sum, d) => sum + d.subtotal, 0);

      return {
        ...emp,
        totalQuantity,
        totalSalary,
        details: productionDetails
      };
    })
    .filter(emp => emp.totalQuantity > 0 || searchTerm === '')
    .filter(emp => emp.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => b.totalSalary - a.totalSalary);
  }, [logs, products, employees, startDate, endDate, searchTerm]);

  const grandTotalSalary = salaryData.reduce((sum, e) => sum + e.totalSalary, 0);

  return (
    <div className="space-y-6">
      {/* Filters Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-6 items-end">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
              <Calendar size={14} /> Từ ngày
            </label>
            <input 
              type="date" 
              className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
              <Calendar size={14} /> Đến ngày
            </label>
            <input 
              type="date" 
              className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
            <Search size={14} /> Tìm nhân viên
          </label>
          <input 
            type="text" 
            placeholder="Tên nhân viên..."
            className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-md hover:bg-indigo-700 transition-all w-full lg:w-auto">
          <Download size={18} /> Xuất bảng lương
        </button>
      </div>

      {/* Summary Banner */}
      <div className="bg-indigo-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <p className="text-indigo-300 text-sm font-medium uppercase tracking-wider">Tổng quỹ lương sản phẩm</p>
          <h3 className="text-3xl font-bold mt-1">{grandTotalSalary.toLocaleString()} đ</h3>
        </div>
        <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/20 text-center">
          <p className="text-xs text-indigo-200 uppercase">Giai đoạn</p>
          <p className="text-sm font-bold">{startDate} đến {endDate}</p>
        </div>
      </div>

      {/* Salary List */}
      <div className="grid grid-cols-1 gap-4">
        {salaryData.map(emp => (
          <div key={emp.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
            <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl">
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{emp.name}</h4>
                  <p className="text-sm text-gray-500">{emp.role} • {emp.totalQuantity.toLocaleString()} sản phẩm</p>
                </div>
              </div>
              <div className="text-left md:text-right w-full md:w-auto">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Tổng thu nhập</p>
                <p className="text-2xl font-black text-indigo-600">{emp.totalSalary.toLocaleString()} đ</p>
              </div>
            </div>
            
            <div className="px-6 pb-6 pt-0">
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase">Chi tiết sản lượng</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {emp.details.map((d, i) => (
                    <div key={i} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                      <div className="truncate pr-2">
                        <p className="text-xs font-bold text-gray-800 truncate">{d.productName}</p>
                        <p className="text-[10px] text-gray-400">{d.unitPrice.toLocaleString()} đ/sp</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold text-indigo-600">x{d.quantity.toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-gray-900">{d.subtotal.toLocaleString()} đ</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {salaryData.length === 0 && (
          <div className="py-20 text-center bg-white rounded-2xl border border-gray-100 border-dashed">
            <Wallet className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-400">Không có dữ liệu sản lượng cho khoảng thời gian này.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalaryReport;
