
import React, { useState } from 'react';
import { ProductionLog, Product, Employee } from '../types';
import { ClipboardList, Plus, Trash2, Calendar as CalendarIcon, User, Package } from 'lucide-react';

interface ProductionEntryProps {
  logs: ProductionLog[];
  setLogs: React.Dispatch<React.SetStateAction<ProductionLog[]>>;
  products: Product[];
  employees: Employee[];
}

const ProductionEntry: React.FC<ProductionEntryProps> = ({ logs, setLogs, products, employees }) => {
  const [formData, setFormData] = useState({
    productId: '',
    employeeId: '',
    quantity: 0,
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId || !formData.employeeId || formData.quantity <= 0) {
      alert("Vui lòng chọn nhân viên, mã hàng và số lượng lớn hơn 0!");
      return;
    }

    const newLog: ProductionLog = {
      id: 'log' + Date.now(),
      productId: formData.productId,
      employeeId: formData.employeeId,
      quantity: Number(formData.quantity),
      date: formData.date,
      timestamp: Date.now()
    };

    setLogs([newLog, ...logs]);
    setFormData({ ...formData, quantity: 0 }); // Reset quantity for next entry
  };

  const deleteLog = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa bản ghi sản lượng này?")) {
      setLogs(logs.filter(l => l.id !== id));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Column */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <ClipboardList size={20} />
            </div>
            Ghi nhận sản lượng
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2 flex items-center gap-2">
                <CalendarIcon size={14} className="text-indigo-400" /> Ngày sản xuất
              </label>
              <input 
                type="date" 
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2 flex items-center gap-2">
                <User size={14} className="text-indigo-400" /> Nhân viên thực hiện
              </label>
              <select 
                required
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition-all font-medium"
                value={formData.employeeId}
                onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
              >
                <option value="">-- Chọn nhân viên --</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2 flex items-center gap-2">
                <Package size={14} className="text-indigo-400" /> Mẫu đồ chơi
              </label>
              <select 
                required
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition-all font-medium"
                value={formData.productId}
                onChange={(e) => setFormData({...formData, productId: e.target.value})}
              >
                <option value="">-- Chọn mẫu đồ chơi --</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.unitPrice.toLocaleString()}đ)</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">Số lượng thành phẩm (chiếc)</label>
              <input 
                required
                type="number" 
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-black text-2xl text-indigo-600 placeholder:font-medium placeholder:text-gray-300"
                // FIX: Use empty string when value is 0 to allow easy clearing
                value={formData.quantity === 0 ? '' : formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value === '' ? 0 : Number(e.target.value)})}
                placeholder="Nhập số..."
                min="1"
              />
            </div>
            <button 
              type="submit"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Plus size={20} /> Lưu bản ghi sản lượng
            </button>
          </form>
        </div>
      </div>

      {/* History Column */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
          <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center bg-white">
            <h3 className="font-bold text-gray-800 uppercase tracking-widest text-xs flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Nhật ký sản xuất gần đây
            </h3>
            <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase">{logs.length} dòng</span>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 sticky top-0 backdrop-blur-sm z-10">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Thời điểm</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nhân viên</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Mẫu đồ chơi</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">S.Lượng</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.slice(0, 50).map(log => {
                  const emp = employees.find(e => e.id === log.employeeId);
                  const prod = products.find(p => p.id === log.productId);
                  return (
                    <tr key={log.id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-bold text-gray-900">{log.date}</p>
                        <p className="text-[10px] text-gray-400 font-medium">
                          {new Date(log.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-800">{emp?.name || '---'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-600">{prod?.name || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-black text-right text-indigo-600 font-mono">
                        {log.quantity.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => deleteLog(log.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition-all rounded-lg hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-32 text-center">
                      <div className="flex flex-col items-center">
                        <ClipboardList className="text-gray-100 mb-4" size={64} />
                        <p className="text-gray-400 font-medium">Chưa có bản ghi nào. Hãy nhập sản lượng ở khung bên trái.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionEntry;
