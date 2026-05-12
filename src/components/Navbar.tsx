import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Moon, Star, LogOut, Menu, X, LayoutDashboard, UserPen, History, ShieldCheck, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { auth } from '../services/firebase';

const Navbar: React.FC = () => {
  const { user, profile, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => auth.signOut();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Tất cả', path: '/products' },
    { name: 'Nhẫn tinh tú', path: '/products?category=Nhẫn tinh tú' },
    { name: 'Dây chuyền', path: '/products?category=Dây chuyền' },
    { name: 'Charm hành tinh', path: '/products?category=Charm hành tinh' },
    { name: 'Về LUNA DREAM', path: '#about', isHash: true },
  ];

  const handleNavLinkClick = (link: any) => {
    if (link.isHash) {
      if (location.pathname === '/') {
        const el = document.getElementById(link.path.replace('#', ''));
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate('/' + link.path);
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/40 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Moon className="w-8 h-8 text-moon-text fill-lavender-soft group-hover:rotate-12 transition-transform duration-500" />
            <Star className="w-3 h-3 text-moon-gold absolute -top-1 -right-1 animate-pulse" />
          </div>
          <span className="text-2xl font-serif font-bold tracking-widest text-moon-text">LUNA DREAM</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            link.isHash ? (
              <button
                key={link.name}
                onClick={() => handleNavLinkClick(link)}
                className="text-xs font-bold uppercase tracking-widest transition-colors duration-300 hover:text-black text-moon-text/70"
              >
                {link.name}
              </button>
            ) : (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 hover:text-black ${
                  location.pathname + location.search === link.path ? 'text-black border-b border-moon-gold' : 'text-moon-text/70'
                }`}
              >
                {link.name}
              </Link>
            )
          ))}
        </div>

        <div className="flex items-center gap-4">
          <AnimatePresence>
            {isSearchOpen && (
              <motion.form
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 240, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                onSubmit={handleSearch}
                className="hidden lg:flex items-center relative overflow-hidden"
              >
                <input
                  type="text"
                  placeholder="Tìm kiếm vì sao..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-lavender-soft/40 border border-lavender-accent/20 rounded-full px-10 py-2 text-xs focus:outline-none focus:border-moon-gold transition-all"
                  autoFocus
                />
                <Search className="w-4 h-4 text-moon-text/40 absolute left-4 top-1/2 -translate-y-1/2" />
                <button type="button" onClick={() => setIsSearchOpen(false)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-3 h-3 text-moon-text/40 hover:text-red-400 transition-colors" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {!isSearchOpen && (
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-moon-text hover:text-moon-gold transition-colors hidden lg:block"
            >
              <Search className="w-6 h-6" />
            </button>
          )}

          <Link to="/cart" className="relative p-2 text-moon-text hover:text-black transition-colors">
            <ShoppingCart className="w-6 h-6" />
            {getCartCount() > 0 && (
              <span className="absolute top-0 right-0 bg-moon-text text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </Link>
          
          <div className="h-6 w-[1px] bg-moon-text/10 hidden md:block" />

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1 rounded-full hover:bg-white/40 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-moon-text text-white flex items-center justify-center text-xs font-bold shadow-md">
                  {profile?.fullName?.[0] || 'U'}
                </div>
                <span className="hidden lg:inline text-xs font-bold text-moon-text uppercase tracking-widest">{profile?.fullName}</span>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-64 celestial-card bg-white p-4 shadow-2xl z-[60]"
                  >
                    <div className="p-4 border-b border-moon-text/5 mb-2">
                      <p className="text-xs font-bold text-moon-text uppercase tracking-tighter mb-1">{profile?.fullName}</p>
                      <p className="text-[10px] text-moon-text/40 lowercase">{profile?.email}</p>
                    </div>
                    
                    <div className="space-y-1">
                      {isAdmin && (
                        <Link 
                          to="/admin" 
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-lavender-soft text-moon-gold transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-widest">Quản trị viên</span>
                        </Link>
                      )}
                      <Link 
                        to="/profile" 
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-lavender-soft text-moon-text/70 hover:text-black transition-colors"
                      >
                        <UserPen className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Hồ sơ của tôi</span>
                      </Link>
                    </div>

                    <div className="mt-4 pt-4 border-t border-moon-text/5">
                      <button 
                        onClick={() => { handleLogout(); setIsProfileOpen(false); }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-400 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Đăng xuất</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 text-sm font-medium text-moon-text hover:text-black transition-colors">
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">Đăng nhập</span>
            </Link>
          )}

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-silver">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-navy-deep border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col gap-6 p-8">
              {navLinks.map((link) => (
                link.isHash ? (
                  <button
                    key={link.name}
                    onClick={() => { handleNavLinkClick(link); setIsMenuOpen(false); }}
                    className="text-left text-xl font-serif font-bold text-moon-text hover:text-moon-gold transition-colors"
                  >
                    {link.name}
                  </button>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-xl font-serif font-bold text-moon-text hover:text-moon-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                )
              ))}
              
              <div className="h-[1px] bg-moon-text/5 my-2" />
              
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 text-lg font-medium text-moon-text/70"
                  >
                    <UserPen className="w-5 h-5 text-moon-gold" />
                    Hồ sơ của tôi
                  </Link>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 text-lg font-medium text-moon-text/70"
                    >
                      <ShieldCheck className="w-5 h-5 text-moon-gold" />
                      Quản trị hệ thống
                    </Link>
                  )}
                  <button 
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="flex items-center gap-3 text-lg font-medium text-red-400 mt-4"
                  >
                    <LogOut className="w-5 h-5" />
                    Đăng xuất
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 text-lg font-medium text-moon-text/70"
                >
                  <User className="w-5 h-5 text-moon-gold" />
                  Đăng nhập
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
