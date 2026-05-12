import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, ChevronDown, PackageOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ProductCard from '../components/ProductCard';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../services/firebase';
import { Product } from '../types';

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [categoryFilter, setCategoryFilter] = useState<string>(searchParams.get('category') || 'All');
  const [priceRange, setPriceRange] = useState<number>(1000000);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = ['All', 'Nhẫn tinh tú', 'Dây chuyền', 'Charm hành tinh'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = collection(db, 'products');
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setAllProducts(data);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = allProducts;

    if (categoryFilter !== 'All') {
      result = result.filter(p => p.category === categoryFilter);
    }

    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    result = result.filter(p => p.price <= priceRange);

    setFilteredProducts(result);
  }, [categoryFilter, searchTerm, priceRange, allProducts]);

  useEffect(() => {
    const cat = searchParams.get('category') || 'All';
    const q = searchParams.get('q') || '';
    setCategoryFilter(cat);
    setSearchTerm(q);
  }, [searchParams]);

  if (loading) return <div className="py-40 text-center text-moon-text italic font-serif text-2xl animate-pulse">LUNA DREAM đang mang tới những tuyệt phẩm tinh tú...</div>;

  const handleCategoryChange = (cat: string) => {
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    if (val) {
      searchParams.set('q', val);
    } else {
      searchParams.delete('q');
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className={`md:w-64 space-y-12 ${isFilterOpen ? 'block' : 'hidden md:block'} celestial-card p-10 bg-white/40`}>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-moon-text mb-6">Tìm kiếm</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm sản phẩm..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-white/40 border border-moon-text/5 rounded-[1.2rem] px-10 py-3 text-sm focus:border-moon-gold outline-none transition-all"
              />
              <Search className="w-4 h-4 text-moon-text/30 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-moon-text mb-6">Danh mục</h3>
            <div className="space-y-4">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`block text-sm transition-colors font-medium ${
                    categoryFilter === cat ? 'text-black font-bold scale-105' : 'text-moon-text/50 hover:text-black'
                  }`}
                >
                  {cat === 'All' ? 'Tất cả' : cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-moon-text mb-6">
              Khoảng giá (Dưới {priceRange.toLocaleString()} ₫)
            </h3>
            <input
              type="range"
              min="0"
              max="1000000"
              step="50000"
              value={priceRange}
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
              className="w-full h-1 bg-lavender-deep rounded-lg appearance-none cursor-pointer accent-moon-gold"
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-16">
            <h1 className="text-4xl font-serif font-bold text-moon-text">
              {categoryFilter === 'All' ? 'Tất cả sản phẩm' : categoryFilter}
              <span className="text-sm font-bold text-moon-text/40 ml-4 font-sans">
                ({filteredProducts.length})
              </span>
            </h1>
            
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden flex items-center gap-2 btn-secondary px-6 py-2 rounded-full"
            >
              <Filter className="w-4 h-4" /> Bộ lọc
            </button>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              <AnimatePresence>
                {filteredProducts.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-32 celestial-card bg-lavender-soft/60 border border-lavender-accent/30 shadow-lg">
              <div className="mb-6 flex justify-center">
                <PackageOpen className="w-16 h-16 text-moon-text/10" />
              </div>
              <h3 className="text-xl font-medium text-moon-text font-serif italic mb-2">Chưa thấy mẫu nào phù hợp</h3>
              <p className="text-moon-text/40">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm nàng nhé!</p>
              <button 
                onClick={() => {setSearchTerm(''); setCategoryFilter('All'); setPriceRange(1000000);}}
                className="mt-8 text-moon-gold font-bold uppercase tracking-widest text-[10px] hover:underline"
              >
                Đặt lại tất cả filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
