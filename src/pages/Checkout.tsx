import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowLeft, Send } from 'lucide-react';

const Checkout: React.FC = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [isOrdered, setIsOrdered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || '',
    phone: '',
    address: '',
    note: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) {
      navigate('/login');
      return;
    }
    
    setLoading(true);
    try {
      const orderData = {
        userId: profile.uid,
        items: cart,
        totalAmount: getCartTotal() + (getCartTotal() >= 1000000 ? 0 : 30000),
        status: 'Processing',
        customerInfo: formData,
        createdAt: serverTimestamp()
      };
      
      await addDoc(collection(db, 'orders'), orderData);
      setIsOrdered(true);
      clearCart();
    } catch (error) {
      console.error("Lỗi đặt hàng: ", error);
      alert("Cửa trăng đang bận, nàng vui lòng thử lại sau chút nhé!");
    } finally {
      setLoading(false);
    }
  };

  if (isOrdered) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-40 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-12 shadow-xl border border-green-100"
        >
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </motion.div>
        <h1 className="text-5xl font-serif font-bold text-moon-text mb-6 italic">Đặt hàng thành công!</h1>
        <p className="text-moon-text/60 mb-12 text-lg font-medium max-w-xl mx-auto">
          Cảm ơn nàng đã tin tưởng LUNA DREAM. Chúng mình sẽ chuẩn bị "giấc mơ" này thật chu đáo 
          và gửi đến nàng trong thời gian sớm nhất.
        </p>
        <button onClick={() => navigate('/products')} className="btn-primary">
          Tiếp tục vãn cảnh
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-moon-text/40 hover:text-black mb-12 font-bold uppercase tracking-widest text-[10px]">
        <ArrowLeft className="w-4 h-4" /> Quay lại giỏ hàng
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <h2 className="text-4xl font-serif font-bold text-moon-text mb-12 italic">Nơi giấc mơ gửi đến</h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-moon-text/40 px-4">Họ và tên người nhận</label>
              <input 
                required
                className="w-full bg-lavender-soft/50 border border-lavender-accent/20 rounded-3xl px-8 py-5 outline-none focus:border-moon-gold focus:bg-white transition-all shadow-inner"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                placeholder="Nàng tên là..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-moon-text/40 px-4">Số điện thoại</label>
              <input 
                required
                className="w-full bg-lavender-soft/50 border border-lavender-accent/20 rounded-3xl px-8 py-5 outline-none focus:border-moon-gold focus:bg-white transition-all shadow-inner"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="Để LUNA DREAM liên lạc nhé..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-moon-text/40 px-4">Địa chỉ chi tiết</label>
              <textarea 
                required
                rows={3}
                className="w-full bg-lavender-soft/50 border border-lavender-accent/20 rounded-3xl px-8 py-5 outline-none focus:border-moon-gold focus:bg-white transition-all shadow-inner"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-moon-text/40 px-4">Lời dặn thêm</label>
              <textarea 
                rows={2}
                className="w-full bg-lavender-soft/50 border border-lavender-accent/20 rounded-3xl px-8 py-5 outline-none focus:border-moon-gold focus:bg-white transition-all shadow-inner"
                value={formData.note}
                onChange={(e) => setFormData({...formData, note: e.target.value})}
                placeholder="Giao giờ hành chính, gói quà..."
              />
            </div>
            <button 
              disabled={loading}
              className="w-full btn-primary h-20 text-lg flex items-center justify-center gap-4 disabled:opacity-50"
            >
              {loading ? 'Đang gửi tín hiệu...' : <><Send className="w-6 h-6" /> Xác nhận đặt hàng</>}
            </button>
          </form>
        </div>

        <div className="celestial-card p-12 bg-white/80 border border-lavender-accent/40 h-fit sticky top-32 shadow-2xl">
          <h2 className="text-2xl font-serif font-bold text-moon-text mb-10 border-b border-moon-text/5 pb-6">Đơn hàng của nàng</h2>
          <div className="space-y-6 max-h-[400px] overflow-y-auto mb-10 pr-4">
            {cart.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-16 h-20 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                  <img src={item.imageUrl} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-bold text-moon-text leading-tight mb-1">{item.name}</p>
                  <p className="text-[10px] text-moon-text/40 font-bold uppercase tracking-widest">Size: {item.selectedSize} • SL: {item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-moon-gold">{(item.price * item.quantity).toLocaleString()} ₫</p>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-10 border-t border-moon-text/10">
            <div className="flex justify-between text-moon-text/60 font-bold text-sm">
              <span>Tạm tính</span>
              <span>{getCartTotal().toLocaleString()} ₫</span>
            </div>
            <div className="flex justify-between text-moon-text/60 font-bold text-sm">
              <span>Phí vận chuyển</span>
              <span className="text-moon-gold">{getCartTotal() >= 1000000 ? 'MIỄN PHÍ' : '30.000 ₫'}</span>
            </div>
            <div className="flex justify-between items-end pt-6">
              <span className="text-xl font-bold text-moon-text">Tổng cộng</span>
              <span className="text-4xl font-bold text-moon-gold">{(getCartTotal() + (getCartTotal() >= 1000000 ? 0 : 30000)).toLocaleString()} ₫</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
