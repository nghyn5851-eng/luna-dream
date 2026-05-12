import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, Star, Heart, ArrowLeft, Truck, RotateCcw, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { doc, getDoc, collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../services/firebase';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const productData = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(productData);
          if (productData.sizes && productData.sizes.length > 0) {
            setSelectedSize(productData.sizes[0]);
          }

          // Fetch related
          try {
            const relatedQuery = query(
              collection(db, 'products'),
              where('category', '==', productData.category),
              limit(5)
            );
            const relatedSnap = await getDocs(relatedQuery);
            const related = relatedSnap.docs
              .map(d => ({ id: d.id, ...d.data() } as Product))
              .filter(p => p.id !== id)
              .slice(0, 4);
            setRelatedProducts(related);
          } catch (relatedErr) {
            console.warn('Error fetching related products:', relatedErr);
          }
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `products/${id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="py-40 text-center text-moon-text italic font-serif text-2xl animate-pulse">LUNA DREAM đang tìm tuyệt phẩm cho Nàng...</div>;

  if (!product) {
    return <div className="py-32 text-center text-moon-text font-serif italic text-2xl">Không tìm thấy giấc mơ này...</div>;
  }

  return (
    <div className="pb-32">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link to="/products" className="flex items-center gap-2 text-moon-text/60 hover:text-black transition-colors mb-12 font-bold uppercase tracking-widest text-xs">
          <ArrowLeft className="w-4 h-4" /> Tuyệt phẩm khác
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden celestial-card p-4 bg-white/40">
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-[2rem]" />
            </div>
            {/* Thumbnails (Mock) */}
            <div className="grid grid-cols-4 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden celestial-card p-2 cursor-pointer border-2 border-transparent hover:border-moon-gold transition-all bg-white/40">
                  <img src={product.imageUrl} alt="" className="w-full h-full object-cover opacity-60 hover:opacity-100 rounded-xl" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-12">
              <p className="text-moon-gold text-[10px] font-bold uppercase tracking-[0.3em] mb-4">{product.category}</p>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-moon-text mb-8 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-8">
                <p className="text-4xl font-bold text-moon-gold font-sans">{product.price.toLocaleString()} ₫</p>
                <div className="flex items-center gap-1 text-moon-gold">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  <span className="text-moon-text/60 text-xs ml-3 font-bold uppercase tracking-widest">(2.4k reviews)</span>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <p className="text-moon-text/90 leading-relaxed text-lg font-medium italic font-serif">
                {product.description}
              </p>
            </div>

            <div className="space-y-10 mb-16">
              {/* Size Selector */}
              <div>
                <div className="flex justify-between mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-moon-text">Kích thước</h4>
                  <button className="text-xs text-moon-gold underline font-bold">Quy chuẩn size</button>
                </div>
                <div className="flex flex-wrap gap-4">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[70px] h-14 rounded-2xl flex items-center justify-center text-sm font-bold transition-all ${
                        selectedSize === size 
                        ? 'bg-moon-text text-white shadow-lg scale-105' 
                        : 'bg-white/40 border border-moon-text/10 text-moon-text hover:border-moon-text'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex flex-wrap gap-6 items-center">
                <div className="flex items-center bg-white/40 border border-moon-text/5 rounded-2xl h-16 p-2">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 text-moon-text/40 hover:text-black transition-colors"
                  ><Minus className="w-4 h-4" /></button>
                  <span className="w-10 text-center text-moon-text font-bold text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 text-moon-text/40 hover:text-black transition-colors"
                  ><Plus className="w-4 h-4" /></button>
                </div>
                <button
                  onClick={() => addToCart(product, quantity, selectedSize)}
                  className="btn-primary flex-1 h-16 flex items-center justify-center gap-3 text-lg"
                >
                  <ShoppingCart className="w-5 h-5" /> Cho vào giỏ
                </button>
                <button className="h-16 w-16 celestial-card flex items-center justify-center text-moon-text/30 hover:text-red-400 transition-colors bg-white/40">
                  <Heart className="w-7 h-7" />
                </button>
              </div>
            </div>

            {/* Features/Info Tabs */}
            <div className="border-t border-moon-text/5 pt-12 space-y-4">
              <div className="flex items-center gap-4 py-5 px-8 rounded-2xl bg-white/40 border border-moon-text/5">
                <Truck className="w-5 h-5 text-moon-gold" />
                <span className="text-sm font-bold text-moon-text/80">Giao hàng miễn phí toàn quốc cho đơn từ 1.000k</span>
              </div>
              <div className="flex items-center gap-4 py-5 px-8 rounded-2xl bg-white/40 border border-moon-text/5">
                <RotateCcw className="w-5 h-5 text-moon-gold" />
                <span className="text-sm font-bold text-moon-text/80">Bảo hành 7 ngày cho mọi lỗi từ nhà sản xuất</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-40">
          <h2 className="text-3xl font-serif font-bold text-moon-text mb-16 text-center italic">Có thể bạn sẽ yêu</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
