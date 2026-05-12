import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Moon, Star, Mail, Lock, ArrowRight, Github } from 'lucide-react';
import { auth } from '../services/firebase';
import { motion } from 'motion/react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      setError('Email hoặc mật khẩu không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err) {
      setError('Đăng nhập Google thất bại.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Decorative stars */}
      <div className="absolute top-20 left-10 text-moon/20 animate-pulse"><Star className="w-8 h-8 fill-current" /></div>
      <div className="absolute bottom-20 right-10 text-moon/20 animate-pulse delay-1000"><Star className="w-12 h-12 fill-current" /></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="celestial-card p-10 md:p-14 max-w-lg w-full relative z-10 bg-white/90 border border-lavender-accent/40 shadow-[0_32px_120px_rgba(147,149,211,0.1)]"
      >
        <div className="flex justify-center mb-10">
          <div className="relative group">
            <Moon className="w-12 h-12 text-moon-gold fill-lavender-soft group-hover:rotate-12 transition-transform duration-500" />
            <Star className="w-5 h-5 text-moon-text absolute -top-1 -right-2 animate-pulse" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-center text-moon-text mb-4">Chào mừng trở lại</h1>
        <p className="text-center text-moon-text/70 mb-10 font-bold italic">Đăng nhập để vào thế giới của LUNA DREAM</p>

        {error && (
          <div className="bg-red-50 text-red-500 text-sm px-6 py-4 rounded-2xl mb-8 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              placeholder="Email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-lavender-soft/60 border border-lavender-accent/30 rounded-2xl px-12 py-5 text-sm focus:border-moon-gold outline-none transition-all shadow-inner"
              required
            />
            <Mail className="w-5 h-5 text-moon-text/30 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-lavender-soft/60 border border-lavender-accent/30 rounded-2xl px-12 py-5 text-sm focus:border-moon-gold outline-none transition-all shadow-inner"
              required
            />
            <Lock className="w-5 h-5 text-moon-text/30 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>

          <div className="text-right">
            <a href="#" className="text-xs text-moon-text/40 hover:text-moon-gold font-bold transition-colors">Quên mật khẩu?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary h-16 flex items-center justify-center gap-3 text-lg"
          >
            {loading ? 'Đang xử lý...' : 'Đăng nhập'} <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-moon-text/10"></div>
          </div>
          <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
            <span className="bg-lavender-soft px-6 text-moon-text/40">Hoặc tiếp tục với</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button onClick={handleGoogleLogin} className="celestial-card py-4 flex justify-center items-center gap-2 hover:bg-white transition-colors bg-lavender-soft/40 border border-lavender-accent/10">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            <span className="text-sm font-bold text-moon-text">Google</span>
          </button>
          <button className="celestial-card py-4 flex justify-center items-center gap-2 hover:bg-white transition-colors bg-lavender-soft/40 border border-lavender-accent/10">
            <Github className="w-5 h-5 text-moon-text" />
            <span className="text-sm font-bold text-moon-text">Github</span>
          </button>
        </div>

        <p className="text-center text-sm font-bold text-moon-text/60 mt-12">
          Chưa có tài khoản? <Link to="/register" className="text-moon-gold hover:underline">Đăng ký ngay</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
