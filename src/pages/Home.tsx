import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Star, Moon, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Product, WebsiteSettings } from '../types';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch settings
      const settingsSnap = await getDocs(collection(db, 'settings'));
      if (!settingsSnap.empty) {
        setSettings(settingsSnap.docs[0].data() as WebsiteSettings);
      }

      // Fetch featured products
      const q = query(
        collection(db, 'products'), 
        where('featured', '==', true), 
        limit(4)
      );
      const querySnapshot = await getDocs(q);
      setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <section className="relative h-[95vh] flex items-center justify-center text-center overflow-hidden bg-moon-text">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-moon-text z-10" />
          <img
            src={settings?.heroImage || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2000&auto=format&fit=crop"}
            className="w-full h-full object-cover opacity-60 scale-105"
            alt="Luxury Jewelry Background"
          />
          
          {/* Constellation Overlay */}
          <div className="absolute inset-0 z-5 opacity-30">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  opacity: [0.2, 0.8, 0.2],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{ 
                  duration: Math.random() * 4 + 2, 
                  repeat: Infinity,
                  delay: Math.random() * 5
                }}
                className="absolute"
                style={{ 
                  left: `${Math.random() * 100}%`, 
                  top: `${Math.random() * 100}%` 
                }}
              >
                <Star className="w-1 h-1 text-moon-gold fill-current shadow-[0_0_10px_white]" />
              </motion.div>
            ))}
          </div>

          {/* Glowing Nebula */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.4, 0.3]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-moon-gold/10 rounded-full blur-[120px] z-0"
          />
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <div className="flex items-center justify-center gap-3 text-moon-gold mb-10">
              <div className="w-12 h-[1px] bg-moon-gold/50" />
              <Sparkles className="w-6 h-6 animate-pulse" />
              <span className="text-sm font-bold uppercase tracking-[0.5em] text-white/90">Premium Stellar Collection</span>
              <div className="w-12 h-[1px] bg-moon-gold/50" />
            </div>

            {settings ? (
              <>
                <h1 className="text-6xl md:text-9xl font-serif font-bold text-white mb-10 leading-[1.1] tracking-tight">
                  {settings.heroTitle} <br /> 
                  <span className="italic font-light text-moon-gold drop-shadow-2xl">{settings.heroSubtitle}</span>
                </h1>
                <p className="text-xl text-white/70 mb-14 leading-relaxed max-w-2xl mx-auto font-medium italic font-serif">
                  {settings.heroTitle === 'Ánh Sáng' ? 'Trải nghiệm sự tinh khiết của bạc 925 hòa quyện cùng năng lượng từ các vì tinh tú xa xôi.' : 'Khám phá những tuyệt phẩm trang sức mang tâm hồn của vũ trụ và vẻ đẹp vĩnh cửu của mặt trăng.'}
                </p>
              </>
            ) : (
              <>
                <h1 className="text-6xl md:text-9xl font-serif font-bold text-white mb-10 leading-[1.1] tracking-tight">
                  Ánh Sáng <br /> 
                  <span className="italic font-light text-moon-gold drop-shadow-2xl">từ các vì sao.</span>
                </h1>
                <p className="text-xl text-white/70 mb-14 leading-relaxed max-w-2xl mx-auto font-medium italic font-serif">
                  Trải nghiệm sự tinh khiết của bạc 925 hòa quyện cùng năng lượng từ các vì tinh tú xa xôi.
                </p>
              </>
            )}

            <div className="flex flex-wrap justify-center gap-8">
              <Link to="/products" className="px-12 py-5 bg-white text-moon-text rounded-full font-bold uppercase tracking-widest hover:bg-moon-gold hover:text-white transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:-translate-y-1 active:scale-95 group relative overflow-hidden">
                <span className="relative z-10">Khám Phá Tuyệt Phẩm</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Link>
              <Link to="#collections" onClick={(e) => { e.preventDefault(); document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' }); }} className="px-12 py-5 border border-white/20 text-white rounded-full font-bold uppercase tracking-widest hover:bg-white/10 transition-all duration-500 backdrop-blur-sm">
                Bộ Sưu Tập
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-moon-text mb-4">Tuyệt Phẩm Tinh Tú</h2>
          <div className="w-20 h-[2px] bg-moon-gold mx-auto mb-6" />
          <p className="text-moon-text/60 font-medium">Sự lấp lánh của bạc 925 hòa quyện cùng ánh sáng vĩnh cửu</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
          {products.length === 0 && (
            <div className="col-span-full py-20 text-center italic text-moon-text/20">Đang chuẩn bị những tuyệt phẩm mới...</div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-7xl mx-auto px-6 scroll-mt-32">
        <div className="celestial-card p-12 md:p-24 relative overflow-hidden text-center max-w-5xl mx-auto">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-moon-gold/20 to-transparent" />
          <Moon className="w-12 h-12 text-moon-gold/30 mx-auto mb-8" />
          <h2 className="text-4xl md:text-5xl font-bold text-moon-text mb-8">Ánh Sáng Từ Thiên Hà</h2>
          <p className="text-xl text-moon-text/80 leading-relaxed mb-12 italic font-serif font-medium">
            "Chúng tôi chế tác trang sức không chỉ để làm đẹp, mà để nàng mang theo cả một bầu trời đầy sao bên mình mỗi ngày."
          </p>
          <div className="flex flex-wrap justify-center gap-12 text-moon-text/60 text-[10px] uppercase tracking-[0.3em] font-bold">
            <span className="flex items-center gap-2"><Star className="w-3 h-3 text-moon-gold" /> BẠC 925 TINH KHIẾT</span>
            <span className="flex items-center gap-2"><Star className="w-3 h-3 text-moon-gold" /> CHẾ TÁC THỦ CÔNG</span>
            <span className="flex items-center gap-2"><Star className="w-3 h-3 text-moon-gold" /> CẢM HỨNG VŨ TRỤ</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="collections" className="max-w-7xl mx-auto px-6 scroll-mt-32">
        <div className="text-center mb-20">
          <p className="text-moon-gold text-[10px] font-bold uppercase tracking-[0.4em] mb-4">Danh mục đặc tuyển</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-moon-text mb-6 italic">Bộ Sưu Tập Cuối Mùa</h2>
          <div className="w-12 h-[1px] bg-moon-gold/30 mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { name: 'Nhẫn tinh tú', image: 'https://images.unsplash.com/photo-1617033480749-59eb6646b285?q=80&w=800' },
            { name: 'Dây chuyền', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800' },
            { name: 'Charm hành tinh', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800' }
          ].map((cat, i) => (
            <Link to={`/products?category=${cat.name}`} key={i} className="group relative aspect-[4/6] rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
              <div className="absolute inset-0 flex flex-col justify-end p-12 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity">
                <h3 className="text-3xl font-serif font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-white/70 uppercase tracking-[0.3em] font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">Khám phá ngay</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="celestial-card p-12 md:p-24 relative overflow-hidden text-center max-w-5xl mx-auto">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-moon-gold/20 to-transparent" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <Sparkles className="w-8 h-8 text-moon-gold/40 mx-auto mb-10" />
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-moon-text mb-12 leading-tight italic">
              {settings?.philosophyTitle || "Mỗi tuyệt phẩm Một mảnh hồn tinh tú."}
            </h2>
            <p className="text-xl text-moon-text/60 max-w-2xl mx-auto leading-relaxed font-medium italic font-serif">
              {settings?.philosophyText || "LUNA DREAM không chỉ bán trang sức bạc. Chúng tôi trao gửi những bùa hộ mệnh từ vũ trụ, để nàng luôn cảm thấy sự dẫn lối của ánh trăng và sức mạnh từ những hành tinh xa xôi."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="max-w-7xl mx-auto px-6 py-10 border-t border-lavender-accent/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { icon: ShieldCheck, title: 'Bạc 925 Cao Cấp', desc: 'Cam kết chất lượng tinh khiết' },
            { icon: Truck, title: 'Giao Hàng Thần Tốc', desc: 'Đóng gói tinh xảo, an toàn' },
            { icon: RotateCcw, title: 'Đổi Trả Dễ Dàng', desc: '7 ngày trải nghiệm tuyệt phẩm' },
            { icon: Sparkles, title: 'Bảo Hành Trọn Đời', desc: 'Miễn phí làm sáng vĩnh cửu' }
          ].map((item, i) => (
            <div key={i} className="text-center group">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 group-hover:shadow-xl transition-all duration-500 border border-lavender-accent/20">
                <item.icon className="w-8 h-8 text-moon-gold/70" />
              </div>
              <h4 className="text-sm font-bold text-moon-text uppercase tracking-widest mb-2">{item.title}</h4>
              <p className="text-xs text-moon-text/50 italic">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <div className="celestial-card p-12 md:p-20 bg-gradient-to-br from-moon-text/95 via-moon-text to-lavender-deep relative overflow-hidden">
          {/* Enhanced Animated Background */}
          <div className="absolute inset-0 z-0">
            {/* Glowing Nebula */}
            <motion.div 
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.5, 0.3],
                x: [0, 50, 0]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-moon-gold/10 rounded-full blur-[120px]" 
            />
            <motion.div 
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.4, 0.2],
                x: [0, -40, 0]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-1/2 -left-1/4 w-[500px] h-[500px] bg-lavender-accent/15 rounded-full blur-[100px]" 
            />
            
            {/* Soft Pulsing Moon */}
            <div className="absolute bottom-[-10%] left-[-5%] opacity-20 rotate-[15deg]">
              <motion.div
                animate={{ 
                  filter: ["drop-shadow(0 0 10px rgba(255,255,255,0.2))", "drop-shadow(0 0 30px rgba(234,179,8,0.3))", "drop-shadow(0 0 10px rgba(255,255,255,0.2))"],
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                <Moon className="w-64 h-64 text-white" />
              </motion.div>
            </div>

            {/* Twinkling Stars Grid */}
            <div className="absolute inset-0">
              {[...Array(25)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: Math.random() * 100 + "%", 
                    y: Math.random() * 100 + "%",
                    scale: Math.random() * 0.5 + 0.3,
                    opacity: Math.random()
                  }}
                  animate={{ 
                    opacity: [0.2, 0.8, 0.2],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{ 
                    duration: Math.random() * 3 + 2, 
                    repeat: Infinity,
                    delay: Math.random() * 5
                  }}
                  className="absolute"
                >
                  <Star className={`text-moon-gold fill-current ${i % 3 === 0 ? 'w-1 h-1' : 'w-0.5 h-0.5'}`} />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">Nhận thông báo mới từ LUNA DREAM</h2>
              <p className="text-white/70 mb-10 italic">Hãy để những tin tức từ vũ trụ tìm đến nàng. Nhận thông tin sớm nhất về các bộ sưu tập tinh tú mới.</p>
              
              <form className="flex flex-col md:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
                <div className="flex-1 relative group">
                  <input 
                    type="email" 
                    placeholder="Email của Nàng..." 
                    className="w-full bg-white/5 border border-white/10 rounded-full px-8 py-5 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/10 focus:border-moon-gold/50 transition-all font-medium backdrop-blur-sm"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-moon-gold/30 to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500" />
                </div>
                <button className="bg-white text-moon-text px-10 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-moon-gold hover:text-white transition-all shadow-[0_10px_30px_rgba(0,0,0,0.2)] active:scale-95 group overflow-hidden relative">
                  <span className="relative z-10">Đăng ký ngay</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
