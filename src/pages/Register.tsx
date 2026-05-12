import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Moon, Star, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { auth, db } from '../services/firebase';
import { motion } from 'motion/react';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: name });
      
      // Save profile to firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name,
        role: 'customer'
      });

      navigate('/');
    } catch (err: any) {
      setError('Không thể tạo tài khoản. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-24 relative overflow-hidden">
      <div className="absolute top-40 right-20 text-moon-gold/10"><Moon className="w-64 h-64 fill-current" /></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="celestial-card p-10 md:p-14 max-w-lg w-full relative z-10 bg-white/90 border border-lavender-accent/40 shadow-[0_32px_120px_rgba(147,149,211,0.1)]"
      >
        <h1 className="text-4xl font-bold font-serif text-center text-moon-text mb-4">Tham gia cùng LUNA DREAM</h1>
        <p className="text-center text-moon-text/70 mb-10 font-bold italic">Gia nhập cộng đồng yêu giấc mơ của phái đẹp</p>

        {error && (
          <div className="bg-red-50 text-red-500 text-sm px-6 py-4 rounded-2xl mb-8 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Tên của nàng"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-lavender-soft/60 border border-lavender-accent/30 rounded-2xl px-12 py-5 text-sm focus:border-moon-gold outline-none transition-all shadow-inner"
              required
            />
            <User className="w-5 h-5 text-moon-text/30 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>

          <div className="relative">
            <input
              type="email"
              placeholder="Email nhận thông tin"
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
              placeholder="Mật khẩu bảo mật"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-lavender-soft/60 border border-lavender-accent/30 rounded-2xl px-12 py-5 text-sm focus:border-moon-gold outline-none transition-all shadow-inner"
              required
              minLength={6}
            />
            <Lock className="w-5 h-5 text-moon-text/30 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary h-16 flex items-center justify-center gap-3 text-lg"
          >
            {loading ? 'Đang tạo...' : 'Bắt đầu ngay'} <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="text-center text-sm font-medium text-moon-text/40 mt-12">
          Nàng đã có tài khoản? <Link to="/login" className="text-moon-gold hover:underline font-bold">Đăng nhập</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
