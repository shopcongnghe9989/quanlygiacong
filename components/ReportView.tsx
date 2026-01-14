import React, { useMemo, useState } from 'react';
import { ProductionLog, Product, Employee } from '../types';
// Add missing Package and Users icons to the lucide-react import list
import { FileText, Download, Calendar as CalendarIcon, ChevronDown, ChevronUp, Package, Users } from 'lucide-react';

interface ReportViewProps {
  logs: ProductionLog[];
  products: Product[];
  employees: Employee[];
}

const ReportView: React.FC<ReportViewProps> = ({ logs, products, employees }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const reportData = useMemo(() => {
    const dailyLogs = logs.filter(l => l.date === selectedDate);
    
    // Summary by Employee
    const byEmployee = employees.map(emp => {
      const empLogs = dailyLogs.filter(l => l.employeeId === emp.id);
      const totalQuantity = empLogs.reduce((sum, l) => sum + l.quantity, 0);
      const totalValue = empLogs.reduce((sum, l) => {
        const p = products.find(prod => prod.id === l.productId);
        return sum + (p ? p.unitPrice * l.quantity : 0);
      }, 0);
      return {
        ...emp,
        totalQuantity,
        totalValue,
        details: empLogs.map(l => ({
          productName: products.find(p => p.id === l.productId)?.name || 'N/A',
          qty: l.quantity,
          unitPrice: products.find(p => p.id === l.productId)?.unitPrice || 0
        }))
      };
    }).filter(e => e.totalQuantity > 0);

    // Summary by Product
    const byProduct = products.map(prod => {
      const prodLogs = dailyLogs.filter(l => l.productId === prod.id);
      const totalQuantity = prodLogs.reduce((sum, l) => sum + l.quantity, 0);
      const totalValue = totalQuantity * prod.unitPrice;
      return {
        ...prod,
        totalQuantity,
        totalValue
      };
    }).filter(p => p.totalQuantity > 0);

    return { byEmployee, byProduct };
  }, [logs, products, employees, selectedDate]);

  const totalDayValue = reportData.byProduct.reduce((sum, p) => sum + p.totalValue, 0);
  const totalDayQty = reportData.byProduct.reduce((sum, p) => sum + p.totalQuantity, 0);

  return (
    <div className="space-y-8">
      {/* Date Selector Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
            <CalendarIcon size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Xem báo cáo ngày</h3>
            <p className="text-xs text-gray-500">Dữ liệu sản lượng và tài chính</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input 
            type="date" 
            className="flex-1 sm:w-48 px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button className="bg-gray-800 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium hover:bg-gray-900 transition-all">
            <Download size={18} /> Xuất PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-indigo-200 text-sm font-medium">Tổng giá trị thành phẩm</p>
          <h4 className="text-3xl font-bold mt-1">{totalDayValue.toLocaleString()} đ</h4>
          <div className="mt-4 pt-4 border-t border-indigo-500 flex justify-between">
            <span className="text-indigo-100 text-sm italic">Kết quả chốt sổ cuối ngày</span>
            <FileText size={20} className="text-indigo-200 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Tổng sản phẩm hoàn thành</p>
          <h4 className="text-3xl font-bold mt-1 text-gray-900">{totalDayQty.toLocaleString()} chiếc</h4>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
            <span className="text-gray-400 text-sm">Hàng đã QC & Nhập kho</span>
            <Package size={20} className="text-gray-300" />
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* By Employee Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
            <Users size={18} className="text-gray-500" />
            <h3 className="font-bold text-gray-800 text-sm uppercase">Sản lượng theo nhân viên</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {reportData.byEmployee.map(emp => (
              <div key={emp.id} className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                      {emp.name.charAt(0)}
                    </div>
                    <span className="font-bold text-gray-900">{emp.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900">{emp.totalValue.toLocaleString()} đ</span>
                    <p className="text-[10px] text-gray-400 uppercase font-mono">Lương sản phẩm</p>
                  </div>
                </div>
                <div className="space-y-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  {emp.details.map((d, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-gray-600">{d.productName}</span>
                      <span className="font-medium text-gray-800">x{d.qty}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {reportData.byEmployee.length === 0 && (
              <div className="p-20 text-center text-gray-400 italic">Không có dữ liệu nhân viên trong ngày này.</div>
            )}
          </div>
        </div>

        {/* By Product Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-fit">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
            <Package size={18} className="text-gray-500" />
            <h3 className="font-bold text-gray-800 text-sm uppercase">Tổng kết theo mã hàng</h3>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-600">Tên mã hàng</th>
                <th className="px-6 py-3 font-semibold text-gray-600 text-right">Số lượng</th>
                <th className="px-6 py-3 font-semibold text-gray-600 text-right">Tổng thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reportData.byProduct.map(prod => (
                <tr key={prod.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{prod.name}</td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-indigo-600">{prod.totalQuantity.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-gray-900">{prod.totalValue.toLocaleString()} đ</td>
                </tr>
              ))}
              {reportData.byProduct.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-20 text-center text-gray-400 italic">Chưa có mã hàng nào được sản xuất.</td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-gray-50 font-bold border-t border-gray-200">
              <tr>
                <td className="px-6 py-4 text-gray-800">TỔNG CỘNG</td>
                <td className="px-6 py-4 text-right text-indigo-700">{totalDayQty.toLocaleString()}</td>
                <td className="px-6 py-4 text-right text-indigo-700">{totalDayValue.toLocaleString()} đ</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportView;