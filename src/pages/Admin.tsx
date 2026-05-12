import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, limit } from 'firebase/firestore';
import { LayoutDashboard, ShoppingBag, ListOrdered, Plus, Edit, Trash2, Save, X, BarChart3, TrendingUp, Users, Package, Eye, CheckCircle, Clock, Truck, UserCheck, Settings, Sparkles } from 'lucide-react';
import { db } from '../services/firebase';
import { Product, Order, UserProfile, WebsiteSettings } from '../types';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { setDoc } from 'firebase/firestore';

const Admin: React.FC = () => {
  const { profile, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/login');
    }
  }, [loading, isAdmin, navigate]);

  if (loading) return <div className="py-32 text-center text-moon-text font-serif italic text-2xl animate-pulse">Cửa trăng đang mở...</div>;
  if (!isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
      {/* Admin Sidebar */}
      <aside className="md:w-64 space-y-4">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-moon-text/40 mb-8 px-4">Bảng điều khiển</h2>
        {[
          { name: 'Tổng quan', path: '/admin', icon: LayoutDashboard },
          { name: 'Sản phẩm', path: '/admin/products', icon: ShoppingBag },
          { name: 'Đơn hàng', path: '/admin/orders', icon: ListOrdered },
          { name: 'Khách hàng', path: '/admin/customers', icon: Users },
          { name: 'Cài đặt', path: '/admin/settings', icon: Settings },
        ].map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${
              location.pathname === item.path ? 'bg-moon-text text-white shadow-xl scale-105' : 'text-moon-text/40 hover:bg-white/40 hover:text-black'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </aside>

      {/* Admin Content Area */}
      <main className="flex-1 celestial-card p-10 bg-white/80 border border-lavender-accent/40 shadow-2xl overflow-x-auto min-h-[600px]">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/products" element={<AdminProducts />} />
          <Route path="/orders" element={<AdminOrders />} />
          <Route path="/customers" element={<AdminCustomers />} />
          <Route path="/settings" element={<AdminSettings />} />
        </Routes>
      </main>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, users: 0, products: 0 });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const ordersSnap = await getDocs(collection(db, 'orders'));
      const productsSnap = await getDocs(collection(db, 'products'));
      const usersSnap = await getDocs(collection(db, 'users'));
      
      const orders = ordersSnap.docs.map(d => d.data());
      const totalRevenue = orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
      
      setStats({
        revenue: totalRevenue,
        orders: ordersSnap.size,
        users: usersSnap.size,
        products: productsSnap.size
      });

      // Revenue chart data based on orders
      const revenueByDate: {[key: string]: number} = {};
      ordersSnap.docs.forEach(doc => {
        const data = doc.data();
        const date = data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString() : 'N/A';
        revenueByDate[date] = (revenueByDate[date] || 0) + (data.totalAmount || 0);
      });
      
      const chartData = Object.entries(revenueByDate)
        .slice(-7) // Last 7 days/entries
        .map(([name, value]) => ({ name, value }));
        
      setChartData(chartData);
    };
    fetchStats();
  }, []);

  const COLORS = ['#4a4e69', '#d4af37', '#9a8c98', '#c9ada7'];

  return (
    <div className="space-y-12">
      <h3 className="text-3xl font-serif font-bold text-moon-text mb-10 italic underline decoration-moon-gold underline-offset-8">Phân tích hệ thống</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {[
          { label: 'Doanh thu tổng', value: `${stats.revenue.toLocaleString()} ₫`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Lượt mua thành công', value: stats.orders.toString(), icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Cộng đồng LUNA DREAM', value: stats.users.toString(), icon: Users, color: 'text-purple-600', bg: 'bg-lavender-soft' },
          { label: 'Mẫu đang phục vụ', value: stats.products.toString(), icon: ShoppingBag, color: 'text-moon-gold', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/90 border border-lavender-accent/30 p-8 rounded-[2rem] flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
            <div className={`p-5 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] text-moon-text/30 uppercase tracking-widest font-bold mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-moon-text tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-10 celestial-card bg-lavender-soft/60 border border-lavender-accent/30 h-[400px] shadow-lg">
        <h4 className="text-sm font-bold uppercase tracking-widest text-moon-text/40 mb-8">Biểu đồ doanh thu (vần điệu thời gian)</h4>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000005" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}
                formatter={(value: any) => [`${value.toLocaleString()} ₫`, 'Doanh thu']}
              />
              <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-moon-text/20 italic font-serif">
            Đang tổng hợp dữ liệu vãn cảnh...
          </div>
        )}
      </div>
    </div>
  );
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', price: 0, category: 'Nhẫn tinh tú', imageUrl: '', description: '', sizes: ['N/A'], featured: false
  });

  const fetchProducts = async () => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSave = async () => {
    if (editingId) {
      await updateDoc(doc(db, 'products', editingId), formData);
    } else {
      await addDoc(collection(db, 'products'), { ...formData, createdAt: new Date().toISOString() });
    }
    setEditingId(null);
    setIsAdding(false);
    setFormData({ name: '', price: 0, category: 'Nhẫn tinh tú', imageUrl: '', description: '', sizes: ['N/A'], featured: false });
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Nàng có chắc muốn xóa vĩnh viễn mẫu tuyệt phẩm này?')) {
      await deleteDoc(doc(db, 'products', id));
      fetchProducts();
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-moon-text to-lavender-deep p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-moon-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
        <div className="relative z-10">
          <h3 className="text-3xl font-serif font-bold text-white mb-2 italic">Kho báu Luna</h3>
          <p className="text-white/50 text-sm font-medium">Nâng tầm phong cách sống với những thiết kế mới nhất</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="relative z-10 bg-moon-gold text-moon-text px-12 py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs transition-all hover:bg-white hover:scale-105 active:scale-95 flex items-center gap-3 shadow-[0_20px_40px_rgba(212,175,55,0.2)]"
        >
          {isAdding ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {isAdding ? 'Hủy bỏ' : 'Sáng tạo mẫu mới'}
        </button>
      </div>

      <AnimatePresence>
        {(isAdding || editingId) && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/80 p-10 rounded-[2.5rem] border border-moon-gold/20 shadow-xl space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-moon-text/40 px-2">Tên sản phẩm</label>
                <input 
                  placeholder="Ví dụ: Pajama Lụa Hồng..."
                  className="w-full bg-lavender-soft border border-moon-text/5 rounded-2xl px-6 py-4 outline-none focus:border-moon-gold transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-moon-text/40 px-2">Giá niêm yết</label>
                <input 
                  type="number"
                  placeholder="Giá bán..."
                  className="w-full bg-lavender-soft border border-moon-text/5 rounded-2xl px-6 py-4 outline-none focus:border-moon-gold transition-all"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-moon-text/40 px-2">Phân loại</label>
                <select 
                  className="w-full bg-lavender-soft border border-moon-text/5 rounded-2xl px-6 py-4 outline-none focus:border-moon-gold transition-all appearance-none"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                >
                  <option value="Nhẫn tinh tú">Nhẫn tinh tú</option>
                  <option value="Dây chuyền">Dây chuyền ánh trăng</option>
                  <option value="Charm hành tinh">Charm hành tinh (Mercury, Mars...)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-moon-text/40 px-2">Ảnh đại diện (URL)</label>
                <input 
                  placeholder="Link hình ảnh sắc nét..."
                  className="w-full bg-lavender-soft border border-moon-text/5 rounded-2xl px-6 py-4 outline-none focus:border-moon-gold transition-all"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold text-moon-text/40 px-2">Kích thước & Trạng thái</label>
                <div className="flex flex-wrap gap-4 items-center px-2">
                  {['S', 'M', 'L', 'XL'].map(size => (
                    <label key={size} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={formData.sizes?.includes(size)}
                        onChange={(e) => {
                          const sizes = formData.sizes || [];
                          if (e.target.checked) setFormData({...formData, sizes: [...sizes, size]});
                          else setFormData({...formData, sizes: sizes.filter(s => s !== size)});
                        }}
                        className="w-4 h-4 rounded-md accent-moon-gold"
                      />
                      <span className="text-xs font-bold text-moon-text">{size}</span>
                    </label>
                  ))}
                  <div className="mx-4 w-[1px] h-4 bg-moon-text/10" />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                      className="w-4 h-4 rounded-md accent-moon-gold"
                    />
                    <span className="text-xs font-bold text-moon-gold">Bán chạy</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-moon-text/40 px-2">Mô tả sản phẩm</label>
              <textarea 
                 placeholder="Kể về sự mềm mại của chất liệu..."
                 className="w-full bg-lavender-soft border border-moon-text/5 rounded-2xl px-6 py-4 outline-none focus:border-moon-gold transition-all min-h-[120px]"
                 value={formData.description}
                 onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <button onClick={handleSave} className="btn-primary w-full h-16 flex items-center justify-center gap-3 text-lg">
              <Save className="w-6 h-6" /> Đăng tải lên cửa trăng
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-w-full inline-block align-middle">
        <div className="overflow-hidden bg-lavender-soft/30 rounded-[2rem] border border-lavender-accent/20">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-lavender-soft/80 border-b border-lavender-accent/10">
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-moon-text/40">Sản phẩm</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-moon-text/40">Giá bán</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-moon-text/40">Danh mục</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-moon-text/40 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-moon-text/5">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-white/60 transition-colors">
                  <td className="px-8 py-6 flex items-center gap-4">
                    <img src={p.imageUrl} alt="" className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                    <span className="font-serif font-bold text-moon-text text-lg">{p.name}</span>
                  </td>
                  <td className="px-8 py-6 font-bold text-moon-gold">{p.price.toLocaleString()} ₫</td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-lavender-deep/30 rounded-full text-[10px] font-bold text-moon-text/60 uppercase">{p.category}</span>
                  </td>
                  <td className="px-8 py-6 text-right space-x-2">
                    <button 
                      onClick={() => { setEditingId(p.id); setFormData(p); }} 
                      className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all"
                    ><Edit className="w-4 h-4" /></button>
                    <button 
                      onClick={() => handleDelete(p.id)}
                      className="p-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                    ><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    setOrders(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
    fetchOrders();
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus } as Order);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Processing': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'Shipped': return <Truck className="w-4 h-4 text-amber-500" />;
      case 'Delivered': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Package className="w-4 h-4 text-moon-text/40" />;
    }
  };

  return (
    <div className="space-y-12">
      <h3 className="text-3xl font-serif font-bold text-moon-text p-8 bg-lavender-soft/50 rounded-[2rem] border border-lavender-accent/20 italic shadow-sm">Theo dõi vận đơn</h3>
      
      <div className="overflow-hidden bg-lavender-soft/30 rounded-[2rem] border border-lavender-accent/20">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-lavender-soft/80 border-b border-lavender-accent/10">
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-moon-text/40">Mã vận đơn</th>
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-moon-text/40">Khách hàng</th>
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-moon-text/40">Thanh toán</th>
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-moon-text/40">Trạng thái</th>
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-moon-text/40 text-right">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-moon-text/5">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-white/60 transition-all">
                <td className="px-8 py-6 font-mono text-xs text-moon-text/40">#{o.id.slice(0, 8).toUpperCase()}</td>
                <td className="px-8 py-6 font-bold text-moon-text">{o.customerInfo.fullName}</td>
                <td className="px-8 py-6 font-bold text-moon-gold">{o.totalAmount.toLocaleString()} ₫</td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(o.status)}
                    <span className="text-[10px] uppercase font-bold tracking-widest text-moon-text/60">
                      {o.status}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <button 
                    onClick={() => setSelectedOrder(o)}
                    className="p-3 bg-lavender-deep/30 text-moon-text hover:bg-moon-text hover:text-white rounded-xl transition-all"
                  ><Eye className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="text-center py-24 text-moon-text/20 italic font-serif text-xl">Chưa có đơn hàng nào vãng lai...</div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-10 border-b border-moon-text/5 flex justify-between items-center bg-lavender-soft/30">
                <div>
                  <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-moon-gold mb-2">Chi tiết đơn hàng</h4>
                  <p className="text-2xl font-serif font-bold text-moon-text">Mã: #{selectedOrder.id.toUpperCase()}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-3 hover:bg-white rounded-full transition-colors">
                  <X className="w-6 h-6 text-moon-text/40" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div>
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-moon-text/30 mb-4">Danh sách sản phẩm</h5>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white/40 border border-moon-text/5">
                          <img src={item.imageUrl} className="w-16 h-16 rounded-xl object-cover" alt="" />
                          <div>
                            <p className="font-bold text-moon-text">{item.name}</p>
                            <p className="text-xs text-moon-text/40">Size: {item.selectedSize || 'N/A'} • Số lượng: {item.quantity}</p>
                            <p className="text-sm font-bold text-moon-gold mt-1">{(item.price * item.quantity).toLocaleString()} ₫</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-moon-text/30 mb-4">Thông tin khách hàng</h5>
                    <div className="space-y-2 text-sm font-medium text-moon-text">
                      <p><span className="text-moon-text/40">Tên:</span> {selectedOrder.customerInfo.fullName}</p>
                      <p><span className="text-moon-text/40">SĐT:</span> {selectedOrder.customerInfo.phone}</p>
                      <p><span className="text-moon-text/40">Địa chỉ:</span> {selectedOrder.customerInfo.address}</p>
                      <p><span className="text-moon-text/40">Ghi chú:</span> {selectedOrder.customerInfo.note || 'Không có'}</p>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-moon-text/30 mb-4">Trạng thái xử lý</h5>
                    <div className="grid grid-cols-2 gap-4">
                      {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                        <button
                          key={status}
                          onClick={() => updateStatus(selectedOrder.id, status)}
                          className={`px-4 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                            selectedOrder.status === status 
                            ? 'bg-moon-text text-white shadow-lg' 
                            : 'bg-lavender-soft/50 text-moon-text/40 hover:bg-lavender-soft'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-moon-text/5">
                    <div className="flex justify-between items-end">
                      <span className="text-moon-text/40 font-bold uppercase tracking-widest text-[10px]">Thành tiền</span>
                      <span className="text-3xl font-bold text-moon-gold">{selectedOrder.totalAmount.toLocaleString()} ₫</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<UserProfile[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      setCustomers(querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile)));
    };
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-12">
      <h3 className="text-3xl font-serif font-bold text-moon-text p-8 bg-lavender-soft/50 rounded-[2rem] border border-lavender-accent/20 italic shadow-sm">Cộng đồng LUNA DREAM</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {customers.map((c) => (
          <div key={c.uid} className="celestial-card p-10 bg-white/80 border border-lavender-accent/40 flex flex-col items-center text-center shadow-lg">
            <div className="w-16 h-16 rounded-full bg-moon-text text-white flex items-center justify-center text-xl font-bold mb-6 shadow-xl">
              {c.fullName?.[0] || 'L'}
            </div>
            <h4 className="text-xl font-serif font-bold text-moon-text mb-2">{c.fullName || 'Thành viên LUNA DREAM'}</h4>
            <p className="text-sm text-moon-text/60 mb-6">{c.email}</p>
            <div className="flex items-center gap-2 px-6 py-2 bg-moon-gold/10 rounded-full">
              <UserCheck className="w-3 h-3 text-moon-gold" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-moon-gold">{c.role || 'Member'}</span>
            </div>
            {c.createdAt && (
              <p className="mt-8 text-[10px] text-moon-text/20 uppercase tracking-widest font-bold">Gia nhập: {new Date(c.createdAt).toLocaleDateString()}</p>
            )}
          </div>
        ))}
        {customers.length === 0 && (
          <div className="col-span-full text-center py-24 text-moon-text/20 italic font-serif text-xl border border-moon-text/5 rounded-[2rem]">Chưa có tri kỷ nào đăng ký...</div>
        )}
      </div>
    </div>
  );
};

const AdminSettings = () => {
  const [settings, setSettings] = useState<WebsiteSettings>({
    heroTitle: 'Ánh Sáng',
    heroSubtitle: 'từ các vì sao.',
    heroImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000&auto=format&fit=crop',
    philosophyTitle: 'Mỗi tuyệt phẩm Một mảnh hồn tinh tú.',
    philosophyText: 'LUNA DREAM không chỉ bán trang sức bạc. Chúng tôi trao gửi những bùa hộ mệnh từ vũ trụ, để nàng luôn cảm thấy sự dẫn lối của ánh trăng và sức mạnh từ những hành tinh xa xôi.',
    contactEmail: 'contact@luna.vn',
    contactPhone: '0901 234 567',
    contactAddress: '123 Đường Ánh Trăng, TP. Hồ Chí Minh'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const docSnap = await getDocs(collection(db, 'settings'));
      if (!docSnap.empty) {
        setSettings(docSnap.docs[0].data() as WebsiteSettings);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Use a fixed ID for global settings
      await setDoc(doc(db, 'settings', 'global'), settings);
      alert('Đã cập nhật giao diện cửa trăng!');
    } catch (e) {
      console.error(e);
      alert('Cửa trăng đang bận tâm, vui lòng thử lại sau.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse italic font-serif text-moon-text/40">Đang chuẩn bị bối cảnh...</div>;

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center bg-lavender-soft/60 p-8 rounded-[2rem] border border-lavender-accent/30 shadow-md">
        <h3 className="text-3xl font-serif font-bold text-moon-text italic">Cài đặt Website</h3>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center gap-3 px-10 disabled:opacity-50"
        >
          {saving ? <Sparkles className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Lưu thay đổi
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-8 celestial-card p-10 bg-white/80 border border-lavender-accent/40 shadow-xl">
          <h4 className="text-sm font-bold uppercase tracking-widest text-moon-gold flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Vùng Hero (Banner)
          </h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-moon-text/40 px-2">Tiêu đề chính</label>
              <input 
                className="w-full bg-lavender-soft border border-moon-text/5 rounded-2xl px-6 py-4 outline-none focus:border-moon-gold transition-all"
                value={settings.heroTitle}
                onChange={(e) => setSettings({...settings, heroTitle: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-moon-text/40 px-2">Tiêu đề phụ (in nghiêng)</label>
              <input 
                className="w-full bg-lavender-soft border border-moon-text/5 rounded-2xl px-6 py-4 outline-none focus:border-moon-gold transition-all"
                value={settings.heroSubtitle}
                onChange={(e) => setSettings({...settings, heroSubtitle: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-moon-text/40 px-2">Ảnh Banner (URL)</label>
              <input 
                className="w-full bg-lavender-soft border border-moon-text/5 rounded-2xl px-6 py-4 outline-none focus:border-moon-gold transition-all"
                value={settings.heroImage}
                onChange={(e) => setSettings({...settings, heroImage: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="space-y-8 celestial-card p-10 bg-lavender-soft/30 border border-lavender-deep/10">
          <h4 className="text-sm font-bold uppercase tracking-widest text-moon-gold flex items-center gap-2">
            <Eye className="w-4 h-4" /> Triết lý thương hiệu
          </h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-moon-text/40 px-2">Tiêu đề triết lý</label>
              <input 
                className="w-full bg-lavender-soft border border-moon-text/5 rounded-2xl px-6 py-4 outline-none focus:border-moon-gold transition-all"
                value={settings.philosophyTitle}
                onChange={(e) => setSettings({...settings, philosophyTitle: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-moon-text/40 px-2">Nội dung triết lý</label>
              <textarea 
                rows={4}
                className="w-full bg-lavender-soft border border-moon-text/5 rounded-2xl px-6 py-4 outline-none focus:border-moon-gold transition-all"
                value={settings.philosophyText}
                onChange={(e) => setSettings({...settings, philosophyText: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-8 celestial-card p-10 bg-white/80 border border-lavender-accent/40 shadow-xl">
          <h4 className="text-sm font-bold uppercase tracking-widest text-moon-gold flex items-center gap-2">
            <Users className="w-4 h-4" /> Thông tin liên hệ
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-moon-text/40 px-2">Email</label>
              <input 
                className="w-full bg-lavender-soft border border-moon-text/5 rounded-2xl px-6 py-4 outline-none focus:border-moon-gold transition-all"
                value={settings.contactEmail}
                onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-moon-text/40 px-2">Số điện thoại</label>
              <input 
                className="w-full bg-lavender-soft border border-moon-text/5 rounded-2xl px-6 py-4 outline-none focus:border-moon-gold transition-all"
                value={settings.contactPhone}
                onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-moon-text/40 px-2">Địa chỉ</label>
              <input 
                className="w-full bg-lavender-soft border border-moon-text/5 rounded-2xl px-6 py-4 outline-none focus:border-moon-gold transition-all"
                value={settings.contactAddress}
                onChange={(e) => setSettings({...settings, contactAddress: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
