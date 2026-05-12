import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <motion.div
      whileHover={{ y: -12, scale: 1.02 }}
      className="group celestial-card overflow-hidden bg-white/70 hover:bg-white border-lavender-accent/20 hover:border-lavender-accent/50 shadow-md hover:shadow-xl"
    >
      <div className="relative aspect-[4/5] overflow-hidden m-5 rounded-[2rem] shadow-sm">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-moon-text/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-5">
          <Link
            to={`/product/${product.id}`}
            className="p-4 bg-white/90 backdrop-blur-md rounded-full text-moon-text hover:bg-moon-text hover:text-white transition-all duration-300 shadow-xl"
          >
            <Eye className="w-6 h-6" />
          </Link>
          <button
            onClick={() => addToCart(product, 1, product.sizes[0])}
            className="p-4 bg-moon-text text-white rounded-full hover:bg-black hover:scale-110 transition-all duration-300 shadow-xl"
          >
            <ShoppingCart className="w-6 h-6" />
          </button>
        </div>
        {product.highlighted && (
          <div className="absolute top-4 left-4 bg-moon-gold text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1">
            <Star className="w-2.5 h-2.5 fill-current" />
            Bán chạy
          </div>
        )}
      </div>
      
      <div className="px-6 pb-6 pt-2">
        <p className="text-[10px] uppercase tracking-[0.2em] text-moon-text/60 font-bold mb-2">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-serif font-bold text-moon-text mb-2 group-hover:text-black transition-colors truncate">
            {product.name}
          </h3>
        </Link>
        <p className="text-xl font-bold text-moon-gold">
          {product.price.toLocaleString('vi-VN')} ₫
        </p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
