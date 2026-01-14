
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
// Added missing Package icon to imports
import { Plus, Search, Edit2, Trash2, X, Package } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ProductList: React.FC<ProductListProps> = ({ products, setProducts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ name: '', unitPrice: 0, category: 'Đồ chơi vải' });

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        unitPrice: editingProduct.unitPrice,
        category: editingProduct.category
      });
    } else {
      setFormData({ name: '', unitPrice: 0, category: 'Đồ chơi vải' });
    }
  }, [editingProduct, isModalOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, name: formData.name, unitPrice: Number(formData.unitPrice), category: formData.category }
          : p
      ));
    } else {
      const newProd: Product = {
        id: 'p' + Date.now(),
        name: formData.name,
        unitPrice: Number(formData.unitPrice),
        category: formData.category,
        createdAt: Date.now()
      };
      setProducts([newProd, ...products]);
    }
    handleCloseModal();
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const deleteProduct = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa mẫu đồ chơi này khỏi danh mục?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm mẫu đồ chơi..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button 
          onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          <Plus size={20} /> Thêm mẫu đồ chơi
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tên mẫu / Mã</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Phân loại</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Đơn giá gia công</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngày tạo</th>
              <th className="px-6 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(product => (
              <tr key={product.id} className="hover:bg-indigo-50/20 transition-colors group">
                <td className="px-6 py-5">
                  <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{product.name}</p>
                  <p className="text-[10px] text-gray-400 font-mono">{product.id}</p>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-5 font-black text-gray-800">
                  {product.unitPrice.toLocaleString()} đ
                </td>
                <td className="px-6 py-5 text-xs font-medium text-gray-400">
                  {new Date(product.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-1">
                    <button 
                      onClick={() => handleEditClick(product)}
                      className="p-2.5 text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => deleteProduct(product.id)}
                      className="p-2.5 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-24 text-center">
                   <div className="flex flex-col items-center">
                    <Package className="text-gray-100 mb-4" size={64} />
                    <p className="text-gray-400 font-medium italic">Không có mẫu đồ chơi nào phù hợp.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
            <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-white">
              <h3 className="text-xl font-black text-gray-800 tracking-tight">
                {editingProduct ? 'Cập Nhật Mẫu Đồ Chơi' : 'Thêm Mẫu Đồ Chơi Mới'}
              </h3>
              <button onClick={handleCloseModal} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Tên mẫu đồ chơi</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ví dụ: Gấu bông thêu hoa"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Nhóm hàng</label>
                <select 
                  className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium transition-all"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option>Đồ chơi vải</option>
                  <option>Đồ chơi gỗ</option>
                  <option>Đồ chơi nhựa</option>
                  <option>Phụ kiện đồ chơi</option>
                  <option>Khác</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Đơn giá gia công (đ/chiếc)</label>
                <input 
                  required
                  type="number" 
                  className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-black text-2xl text-indigo-600 placeholder:font-medium placeholder:text-gray-300 transition-all"
                  // FIX: Use empty string when value is 0 to allow easy clearing
                  value={formData.unitPrice === 0 ? '' : formData.unitPrice}
                  onChange={(e) => setFormData({...formData, unitPrice: e.target.value === '' ? 0 : Number(e.target.value)})}
                  placeholder="0"
                />
              </div>
              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-4 border border-gray-100 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all active:scale-95"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                >
                  {editingProduct ? 'Cập nhật' : 'Lưu mẫu hàng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
