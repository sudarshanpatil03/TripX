import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, User } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { springs } from '../animations/presets';

export default function TripChat({ tripId, isOpen, onClose }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Fetch messages
  const fetchMessages = async () => {
    if (!tripId) return;
    const { data, error } = await supabase
      .from('trip_messages')
      .select('*')
      .eq('trip_id', tripId)
      .order('created_at', { ascending: true });
      
    if (!error && data) {
      setMessages(data);
    }
  };

  // Poll for messages when open to simulate realtime (avoids needing to manually enable Realtime in Supabase dash)
  useEffect(() => {
    if (!isOpen) return;
    
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [isOpen, tripId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    
    setSending(true);
    const tempMsg = {
      id: 'temp-' + Date.now(),
      trip_id: tripId,
      user_id: user.id,
      message: newMessage,
      created_at: new Date().toISOString()
    };
    
    // Optimistic UI update
    setMessages(prev => [...prev, tempMsg]);
    setNewMessage('');

    const { error } = await supabase
      .from('trip_messages')
      .insert({
        trip_id: tripId,
        user_id: user.id,
        message: tempMsg.message
      });

    if (error) {
      console.error('Error sending message:', error);
      // Revert optimistic update (in a real app, we'd show an error state on the message)
      fetchMessages(); 
    }
    setSending(false);
  };

  const getInitials = (userId) => {
    // In a full app, we'd join with a profiles table to get the real name.
    // For this demo, we'll use a deterministic fallback based on the UUID.
    if (!userId) return 'U';
    return userId.substring(0, 2).toUpperCase();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 999
            }}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={springs.gentle}
            style={{
              position: 'fixed',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              maxWidth: '800px',
              height: '80vh',
              maxHeight: '600px',
              background: 'var(--color-surface)',
              borderTopLeftRadius: 'var(--radius-xl)',
              borderTopRightRadius: 'var(--radius-xl)',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.2)',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              borderTop: '1px solid var(--color-border)'
            }}
          >
            {/* Header */}
            <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-success)' }} />
                <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>Trip Chat</h3>
              </div>
              <button 
                onClick={onClose}
                style={{ background: 'var(--color-bg)', border: 'none', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text)' }}
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', background: 'var(--color-bg)' }}>
              {messages.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                  <p>No messages yet. Say hello!</p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isMe = msg.user_id === user?.id;
                  const showAvatar = i === 0 || messages[i-1].user_id !== msg.user_id;
                  
                  return (
                    <div key={msg.id} style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', gap: 'var(--space-2)', alignItems: 'flex-end', marginTop: showAvatar ? 'var(--space-2)' : 0 }}>
                      {!isMe && (
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color-primary-bg)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, visibility: showAvatar ? 'visible' : 'hidden' }}>
                          {getInitials(msg.user_id)}
                        </div>
                      )}
                      
                      <div style={{
                        maxWidth: '75%',
                        padding: '10px 14px',
                        background: isMe ? 'var(--color-primary)' : 'var(--color-surface)',
                        color: isMe ? 'white' : 'var(--color-text)',
                        borderRadius: 'var(--radius-lg)',
                        borderBottomRightRadius: isMe ? 4 : 'var(--radius-lg)',
                        borderBottomLeftRadius: !isMe ? 4 : 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-sm)',
                        fontSize: 'var(--font-size-sm)',
                        border: isMe ? 'none' : '1px solid var(--color-border)'
                      }}>
                        {msg.message}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <form onSubmit={handleSend} style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--color-border)', display: 'flex', gap: 'var(--space-2)', background: 'var(--color-surface)' }}>
              <input
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                style={{ flex: 1, padding: '12px 16px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', outline: 'none' }}
              />
              <button 
                type="submit" 
                disabled={!newMessage.trim() || sending}
                style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--color-primary)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: newMessage.trim() ? 'pointer' : 'not-allowed', opacity: newMessage.trim() ? 1 : 0.5 }}
              >
                <Send size={18} style={{ marginLeft: 2 }} />
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
