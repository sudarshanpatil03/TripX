import { motion } from 'motion/react';
import { useOutletContext, useNavigate } from 'react-router';
import { ArrowLeft, ArrowRight, UserCircle2, CheckCircle2, Coins } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTrips } from '../../context/TripContext';
import { calculateBalances, calculateSettlements } from '../../utils/settlements';
import { fadeInUp, staggerContainer } from '../../animations/presets';
import AnimatedButton from '../../components/AnimatedButton';
import { useState } from 'react';

export default function Balances() {
  const { trip } = useOutletContext();
  const { user } = useAuth();
  const { recordPayment } = useTrips();
  const navigate = useNavigate();
  const [settling, setSettling] = useState(null);

  if (!trip) return null;

  const expenses = trip.expenses || [];
  const members = trip.trip_members || [];

  const balances = calculateBalances(expenses, members);
  const settlements = calculateSettlements(balances);

  const myBalance = balances[user.id] || 0;
  
  const myDebts = settlements.filter(s => s.from === user.id);
  const myCredits = settlements.filter(s => s.to === user.id);
  const otherSettlements = settlements.filter(s => s.from !== user.id && s.to !== user.id);

  const getMemberName = (userId) => {
    const m = members.find(m => m.user_id === userId);
    return m?.users?.name || 'Someone';
  };

  const getMemberAvatar = (userId) => {
    const m = members.find(m => m.user_id === userId);
    return m?.users?.avatar_url;
  };

  const handleSettle = async (settlement) => {
    if (!window.confirm(`Record a payment of ₹${settlement.amount} to ${getMemberName(settlement.to)}?`)) return;
    
    setSettling(`${settlement.from}-${settlement.to}`);
    try {
      await recordPayment(trip.id, settlement.from, settlement.to, settlement.amount);
      // It will auto-refresh via TripContext
    } catch (err) {
      console.error(err);
      alert("Failed to record payment");
    } finally {
      setSettling(null);
    }
  };

  const renderSettlementCard = (settlement, isMyDebt = false) => {
    const fromName = settlement.from === user.id ? 'You' : getMemberName(settlement.from);
    const toName = settlement.to === user.id ? 'You' : getMemberName(settlement.to);
    
    return (
      <motion.div
        key={`${settlement.from}-${settlement.to}`}
        variants={fadeInUp}
        style={{
          background: 'var(--color-surface)',
          padding: 'var(--space-4)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-border)', overflow: 'hidden', margin: '0 auto var(--space-1)' }}>
                {getMemberAvatar(settlement.from) ? (
                  <img src={getMemberAvatar(settlement.from)} alt={fromName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <UserCircle2 size={40} color="var(--color-text-muted)" />
                )}
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>{fromName}</div>
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-text)' }}>₹{settlement.amount}</div>
              <ArrowRight size={16} color="var(--color-text-muted)" style={{ margin: '4px 0' }} />
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-border)', overflow: 'hidden', margin: '0 auto var(--space-1)' }}>
                {getMemberAvatar(settlement.to) ? (
                  <img src={getMemberAvatar(settlement.to)} alt={toName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <UserCircle2 size={40} color="var(--color-text-muted)" />
                )}
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>{toName}</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {(isMyDebt || settlement.to === user.id || trip.trip_members.find(m => m.user_id === user.id)?.role === 'owner') && (
          <AnimatedButton 
            variant={isMyDebt ? 'primary' : 'secondary'}
            onClick={() => handleSettle(settlement)}
            loading={settling === `${settlement.from}-${settlement.to}`}
            style={{ padding: '8px 12px', fontSize: 'var(--font-size-sm)', display: 'flex', justifyContent: 'center' }}
          >
            <CheckCircle2 size={16} style={{ marginRight: 8 }} />
            {isMyDebt ? 'Settle Up Now' : 'Mark as Settled'}
          </AnimatedButton>
        )}
      </motion.div>
    );
  };

  return (
    <div className="page-content" style={{ padding: 'var(--space-4)', paddingBottom: 'calc(var(--nav-height) + var(--space-6))' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <button onClick={() => navigate(-1)} className="header__back">
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>Balances & Settlements</h1>
      </header>

      {/* My Summary */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate" style={{ marginBottom: 'var(--space-8)' }}>
        <div style={{ 
          background: myBalance === 0 ? 'var(--color-surface)' : (myBalance > 0 ? 'var(--color-success-bg)' : 'var(--color-danger-bg)'),
          padding: 'var(--space-6)', 
          borderRadius: 'var(--radius-lg)', 
          textAlign: 'center',
          border: '1px solid',
          borderColor: myBalance === 0 ? 'var(--color-border)' : (myBalance > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)')
        }}>
          <h2 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>Your Balance</h2>
          
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, fontFamily: 'var(--font-display)', color: myBalance === 0 ? 'var(--color-text)' : (myBalance > 0 ? 'var(--color-success)' : 'var(--color-danger)') }}>
            {myBalance > 0 ? '+' : (myBalance < 0 ? '-' : '')}₹{Math.abs(myBalance)}
          </div>
          
          <p style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--color-text)' }}>
            {myBalance === 0 ? "You're all settled up!" : (myBalance > 0 ? "You are owed money overall." : "You owe money overall.")}
          </p>
        </div>
      </motion.div>

      {settlements.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: 'var(--space-8) 0', color: 'var(--color-text-muted)' }}>
          <Coins size={48} style={{ opacity: 0.2, margin: '0 auto var(--space-4)' }} />
          <p>No debts to settle!</p>
          <p style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-2)' }}>All expenses are perfectly balanced.</p>
        </motion.div>
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          
          {myDebts.length > 0 && (
            <div>
              <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--color-danger)' }}>You Owe</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {myDebts.map(s => renderSettlementCard(s, true))}
              </div>
            </div>
          )}

          {myCredits.length > 0 && (
            <div>
              <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--color-success)' }}>You Are Owed</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {myCredits.map(s => renderSettlementCard(s, false))}
              </div>
            </div>
          )}

          {otherSettlements.length > 0 && (
            <div>
              <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>Other Group Debts</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {otherSettlements.map(s => renderSettlementCard(s, false))}
              </div>
            </div>
          )}

        </motion.div>
      )}
    </div>
  );
}
