export function calculateBalances(expenses, members) {
  const balances = {};
  
  // Initialize all members to 0
  members.forEach(m => {
    balances[m.user_id] = 0;
  });

  // Calculate net balances
  expenses.forEach(exp => {
    // Payer gets credit (+)
    if (balances[exp.paid_by] !== undefined) {
      balances[exp.paid_by] += Number(exp.amount);
    }
    
    // Splitters get debt (-)
    if (exp.expense_splits && exp.expense_splits.length > 0) {
      exp.expense_splits.forEach(split => {
        if (balances[split.user_id] !== undefined) {
          balances[split.user_id] -= Number(split.amount_owed);
        }
      });
    } else {
      // Fallback: split equally among all members
      const splitAmount = Number(exp.amount) / members.length;
      members.forEach(m => {
        if (balances[m.user_id] !== undefined) {
          balances[m.user_id] -= splitAmount;
        }
      });
    }
  });

  return balances;
}

export function calculateSettlements(balances) {
  const debtors = [];
  const creditors = [];

  // Separate into debtors and creditors
  for (const [userId, balance] of Object.entries(balances)) {
    if (balance > 0.01) {
      creditors.push({ userId, amount: balance });
    } else if (balance < -0.01) {
      debtors.push({ userId, amount: Math.abs(balance) });
    }
  }

  // Sort largest to smallest to minimize number of transactions
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const settlements = [];
  let d = 0;
  let c = 0;

  // Greedy algorithm to settle debts
  while (d < debtors.length && c < creditors.length) {
    const debtor = debtors[d];
    const creditor = creditors[c];

    const amount = Math.min(debtor.amount, creditor.amount);

    settlements.push({
      from: debtor.userId,
      to: creditor.userId,
      amount: Math.round(amount * 100) / 100 // Round to 2 decimal places
    });

    debtor.amount -= amount;
    creditor.amount -= amount;

    if (Math.abs(debtor.amount) < 0.01) d++;
    if (Math.abs(creditor.amount) < 0.01) c++;
  }

  return settlements;
}
