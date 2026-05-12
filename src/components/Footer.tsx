import React, { useState, useEffect } from 'react';
import { Moon, Star, Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { WebsiteSettings } from '../types';

const Footer: React.FC = () => {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const docSnap = await getDocs(collection(db, 'settings'));
      if (!docSnap.empty) {
        setSettings(docSnap.docs[0].data() as WebsiteSettings);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="relative bg-gradient-to-br from-lavender-soft to-rose-quartz border-t border-moon-text/5 py-24 px-6 overflow-hidden">
      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-lavender-deep/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 relative z-10">
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <Moon className="w-6 h-6 text-moon-gold" />
            <span className="text-2xl font-serif font-bold tracking-widest text-moon-text">LUNA DREAM</span>
          </div>
          <p className="text-sm text-moon-text/50 leading-relaxed font-medium">
            Mang theo cả bầu trời tinh tú bên mình. Chúng tôi chế tác trang sức bạc Stellar thủ công, tôn vinh vẻ đẹp huyền bí và kiêu sa của phái đẹp.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-moon-text hover:text-white hover:bg-moon-text transition-all duration-300 shadow-sm"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-moon-text hover:text-white hover:bg-moon-text transition-all duration-300 shadow-sm"><Facebook className="w-5 h-5" /></a>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-moon-text mb-8">Khám phá</h4>
          <ul className="space-y-4 text-sm text-moon-text/60 font-medium">
            <li><Link to="/products" className="hover:text-black transition-colors">Tất cả trang sức</Link></li>
            <li><Link to="/products?category=Nhẫn tinh tú" className="hover:text-black transition-colors">Nhẫn tinh tú</Link></li>
            <li><Link to="/products?category=Dây chuyền" className="hover:text-black transition-colors">Dây chuyền ánh trăng</Link></li>
            <li><Link to="/products?category=Charm hành tinh" className="hover:text-black transition-colors">Charm hành tinh</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-moon-text mb-8">Chính sách</h4>
          <ul className="space-y-4 text-sm text-moon-text/60 font-medium">
            <li><a href="#" className="hover:text-black transition-colors">Giao hàng & đổi trả</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Hướng dẫn chọn size</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Bảo mật thông tin</a></li>
          </ul>
        </div>

        <div className="space-y-8">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-moon-text mb-8">Liên hệ</h4>
          <ul className="space-y-5 text-sm text-moon-text/60 font-medium">
            <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-moon-gold" /> {settings?.contactAddress || '123 Moonlight St, Starry City'}</li>
            <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-moon-gold" /> {settings?.contactPhone || '+84 123 456 789'}</li>
            <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-moon-gold" /> {settings?.contactEmail || 'hello@luna.vn'}</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-moon-text/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-moon-text/30 uppercase tracking-[0.3em] font-bold">
        <p>&copy; 2026 LUNA DREAM Stellar Jewelry. Mang theo cả bầu trời tinh tú bên nàng.</p>
        <div className="flex items-center gap-3">
          <Star className="w-2 h-2 fill-current" />
          <span>Handcrafted with Love</span>
          <Star className="w-2 h-2 fill-current" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
