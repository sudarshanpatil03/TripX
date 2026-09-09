import { motion } from 'motion/react';
import { useOutletContext, useNavigate } from 'react-router';
import { Users, Receipt, Calendar, Wallet, ChevronRight, Settings, MapPin } from 'lucide-react';
import ProgressRing from '../../components/ProgressRing';
import { useTrips } from '../../context/TripContext';
import { useAuth } from '../../context/AuthContext';
import { formatDateShort } from '../../data/mockData';
import { fadeInUp, staggerContainer } from '../../animations/presets';

export default function TripOverview() {
  const { trip } = useOutletContext();
  const { getTripStats } = useTrips();
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = getTripStats(trip.id);

  // Calculate "My Summary" based on current user
  let userPaid = 0;
  let userShare = 0;
  
  if (trip.expenses) {
    trip.expenses.forEach(exp => {
      if (exp.paid_by === user.id) {
        userPaid += Number(exp.amount);
      }
      if (exp.expense_splits) {
        const split = exp.expense_splits.find(s => s.user_id === user.id);
        if (split) {
          userShare += Number(split.amount_owed);
        }
      }
    });
  }
  
  const netBalance = userPaid - userShare;
  
  // Dummy data for places progress
  const placesPlanned = 15;
  const placesVisited = 9;
  const placesProgress = Math.round((placesVisited / placesPlanned) * 100) || 0;

  // Recent expenses (limit to 2)
  const recentExpenses = [...(trip.expenses || [])]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 2);

  return (
    <div className="page-content" style={{ padding: 'var(--space-4)' }}>
      
      {/* Cover Card — premium shimmer + glass badge */}
      <motion.div className="shimmer-card glow-hover" whileHover={{ y:-4 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ borderRadius: 'var(--radius-2xl)', overflow: 'hidden', position: 'relative', height: 190, marginBottom: 'var(--space-6)', boxShadow: 'var(--shadow-lg)', border:'1px solid var(--glass-border)' }}>
        <img src={trip.cover_image_url || '/images/kashi.png'} alt={trip.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%)' }} />
        
        {/* Settings Icon overlay */}
        <motion.button 
          onClick={() => navigate(`/trip/${trip.id}/settings`)}
          style={{ position: 'absolute', top: 'var(--space-4)', right: 'var(--space-4)', color: 'white', background: 'rgba(0,0,0,0.3)', border: 'none', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Settings size={18} />
        </motion.button>

        <div style={{ position: 'absolute', bottom: 'var(--space-4)', left: 'var(--space-4)', right: 'var(--space-4)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-1)', fontSize: 'var(--font-size-xs)', opacity: 0.9, marginBottom: 4 }}>
              <Calendar size={12} /> {formatDateShort(trip.start_date)} - {formatDateShort(trip.end_date)}
            </div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>
              <MapPin size={16} /> {trip.destination}
            </h2>
          </div>
          <div style={{ background: trip.status === 'completed' ? 'var(--color-success-bg)' : 'rgba(16, 185, 129, 0.2)', color: 'var(--color-success)', padding: '4px 10px', borderRadius: 20, fontSize: 'var(--font-size-xs)', fontWeight: 600, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            {trip.status === 'completed' ? 'Completed' : 'Ongoing'}
          </div>
        </div>
      </motion.div>

      {/* Quick Actions — NEW FEATURE */}
      <motion.div variants={fadeInUp} style={{ display:'flex', gap:8, marginBottom:'var(--space-5)', overflowX:'auto', scrollbarWidth:'none' }}>
        <button onClick={()=>navigate(`/trip/${trip.id}/expenses/add`)} style={{ flex:'0 0 auto', display:'flex', alignItems:'center', gap:6, padding:'10px 14px', borderRadius:'var(--radius-full)', background:'var(--gradient-primary)', color:'white', fontWeight:800, fontSize:'var(--font-size-sm)', boxShadow:'var(--shadow-glow-primary)' }}><Wallet size={14} /> Add Expense</button>
        <button onClick={()=>navigate(`/trip/${trip.id}/itinerary`)} style={{ flex:'0 0 auto', padding:'10px 14px', borderRadius:'var(--radius-full)', background:'var(--color-surface)', border:'1px solid var(--color-border)', fontWeight:700, fontSize:'var(--font-size-sm)' }}><Calendar size={14} style={{ marginRight:6 }} /> Itinerary</button>
        <button onClick={()=>navigate(`/trip/${trip.id}/members`)} style={{ flex:'0 0 auto', padding:'10px 14px', borderRadius:'var(--radius-full)', background:'var(--color-surface)', border:'1px solid var(--color-border)', fontWeight:700, fontSize:'var(--font-size-sm)' }}><Users size={14} style={{ marginRight:6 }} /> Members</button>
      </motion.div>

      {/* Stats Bento — UPGRADED */}
      <motion.div variants={fadeInUp} className="bento-grid" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="stat-bento" style={{ textAlign:'center' }}><div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, color:'var(--color-primary)', fontSize:'var(--font-size-xs)', fontWeight:700, letterSpacing:'0.04em', textTransform:'uppercase' }}><Users size={14} /> Members</div><div style={{ fontWeight:800, fontSize:'1.4rem', marginTop:6 }}>{stats.memberCount}</div></div>
        <div className="stat-bento" style={{ textAlign:'center' }}><div style={{ color:'var(--color-text-secondary)', fontSize:'var(--font-size-xs)', fontWeight:700, letterSpacing:'0.04em', textTransform:'uppercase' }}>Budget</div><div style={{ fontWeight:800, fontSize:'1.2rem', marginTop:6 }}>₹{Number(trip.estimated_budget||0).toLocaleString('en-IN')}</div></div>
        <div className="stat-bento" style={{ textAlign:'center', gridColumn:'span 2' }}><div style={{ color:'var(--color-text-secondary)', fontSize:'var(--font-size-xs)', fontWeight:700, letterSpacing:'0.04em', textTransform:'uppercase' }}>Spent • Progress</div><div style={{ fontWeight:800, fontSize:'1.2rem', marginTop:6 }}>₹{Number(stats.totalExpense||0).toLocaleString('en-IN')}</div><div style={{ height:6, background:'var(--color-border)', borderRadius:999, marginTop:8, overflow:'hidden' }}><motion.div initial={{ width:0 }} animate={{ width: `${Math.min(100, trip.estimated_budget ? (stats.totalExpense/Number(trip.estimated_budget))*100 : 55)}%` }} transition={{ duration:0.8 }} style={{ height:'100%', background:'var(--gradient-primary)' }} /></div></div>
      </motion.div>

      {/* My Summary */}
      <motion.div variants={fadeInUp} style={{ marginBottom: 'var(--space-6)' }}>
        <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>My Summary</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--color-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', marginBottom: 4 }}>You Paid</div>
            <div style={{ fontWeight: 700, fontSize: 'var(--font-size-md)' }}>₹{userPaid.toFixed(0)}</div>
          </div>
          <div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', marginBottom: 4 }}>Your Share</div>
            <div style={{ fontWeight: 700, fontSize: 'var(--font-size-md)' }}>₹{userShare.toFixed(0)}</div>
          </div>
          <div>
            <div style={{ color: netBalance >= 0 ? 'var(--color-success)' : 'var(--color-danger)', fontSize: 'var(--font-size-xs)', marginBottom: 4 }}>
              {netBalance >= 0 ? 'You Get' : 'You Owe'}
            </div>
            <div style={{ fontWeight: 700, fontSize: 'var(--font-size-md)', color: netBalance >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
              ₹{Math.abs(netBalance).toFixed(0)}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Trip Progress */}
      <motion.div variants={fadeInUp} style={{ marginBottom: 'var(--space-6)' }}>
        <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Trip Progress</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', background: 'var(--color-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <div style={{ position: 'relative', width: 64, height: 64 }}>
            <ProgressRing progress={placesProgress} size={64} strokeWidth={6} color="var(--color-primary)" />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 'var(--font-size-xs)' }}>
              {placesProgress}%
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Places Planned</span>
              <span style={{ fontWeight: 600 }}>{placesPlanned}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Places Visited</span>
              <span style={{ fontWeight: 600 }}>{placesVisited}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Remaining</span>
              <span style={{ fontWeight: 600 }}>{placesPlanned - placesVisited}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Expenses */}
      <motion.div variants={fadeInUp} style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
          <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700 }}>Recent Expenses</h3>
          <span onClick={() => navigate(`/trip/${trip.id}/expenses`)} style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-xs)', fontWeight: 600, cursor: 'pointer' }}>View All</span>
        </div>
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          {recentExpenses.length === 0 ? (
            <div style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>No expenses yet.</div>
          ) : (
            recentExpenses.map((expense, idx) => (
              <div key={expense.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-4)', borderBottom: idx === recentExpenses.length - 1 ? 'none' : '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-primary-bg)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Receipt size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{expense.name}</div>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                      Paid by {trip.trip_members?.find(m => m.user_id === expense.paid_by)?.users?.name || 'Someone'}
                    </div>
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)' }}>₹{expense.amount}</div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Today's Plan */}
      <motion.div className="todays-plan" variants={fadeInUp} style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
          <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700 }}>Today's Plan</h3>
          <span onClick={() => navigate(`/trip/${trip.id}/itinerary`)} style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', cursor: 'pointer' }}><ChevronRight size={16} /></span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-4)', background: 'var(--color-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-xs)', fontWeight: 600, minWidth: 45 }}>
            10:00 AM
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)' }} />
              <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>Kashi Vishwanath Temple</div>
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  );
}