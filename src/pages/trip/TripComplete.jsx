import { motion } from 'motion/react';
import { useOutletContext, useNavigate } from 'react-router';
import { ArrowLeft, Flag, CheckCircle, User, Download, PartyPopper } from 'lucide-react';
import { useMemo, useState } from 'react';
import ThemeToggle from '../../components/ThemeToggle';
import AnimatedButton from '../../components/AnimatedButton';
import { staggerContainer, fadeInUp } from '../../animations/presets';
import { useTrips } from '../../context/TripContext';

export default function TripComplete() {
  const { trip } = useOutletContext();
  const navigate = useNavigate();
  const { markTripComplete } = useTrips();
  const [completed, setCompleted] = useState(trip?.status === 'completed');

  // Settlement Algorithm
  const settlements = useMemo(() => {
    if (!trip || !trip.expenses || !trip.trip_members) return [];

    // 1. Calculate net balances
    // balance[userId] = Total Paid - Total Owed
    const balances = {};
    trip.trip_members.forEach(m => { balances[m.user_id] = 0; });

    trip.expenses.forEach(exp => {
      // The person who paid gets + amount
      if (balances[exp.paid_by] !== undefined) {
        balances[exp.paid_by] += Number(exp.amount);
      }
    });

    const splits = trip.expenses.flatMap(e => e.expense_splits || []);
    splits.forEach(split => {
      // The person who owes gets - amount
      if (balances[split.user_id] !== undefined) {
        balances[split.user_id] -= Number(split.amount_owed);
      }
    });

    // 2. Separate into Debtors and Creditors
    const debtors = [];
    const creditors = [];

    Object.keys(balances).forEach(userId => {
      const b = balances[userId];
      if (b < -0.01) debtors.push({ userId, amount: Math.abs(b) });
      else if (b > 0.01) creditors.push({ userId, amount: b });
    });

    // Sort descending by amount to minimize transactions
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    // 3. Greedily settle
    const transactions = [];
    let d = 0;
    let c = 0;

    while (d < debtors.length && c < creditors.length) {
      const debtor = debtors[d];
      const creditor = creditors[c];
      const amount = Math.min(debtor.amount, creditor.amount);

      transactions.push({
        from: debtor.userId,
        to: creditor.userId,
        amount: Number(amount.toFixed(2))
      });

      debtor.amount -= amount;
      creditor.amount -= amount;

      if (debtor.amount < 0.01) d++;
      if (creditor.amount < 0.01) c++;
    }

    return transactions;
  }, [trip]);

  if (!trip) return null;

  const getUserName = (id) => {
    const member = trip.trip_members?.find(m => m.user_id === id);
    return member?.users?.name || 'Unknown User';
  };
  
  const getUserAvatar = (id) => {
    const member = trip.trip_members?.find(m => m.user_id === id);
    return member?.users?.avatar_url;
  };

  const handleComplete = async () => {
    try {
      await markTripComplete(trip.id);
      setCompleted(true);
    } catch (err) {
      alert("Failed to complete trip: " + err.message);
    }
  };

  const exportToCSV = () => {
    let csv = 'TRIP SUMMARY\n\n';
    csv += `Destination,${trip.destination}\n`;
    csv += `Start Date,${trip.start_date}\n`;
    csv += `End Date,${trip.end_date}\n\n`;

    csv += 'FINAL SETTLEMENTS\n';
    csv += 'Who Pays,Who Receives,Amount (₹)\n';
    if (settlements.length === 0) {
      csv += 'All settled up!,,\n';
    } else {
      settlements.forEach(s => {
        csv += `"${getUserName(s.from)}","${getUserName(s.to)}",${s.amount}\n`;
      });
    }

    csv += '\nEXPENSE LOG\n';
    csv += 'Date,Name,Category,Paid By,Amount (₹)\n';
    if (!trip.expenses || trip.expenses.length === 0) {
      csv += 'No expenses logged.,,,,\n';
    } else {
      trip.expenses.forEach(e => {
        csv += `"${new Date(e.created_at).toLocaleDateString()}","${e.name}","${e.category || 'Other'}","${getUserName(e.paid_by)}",${e.amount}\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${trip.destination}_Summary.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: 800, margin: '0 auto', paddingBottom: '100px' }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          Complete Trip
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-1)' }}>
          Settle final balances and archive the itinerary.
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {completed ? (
          <motion.div variants={fadeInUp} style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <motion.div
              animate={{ rotate: [-10, 10, -10], scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <PartyPopper size={64} color="var(--color-primary)" style={{ margin: '0 auto var(--space-4)' }} />
            </motion.div>
            <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Trip Completed!</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>Great memories & experiences saved in TripX.</p>
            
            <div style={{ background: 'var(--color-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-6)', border: '1px solid var(--color-border)' }}>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>Final Expense</p>
              <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-primary)' }}>
                ₹{trip.expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0}
              </p>
            </div>

            <AnimatedButton onClick={() => navigate(`/trip/${trip.id}/overview`)} fullWidth style={{ marginBottom: 'var(--space-3)' }}>
              View Summary
            </AnimatedButton>
            <AnimatedButton variant="secondary" onClick={() => navigate('/')} fullWidth>
              Back to Trips
            </AnimatedButton>
          </motion.div>
        ) : (
          <>
            <motion.div variants={fadeInUp} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', border: '1px solid var(--color-border)', marginBottom: 'var(--space-6)' }}>
              <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>Final Balances</h2>
              
              {settlements.length === 0 ? (
                <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-4)' }}>
                  All balances are settled! No one owes anything.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {settlements.map((s, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 'var(--space-4)', borderBottom: idx === settlements.length - 1 ? 'none' : '1px solid var(--color-border)' }}>
                      
                      {/* From User */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-primary-bg)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {getUserAvatar(s.from) ? <img src={getUserAvatar(s.from)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={20} color="var(--color-primary)" />}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: 'var(--font-size-sm)' }}>{getUserName(s.from)}</div>
                          <div style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-xs)' }}>Owes</div>
                        </div>
                      </div>

                      {/* Amount */}
                      <div style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: 'var(--font-size-lg)' }}>
                        ₹{s.amount.toFixed(2)}
                      </div>

                      {/* To User */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 500, fontSize: 'var(--font-size-sm)' }}>{getUserName(s.to)}</div>
                          <div style={{ color: 'var(--color-success)', fontSize: 'var(--font-size-xs)' }}>Gets</div>
                        </div>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-success-bg)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {getUserAvatar(s.to) ? <img src={getUserAvatar(s.to)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={20} color="var(--color-success)" />}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div variants={fadeInUp} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', alignItems: 'center' }}>
              <AnimatedButton variant="primary" onClick={handleComplete} disabled={completed} style={{ width: '100%', maxWidth: 300, display: 'flex', justifyContent: 'center' }}>
                <Flag size={18} style={{ marginRight: 8 }} /> Mark Trip as Complete
              </AnimatedButton>
              <AnimatedButton variant="secondary" onClick={exportToCSV} style={{ width: '100%', maxWidth: 300, display: 'flex', justifyContent: 'center' }}>
                <Download size={18} style={{ marginRight: 8 }} /> Export to CSV
              </AnimatedButton>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}