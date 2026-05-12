import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-40 text-center">
        <div className="mb-12 flex justify-center">
          <div className="w-32 h-32 bg-lavender-soft rounded-full flex items-center justify-center relative celestial-card">
            <ShoppingBag className="w-12 h-12 text-moon-text/20" />
            <div className="absolute inset-0 bg-lavender-deep/10 rounded-full animate-ping" />
          </div>
        </div>
        <h1 className="text-4xl font-serif font-bold text-moon-text mb-6 italic">Giỏ hàng của nàng đang trống</h1>
        <p className="text-moon-text/70 mb-12 text-lg font-bold">Hàng ngàn giấc mơ tinh tế đang chờ nàng khám phá.</p>
        <Link to="/products" className="btn-primary inline-flex items-center gap-3">
          Bắt đầu mua sắm <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 pb-40">
      <h1 className="text-5xl font-serif font-bold text-moon-text mb-20 flex flex-wrap items-baseline gap-6">
        Giỏ Hàng <span className="text-sm font-sans font-bold text-moon-gold bg-moon-gold/10 px-4 py-2 rounded-full uppercase tracking-widest">({cart.length} sản phẩm)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={`${item.id}-${item.selectedSize}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="celestial-card p-8 flex gap-8 items-center bg-white/40"
              >
                <div className="w-28 h-36 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2 text-moon-text/60 font-bold">
                    <p className="text-[10px] uppercase tracking-[0.2em]">{item.category}</p>
                    {item.selectedSize && <span className="text-[10px] bg-moon-text/5 px-2 py-0.5 rounded-md">Size: {item.selectedSize}</span>}
                  </div>
                  <h3 className="text-xl font-serif font-bold text-moon-text mb-4">{item.name}</h3>
                  <div className="flex items-center gap-8">
                    <div className="flex items-center bg-white/60 border border-moon-text/5 rounded-2xl p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize)}
                        className="p-3 text-moon-text/40 hover:text-black transition-colors"
                      ><Minus className="w-4 h-4" /></button>
                      <span className="w-10 text-center text-sm font-bold text-moon-text">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize)}
                        className="p-3 text-moon-text/40 hover:text-black transition-colors"
                      ><Plus className="w-4 h-4" /></button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id, item.selectedSize)}
                      className="group flex items-center gap-2 text-moon-text/20 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Xóa</span>
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-moon-gold">{(item.price * item.quantity).toLocaleString()} ₫</p>
                  <p className="text-[10px] font-bold text-moon-text/20 mt-1 uppercase tracking-widest">{item.price.toLocaleString()} ₫ / item</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="celestial-card p-10 sticky top-32 bg-white/80 border border-lavender-accent/40 shadow-2xl">
            <h2 className="text-2xl font-serif font-bold text-moon-text mb-8 border-b border-moon-text/5 pb-6">Đơn hàng</h2>
            
            <div className="space-y-6 mb-10 font-bold">
              <div className="flex justify-between text-moon-text/70">
                <span>Tạm tính</span>
                <span>{getCartTotal().toLocaleString()} ₫</span>
              </div>
              <div className="flex justify-between text-moon-text/70">
                <span>Vận chuyển</span>
                <span className="text-moon-gold">{getCartTotal() >= 1000000 ? 'MIỄN PHÍ' : '30.000 ₫'}</span>
              </div>
              <div className="pt-6 border-t border-moon-text/10 flex justify-between items-end">
                <span className="text-xl font-bold text-moon-text mb-1">Tổng cộng</span>
                <div className="text-right">
                  <p className="text-4xl font-bold text-moon-gold">
                    {(getCartTotal() + (getCartTotal() >= 1000000 ? 0 : 30000)).toLocaleString()} ₫
                  </p>
                  <p className="text-[10px] font-bold text-moon-text/20 uppercase tracking-widest mt-2">VAT included</p>
                </div>
              </div>
            </div>

            <Link to="/checkout" className="w-full btn-primary h-16 flex items-center justify-center gap-3 text-lg">
              <CreditCard className="w-5 h-5" /> Thanh toán
            </Link>
            
            <div className="mt-10 flex flex-wrap justify-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
              <img src="https://img.icons8.com/color/48/000000/visa.png" className="h-6" alt="Visa" />
              <img src="https://img.icons8.com/color/48/000000/mastercard.png" className="h-6" alt="Mastercard" />
              <img src="https://img.icons8.com/color/48/000000/paypal.png" className="h-6" alt="Paypal" />
            </div>

            <Link to="/products" className="block text-center mt-12 text-[10px] font-bold uppercase tracking-[0.2em] text-moon-text/30 hover:text-black transition-colors">
              Mua hàng tiếp tục
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
