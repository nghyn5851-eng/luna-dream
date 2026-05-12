import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Order } from '../types';
import { motion } from 'motion/react';
import { Package, MapPin, User, Mail, Calendar, Clock, ChevronRight } from 'lucide-react';

const Profile: React.FC = () => {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!profile?.uid) return;
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', profile.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Order));
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [profile]);

  if (!profile) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* User Info Card */}
        <div className="space-y-8">
          <div className="celestial-card p-10 bg-white/80 text-center border border-lavender-accent/40 shadow-xl">
            <div className="w-24 h-24 bg-moon-text text-white rounded-full flex items-center justify-center text-4xl font-serif mx-auto mb-6 shadow-xl border-4 border-white">
              {profile.fullName?.[0]}
            </div>
            <h1 className="text-2xl font-serif font-bold text-moon-text italic">{profile.fullName}</h1>
            <p className="text-moon-text/40 text-sm font-medium">{profile.email}</p>
            <div className="mt-8 pt-8 border-t border-moon-text/5 flex justify-center gap-4">
               <div className="px-4 py-1 rounded-full bg-moon-gold/10 text-moon-gold text-[10px] font-bold uppercase tracking-widest leading-loose">
                 {profile.role}
               </div>
            </div>
          </div>

          <div className="celestial-card p-8 bg-lavender-soft/60 space-y-6 border border-lavender-accent/30 shadow-md">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-moon-text/40 border-b border-moon-text/5 pb-4">Thông tin cơ bản</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-moon-text/70">
                <Mail className="w-4 h-4 text-moon-gold" />
                <span className="text-sm font-medium">{profile.email}</span>
              </div>
              <div className="flex items-center gap-4 text-moon-text/70">
                <Calendar className="w-4 h-4 text-moon-gold" />
                <span className="text-sm font-medium italic">Tham gia ngày: {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="lg:col-span-2 space-y-10">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-4xl font-serif font-bold text-moon-text italic">Lịch sử mơ mộng</h2>
              <p className="text-moon-text/40 text-sm font-medium mt-2">Những tuyệt phẩm lụa là nàng đã từng sở hữu</p>
            </div>
            <div className="text-moon-text/20">
              <Package className="w-12 h-12" />
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center animate-pulse italic text-moon-text/40 font-serif">Đang hồi tưởng lại...</div>
          ) : orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="celestial-card p-8 bg-white/70 border border-lavender-accent/30 hover:bg-white hover:border-moon-gold/40 transition-all cursor-pointer group shadow-sm hover:shadow-xl"
                >
                  <div className="flex flex-wrap justify-between gap-6 mb-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-moon-text/40 uppercase tracking-widest">Mã đơn: #{order.id.slice(-6).toUpperCase()}</p>
                      <div className="flex items-center gap-2 text-moon-text font-serif italic text-lg font-bold">
                        <Clock className="w-4 h-4 text-moon-gold" />
                        {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('vi-VN') : 'Unknown Date'}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-2xl font-bold text-moon-gold">{order.totalAmount.toLocaleString()} ₫</p>
                      <div className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-moon-gold/10 text-moon-gold'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-white/50">
                        <img src={item.imageUrl} className="w-full h-full object-cover" alt="" title={item.name} />
                      </div>
                    ))}
                    {order.items.length > 5 && (
                      <div className="w-12 h-16 bg-lavender-soft rounded-lg flex items-center justify-center text-[10px] font-bold text-moon-text">
                        +{order.items.length - 5}
                      </div>
                    )}
                    <div className="flex-grow flex justify-end">
                      <ChevronRight className="w-5 h-5 text-moon-text/20 group-hover:text-moon-gold transition-colors group-hover:translate-x-2 duration-300" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="celestial-card p-20 text-center bg-lavender-soft/40 border border-lavender-accent/30 shadow-inner">
              <Package className="w-16 h-16 text-moon-text/10 mx-auto mb-6" />
              <p className="text-moon-text/40 font-serif italic text-xl">Thế giới đêm của nàng chưa có dấu chân lụa là...</p>
              <Link to="/products" className="mt-8 btn-primary inline-block">Bắt đầu hành trình</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
