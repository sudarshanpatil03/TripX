import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { springs } from '../animations/presets';
import { getAIResponse } from '../services/aiService';
import './chatbot.css';

export default function GlobalChatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { id: 'welcome', sender: 'ai', text: 'Hi! I am your TripX AI Assistant. How can I help you plan your perfect trip today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: userMessage }]);
    
    // Trigger AI response
    setIsTyping(true);
    const aiText = await getAIResponse(userMessage);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: aiText }]);
  };

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={springs.gentle}
            style={{
              position: 'fixed',
              bottom: 'calc(var(--nav-height) + var(--space-4))',
              left: 'var(--space-4)',
              width: 350,
              height: 500,
              maxHeight: '70vh',
              maxWidth: 'calc(100vw - var(--space-8))',
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              zIndex: 10000
            }}
          >
            {/* Header */}
            <div style={{ 
              background: 'linear-gradient(135deg, var(--color-primary), #8b5cf6)', 
              padding: 'var(--space-4)', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              color: 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Sparkles size={20} />
                <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, margin: 0 }}>TripX AI</h3>
              </div>
              <button 
                onClick={onClose}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
              >
                <X size={16} />
              </button>
            </div>
            
            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', background: 'var(--color-bg)' }}>
              {messages.map((msg) => {
                const isAI = msg.sender === 'ai';
                return (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ 
                      display: 'flex', 
                      flexDirection: isAI ? 'row' : 'row-reverse', 
                      gap: 'var(--space-2)', 
                      alignItems: 'flex-end' 
                    }}
                  >
                    {isAI && (
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), #8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bot size={16} />
                      </div>
                    )}
                    
                    <div style={{
                      maxWidth: isAI ? '90%' : '75%',
                      padding: '10px 14px',
                      background: isAI ? 'var(--color-surface)' : 'var(--color-primary)',
                      color: isAI ? 'var(--color-text)' : 'white',
                      borderRadius: 'var(--radius-lg)',
                      borderBottomRightRadius: !isAI ? 4 : 'var(--radius-lg)',
                      borderBottomLeftRadius: isAI ? 4 : 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-sm)',
                      fontSize: 'var(--font-size-sm)',
                      border: isAI ? '1px solid var(--color-border)' : 'none',
                      lineHeight: 1.4,
                      overflowX: 'auto'
                    }} className={isAI ? "markdown-content" : ""}>
                      {isAI ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.text}
                        </ReactMarkdown>
                      ) : (
                        msg.text
                      )}
                    </div>
                  </motion.div>
                );
              })}
              
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-end' }}
                >
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), #8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bot size={16} />
                  </div>
                  <div style={{ padding: '12px 14px', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', borderBottomLeftRadius: 4, display: 'flex', gap: 4, alignItems: 'center', border: '1px solid var(--color-border)' }}>
                    <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-text-muted)' }} />
                    <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-text-muted)' }} />
                    <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-text-muted)' }} />
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <form onSubmit={handleSend} style={{ padding: 'var(--space-3)', borderTop: '1px solid var(--color-border)', display: 'flex', gap: 'var(--space-2)', background: 'var(--color-surface)' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isTyping}
                style={{ flex: 1, padding: '10px 14px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', outline: 'none', fontSize: 'var(--font-size-sm)' }}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isTyping}
                style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-primary)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed', opacity: input.trim() && !isTyping ? 1 : 0.5 }}
              >
                <Send size={16} style={{ marginLeft: 2 }} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
