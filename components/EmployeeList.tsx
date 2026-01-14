
import React, { useState } from 'react';
import { Employee } from '../types';
import { UserPlus, Search, Trash2, Edit } from 'lucide-react';

interface EmployeeListProps {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, setEmployees }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Thợ may chính');
  const [searchTerm, setSearchTerm] = useState('');

  const addEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newEmp: Employee = {
      id: 'e' + Date.now(),
      name,
      role
    };
    setEmployees([newEmp, ...employees]);
    setName('');
  };

  const deleteEmployee = (id: string) => {
    if (confirm("Xóa thông tin nhân viên này? Dữ liệu sản xuất cũ vẫn sẽ được giữ lại.")) {
      setEmployees(employees.filter(e => e.id !== id));
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Add Employee Form */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <UserPlus className="text-indigo-600" /> Thêm nhân sự
          </h3>
          <form onSubmit={addEmployee} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí / Vai trò</label>
              <select 
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option>Thợ may chính</option>
                <option>Thợ may phụ</option>
                <option>Kiểm hàng (QC)</option>
                <option>Đóng gói</option>
                <option>Học việc</option>
              </select>
            </div>
            <button 
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 transition-all"
            >
              Lưu nhân viên
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: Employee List with Search */}
      <div className="lg:col-span-2 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm nhân viên theo tên..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredEmployees.map(emp => (
            <div key={emp.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{emp.name}</h4>
                  <p className="text-xs text-gray-500">{emp.role}</p>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50">
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => deleteEmployee(emp.id)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {filteredEmployees.length === 0 && (
            <div className="col-span-full py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center text-gray-400">
              {employees.length === 0 
                ? "Chưa có nhân sự nào trong danh sách." 
                : `Không tìm thấy nhân viên nào phù hợp với "${searchTerm}"`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
