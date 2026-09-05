const fs = require('fs');
const files = [
  'src/pages/trip/AddExpense.jsx',
  'src/pages/trip/EditExpense.jsx',
  'src/pages/trip/Permissions.jsx',
  'src/pages/trip/Itinerary.jsx',
  'src/pages/trip/ActivityHistory.jsx',
  'src/pages/trip/ExplorePlaces.jsx',
  'src/pages/trip/Stay.jsx',
  'src/pages/trip/Transport.jsx',
  'src/pages/trip/TripComplete.jsx',
  'src/pages/trip/TripMemories.jsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  
  if (content.includes('<motion.header') && content.includes('header__back')) {
    content = content.replace(/<motion\.header[\s\S]*?<\/motion\.header>/, 
      `<div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          Add Expense
        </h1>
      </div>`);
  }
  
  if (content.includes('<motion.header') && content.includes('ArrowLeft size={24}')) {
    const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    const pMatch = content.match(/<p[^>]*>([\s\S]*?)<\/p>/);
    
    let replacement = `<div style={{ marginBottom: 'var(--space-6)' }}>
        ${h1Match ? h1Match[0] : ''}
        ${pMatch ? pMatch[0] : ''}
      </div>`;
      
    content = content.replace(/<motion\.header[\s\S]*?<\/motion\.header>/, replacement);
  }

  fs.writeFileSync(f, content);
});
console.log('Headers replaced in all files');
