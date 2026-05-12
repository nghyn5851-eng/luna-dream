import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Sparkles, Minus, Maximize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { consultProductAI } from '../services/geminiService';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Product } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Chào Nàng! ✨ LUNA DREAM AI đây. Nàng đang tìm kiếm món trang sức tinh tú nào cho bản thân mình hôm nay? 🌙' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const q = collection(db, 'products');
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(data);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.slice(-5); // Keep last 5 messages for context
      const response = await consultProductAI(userMessage, history, products);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      console.error('Chat AI Error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Có chút trục trặc trong dải ngân hà, Nàng đợi chút nhé.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? '80px' : '500px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className={`celestial-card bg-white/95 backdrop-blur-xl border border-lavender-accent/30 shadow-2xl overflow-hidden mb-4 transition-all duration-300 ${
              isMinimized ? 'w-64' : 'w-80 md:w-96'
            }`}
          >
            {/* Header */}
            <div className="bg-moon-text p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-full">
                  <Sparkles className="w-4 h-4 text-moon-gold" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest">LUNA DREAM AI</h3>
                  <p className="text-[10px] text-white/60">Đang trực tuyến ✧</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-white/10 rounded transition-colors">
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Chat Area */}
                <div 
                  ref={scrollRef}
                  className="h-[360px] overflow-y-auto p-6 space-y-4 bg-lavender-soft/20 custom-scrollbar"
                >
                  {messages.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'user' 
                            ? 'bg-moon-text text-white rounded-tr-none shadow-md' 
                            : 'bg-white border border-lavender-accent/20 text-moon-text/80 rounded-tl-none shadow-sm'
                        }`}
                      >
                        <div className="markdown-body">
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-lavender-accent/20 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-2">
                        <div className="w-1.5 h-1.5 bg-moon-gold rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-moon-gold rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 bg-moon-gold rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-lavender-accent/10 bg-white">
                  <div className="flex items-center gap-2 bg-lavender-soft/40 border border-lavender-accent/20 rounded-full px-4 py-1">
                    <input
                      type="text"
                      placeholder="Hỏi LUNA DREAM bất kỳ điều gì..."
                      className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 outline-none"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button 
                      onClick={handleSend}
                      disabled={isLoading || !input.trim()}
                      className="p-2 bg-moon-text text-white rounded-full hover:scale-110 transition-transform disabled:opacity-50 disabled:scale-100"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className={`p-5 bg-moon-text text-white rounded-full shadow-[0_15px_60px_-15px_rgba(0,0,0,0.3)] hover:scale-110 active:scale-95 transition-all duration-300 relative group ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
      >
        <MessageCircle className="w-7 h-7" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-moon-gold rounded-full border-2 border-white animate-ping" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-moon-gold rounded-full border-2 border-white" />
        
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-moon-text text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Tư vấn tinh tú ✨
        </span>
      </button>
    </div>
  );
};

export default Chatbot;
