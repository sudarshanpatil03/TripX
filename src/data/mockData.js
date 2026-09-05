// ═══════════════════════════════════════════════════════
// TripX — Complete Mock Data
// ═══════════════════════════════════════════════════════

export const users = {
  u1: { id: 'u1', name: 'Samarth', phone: '9876543210', isYou: true },
  u2: { id: 'u2', name: 'Rohit', phone: '9400000012' },
  u3: { id: 'u3', name: 'Akash', phone: '9700000034' },
  u4: { id: 'u4', name: 'Pratik', phone: '9600000056' },
  u5: { id: 'u5', name: 'Om', phone: '9500000078' },
  u6: { id: 'u6', name: 'Amit', phone: '9160000090', registered: false },
  u7: { id: 'u7', name: 'Neha', phone: '9611000011' },
  u8: { id: 'u8', name: 'Priya', phone: '9110000022' },
};

export const tripTypes = [
  { value: 'solo', label: 'Solo', emoji: '🧳' },
  { value: 'couple', label: 'Couple', emoji: '💑' },
  { value: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦' },
  { value: 'friends', label: 'Friends / Group', emoji: '👯' },
  { value: 'college', label: 'College', emoji: '🎓' },
  { value: 'team', label: 'Team / Office', emoji: '💼' },
  { value: 'custom', label: 'Custom', emoji: '✨' },
];

export const expenseCategories = [
  { value: 'food', label: 'Food', icon: 'UtensilsCrossed', color: '#F59E0B' },
  { value: 'hotel', label: 'Hotel', icon: 'Hotel', color: '#7C3AED' },
  { value: 'transport', label: 'Transport', icon: 'Car', color: '#3B82F6' },
  { value: 'petrol', label: 'Petrol', icon: 'Fuel', color: '#EF4444' },
  { value: 'tickets', label: 'Tickets', icon: 'Ticket', color: '#10B981' },
  { value: 'shopping', label: 'Shopping', icon: 'ShoppingBag', color: '#EC4899' },
  { value: 'activities', label: 'Activities', icon: 'Compass', color: '#8B5CF6' },
  { value: 'other', label: 'Other', icon: 'MoreHorizontal', color: '#6B7280' },
];

// ─── TRIPS ─────────────────────────────────────────────

export const initialTrips = [
  {
    id: 'trip1',
    name: 'Kashi Trip',
    type: 'friends',
    coverImage: '/images/kashi.png',
    startingLocation: 'Solapur, Maharashtra',
    destination: 'Varanasi, Uttar Pradesh',
    startDate: '2025-05-10',
    endDate: '2025-05-17',
    status: 'ongoing',
    estimatedBudget: 25000,
    createdBy: 'u1',
    createdAt: '2025-05-01T10:00:00Z',

    members: [
      { userId: 'u1', role: 'owner', joinedAt: '2025-05-01T10:00:00Z' },
      { userId: 'u2', role: 'admin', joinedAt: '2025-05-01T10:30:00Z' },
      { userId: 'u3', role: 'member', joinedAt: '2025-05-01T11:00:00Z' },
      { userId: 'u4', role: 'member', joinedAt: '2025-05-01T12:00:00Z' },
      { userId: 'u5', role: 'member', joinedAt: '2025-05-02T09:00:00Z' },
    ],

    permissions: {
      u1: { viewTrip: true, addExpense: true, editExpense: true, deleteExpense: true, addPlace: true, editItinerary: true, deleteItinerary: true, manageMembers: true },
      u2: { viewTrip: true, addExpense: true, editExpense: true, deleteExpense: true, addPlace: true, editItinerary: true, deleteItinerary: false, manageMembers: false },
      u3: { viewTrip: true, addExpense: true, editExpense: false, deleteExpense: false, addPlace: true, editItinerary: true, deleteItinerary: false, manageMembers: false },
      u4: { viewTrip: true, addExpense: true, editExpense: false, deleteExpense: false, addPlace: false, editItinerary: false, deleteItinerary: false, manageMembers: false },
      u5: { viewTrip: true, addExpense: false, editExpense: false, deleteExpense: false, addPlace: false, editItinerary: false, deleteItinerary: false, manageMembers: false },
    },

    expenses: [
      { id: 'e1', name: 'Hotel Payment', amount: 6000, category: 'hotel', paidBy: 'u2', forWhom: ['u1','u2','u3','u4','u5'], splitType: 'equal', note: 'Hotel near Kashi Vishwanath Temple', date: '2025-05-10', time: '15:30', createdBy: 'u2' },
      { id: 'e2', name: 'Food', amount: 850, category: 'food', paidBy: 'u3', forWhom: ['u1','u2','u3'], splitType: 'equal', note: '', date: '2025-05-10', time: '20:00', createdBy: 'u3' },
      { id: 'e3', name: 'Auto Fare', amount: 1500, category: 'transport', paidBy: 'u1', forWhom: ['u1','u2','u3','u4','u5'], splitType: 'equal', note: 'Sarnath + Dashashwamedh Ghat visit', date: '2025-05-11', time: '09:30', createdBy: 'u1' },
      { id: 'e4', name: 'Ganga Aarti Donation', amount: 200, category: 'activities', paidBy: 'u4', forWhom: ['u1','u2','u3','u4','u5'], splitType: 'equal', note: '', date: '2025-05-11', time: '19:00', createdBy: 'u4' },
      { id: 'e5', name: 'Water Bottles', amount: 150, category: 'food', paidBy: 'u5', forWhom: ['u1','u2','u3','u4','u5'], splitType: 'equal', note: '', date: '2025-05-11', time: '12:00', createdBy: 'u5' },
      { id: 'e6', name: 'Train Tickets', amount: 5200, category: 'transport', paidBy: 'u1', forWhom: ['u1','u2','u3','u4','u5'], splitType: 'equal', note: 'Solapur to Varanasi', date: '2025-05-09', time: '08:00', createdBy: 'u1' },
      { id: 'e7', name: 'Lunch', amount: 1200, category: 'food', paidBy: 'u2', forWhom: ['u1','u2','u3','u4','u5'], splitType: 'equal', note: 'Restaurant near Assi Ghat', date: '2025-05-11', time: '13:00', createdBy: 'u2' },
      { id: 'e8', name: 'Temple Prasad', amount: 350, category: 'activities', paidBy: 'u3', forWhom: ['u1','u2','u3','u4','u5'], splitType: 'equal', note: 'Kashi Vishwanath', date: '2025-05-12', time: '07:00', createdBy: 'u3' },
      { id: 'e9', name: 'Shopping', amount: 3000, category: 'shopping', paidBy: 'u1', forWhom: ['u1','u3'], splitType: 'equal', note: 'Banarasi silk sarees', date: '2025-05-13', time: '16:00', createdBy: 'u1' },
    ],

    itinerary: [
      {
        day: 1, date: '2025-05-10', label: 'Day 1 - 10 May',
        activities: [
          { id: 'a1', time: '06:00', title: 'Arrival at Varanasi', type: 'transport', icon: 'Train', duration: '', cost: 0, note: 'Train arrives at Varanasi Junction' },
          { id: 'a2', time: '08:00', title: 'Hotel Check-In', type: 'stay', icon: 'Hotel', duration: '30 min', cost: 6000, note: 'Hotel near Kashi Vishwanath' },
          { id: 'a3', time: '10:00', title: 'Kashi Vishwanath Temple', type: 'place', icon: 'MapPin', duration: '2 hrs', cost: 0, note: 'Morning darshan' },
          { id: 'a4', time: '13:00', title: 'Lunch', type: 'food', icon: 'UtensilsCrossed', duration: '1 hr', cost: 1200, note: '' },
          { id: 'a5', time: '16:00', title: 'Ganga Aarti at Dashashwamedh Ghat', type: 'activity', icon: 'Flame', duration: '2 hrs', cost: 200, note: 'Evening aarti ceremony' },
          { id: 'a6', time: '20:00', title: 'Dinner', type: 'food', icon: 'UtensilsCrossed', duration: '1 hr', cost: 850, note: '' },
        ],
      },
      {
        day: 2, date: '2025-05-11', label: 'Day 2 - 11 May',
        activities: [
          { id: 'a7', time: '05:30', title: 'Boat Ride on Ganges', type: 'activity', icon: 'Anchor', duration: '1.5 hrs', cost: 500, note: 'Sunrise boat ride' },
          { id: 'a8', time: '09:00', title: 'Sarnath Visit', type: 'place', icon: 'MapPin', duration: '3 hrs', cost: 100, note: 'Buddhist pilgrimage site' },
          { id: 'a9', time: '13:00', title: 'Lunch at Assi Ghat', type: 'food', icon: 'UtensilsCrossed', duration: '1 hr', cost: 1200, note: '' },
          { id: 'a10', time: '15:00', title: 'Ramnagar Fort', type: 'place', icon: 'Building', duration: '2 hrs', cost: 50, note: '' },
          { id: 'a11', time: '19:00', title: 'Evening Walk - Ghats', type: 'activity', icon: 'Footprints', duration: '2 hrs', cost: 0, note: 'Explore various ghats' },
        ],
      },
      {
        day: 3, date: '2025-05-12', label: 'Day 3 - 12 May',
        activities: [
          { id: 'a12', time: '07:00', title: 'Temple Visits', type: 'place', icon: 'MapPin', duration: '3 hrs', cost: 350, note: 'Durga Temple, Tulsi Manas' },
          { id: 'a13', time: '11:00', title: 'BHU Campus Walk', type: 'activity', icon: 'GraduationCap', duration: '2 hrs', cost: 0, note: 'Banaras Hindu University' },
          { id: 'a14', time: '14:00', title: 'Shopping at Godowlia Market', type: 'activity', icon: 'ShoppingBag', duration: '3 hrs', cost: 3000, note: 'Banarasi sarees, sweets' },
        ],
      },
      {
        day: 4, date: '2025-05-13', label: 'Day 4 - 13 May',
        activities: [
          { id: 'a15', time: '06:00', title: 'Morning Ganga Dip', type: 'activity', icon: 'Waves', duration: '1 hr', cost: 0, note: '' },
          { id: 'a16', time: '10:00', title: 'Chunar Fort Day Trip', type: 'place', icon: 'Castle', duration: '5 hrs', cost: 800, note: 'Historical fort near Varanasi' },
          { id: 'a17', time: '18:00', title: 'Farewell Dinner', type: 'food', icon: 'UtensilsCrossed', duration: '2 hrs', cost: 2000, note: '' },
        ],
      },
    ],

    places: [
      { id: 'p1', name: 'Kashi Vishwanath Temple', type: 'temple', description: 'One of the most famous Hindu temples, dedicated to Lord Shiva.', distance: '2 km', visitTime: '2 hrs', entryFee: 'Free', added: true },
      { id: 'p2', name: 'Dashashwamedh Ghat', type: 'ghat', description: 'The main ghat in Varanasi, famous for its spectacular Ganga Aarti.', distance: '1.5 km', visitTime: '2 hrs', entryFee: 'Free', added: true },
      { id: 'p3', name: 'Sarnath', type: 'historical', description: 'Buddhist pilgrimage site where Buddha gave his first sermon.', distance: '10 km', visitTime: '3 hrs', entryFee: '₹100', added: true },
      { id: 'p4', name: 'Ramnagar Fort', type: 'historical', description: '18th-century fort on the banks of the Ganges.', distance: '14 km', visitTime: '2 hrs', entryFee: '₹50', added: true },
      { id: 'p5', name: 'Assi Ghat', type: 'ghat', description: 'Southernmost ghat, popular for morning walks and yoga.', distance: '3 km', visitTime: '1 hr', entryFee: 'Free', added: false },
      { id: 'p6', name: 'Manikarnika Ghat', type: 'ghat', description: 'One of the oldest and most sacred cremation ghats.', distance: '2.5 km', visitTime: '30 min', entryFee: 'Free', added: false },
      { id: 'p7', name: 'Chunar Fort', type: 'historical', description: 'Ancient fort overlooking the Ganges, 40 km from Varanasi.', distance: '40 km', visitTime: '3 hrs', entryFee: '₹25', added: true },
      { id: 'p8', name: 'BHU & New Vishwanath Temple', type: 'temple', description: 'Beautiful campus with the New Vishwanath Temple inside.', distance: '5 km', visitTime: '2 hrs', entryFee: 'Free', added: true },
    ],

    stay: [
      { id: 's1', name: 'Hotel Ganges View', type: 'hotel', location: 'Near Kashi Vishwanath', checkIn: '2025-05-10', checkOut: '2025-05-14', rooms: 2, cost: 6000, paidBy: 'u2', facilities: ['WiFi', 'AC', 'Ganga View', 'Room Service'], rating: 4.2 },
    ],

    transport: [
      { id: 't1', type: 'train', from: 'Solapur', to: 'Varanasi', date: '2025-05-09', time: '22:00', arrivalTime: '06:00', cost: 5200, paidBy: 'u1', bookingRef: 'PNR: 4521367890', note: 'Sleeper Class' },
      { id: 't2', type: 'auto', from: 'Varanasi Junction', to: 'Hotel', date: '2025-05-10', time: '06:30', cost: 300, paidBy: 'u1', note: '' },
      { id: 't3', type: 'auto', from: 'Hotel', to: 'Sarnath', date: '2025-05-11', time: '09:00', cost: 400, paidBy: 'u1', note: 'Round trip' },
    ],

    activityHistory: [
      { id: 'h1', userId: 'u1', action: 'created the trip', timestamp: '2025-05-01T10:00:00Z' },
      { id: 'h2', userId: 'u2', action: 'joined the trip', timestamp: '2025-05-01T10:30:00Z' },
      { id: 'h3', userId: 'u3', action: 'joined the trip', timestamp: '2025-05-01T11:00:00Z' },
      { id: 'h4', userId: 'u1', action: 'added Train Tickets expense — ₹5,200', timestamp: '2025-05-09T08:00:00Z' },
      { id: 'h5', userId: 'u2', action: 'added Hotel Payment — ₹6,000', timestamp: '2025-05-10T15:30:00Z' },
      { id: 'h6', userId: 'u1', action: 'added Day 1 itinerary', timestamp: '2025-05-08T14:00:00Z' },
      { id: 'h7', userId: 'u3', action: 'added ₹850 Food expense', timestamp: '2025-05-10T20:00:00Z' },
      { id: 'h8', userId: 'u1', action: 'added Auto Fare — ₹1,500', timestamp: '2025-05-11T09:30:00Z' },
      { id: 'h9', userId: 'u4', action: 'added Ganga Aarti Donation — ₹200', timestamp: '2025-05-11T19:00:00Z' },
      { id: 'h10', userId: 'u1', action: 'updated permissions for Pratik', timestamp: '2025-05-12T08:00:00Z' },
    ],

    notifications: [
      { id: 'n1', type: 'expense', message: 'Rohit added Hotel Payment — ₹6,000', timestamp: '2025-05-10T15:30:00Z', read: true },
      { id: 'n2', type: 'expense', message: 'Akash added Food — ₹850', timestamp: '2025-05-10T20:00:00Z', read: true },
      { id: 'n3', type: 'itinerary', message: 'Samarth updated Day 2 itinerary', timestamp: '2025-05-10T22:00:00Z', read: false },
      { id: 'n4', type: 'expense', message: 'Pratik added Ganga Aarti Donation — ₹200', timestamp: '2025-05-11T19:00:00Z', read: false },
      { id: 'n5', type: 'member', message: 'Om joined the trip', timestamp: '2025-05-02T09:00:00Z', read: true },
    ],
  },

  {
    id: 'trip2',
    name: 'Goa Trip',
    type: 'friends',
    coverImage: '/images/goa.png',
    startingLocation: 'Solapur, Maharashtra',
    destination: 'Goa',
    startDate: '2025-05-05',
    endDate: '2025-05-09',
    status: 'completed',
    estimatedBudget: 30000,
    createdBy: 'u1',
    createdAt: '2025-04-20T10:00:00Z',

    members: [
      { userId: 'u1', role: 'owner', joinedAt: '2025-04-20T10:00:00Z' },
      { userId: 'u2', role: 'admin', joinedAt: '2025-04-20T11:00:00Z' },
      { userId: 'u3', role: 'member', joinedAt: '2025-04-20T12:00:00Z' },
      { userId: 'u7', role: 'member', joinedAt: '2025-04-21T10:00:00Z' },
      { userId: 'u8', role: 'member', joinedAt: '2025-04-21T11:00:00Z' },
    ],

    permissions: {
      u1: { viewTrip: true, addExpense: true, editExpense: true, deleteExpense: true, addPlace: true, editItinerary: true, deleteItinerary: true, manageMembers: true },
      u2: { viewTrip: true, addExpense: true, editExpense: true, deleteExpense: false, addPlace: true, editItinerary: true, deleteItinerary: false, manageMembers: false },
      u3: { viewTrip: true, addExpense: true, editExpense: false, deleteExpense: false, addPlace: true, editItinerary: false, deleteItinerary: false, manageMembers: false },
      u7: { viewTrip: true, addExpense: true, editExpense: false, deleteExpense: false, addPlace: false, editItinerary: false, deleteItinerary: false, manageMembers: false },
      u8: { viewTrip: true, addExpense: false, editExpense: false, deleteExpense: false, addPlace: false, editItinerary: false, deleteItinerary: false, manageMembers: false },
    },

    expenses: [
      { id: 'ge1', name: 'Hotel Booking', amount: 8000, category: 'hotel', paidBy: 'u1', forWhom: ['u1','u2','u3','u7','u8'], splitType: 'equal', note: 'Beach resort', date: '2025-05-05', time: '14:00', createdBy: 'u1' },
      { id: 'ge2', name: 'Water Sports', amount: 3500, category: 'activities', paidBy: 'u2', forWhom: ['u1','u2','u3'], splitType: 'equal', note: 'Jet ski + Parasailing', date: '2025-05-06', time: '10:00', createdBy: 'u2' },
      { id: 'ge3', name: 'Dinner', amount: 2200, category: 'food', paidBy: 'u3', forWhom: ['u1','u2','u3','u7','u8'], splitType: 'equal', note: 'Seafood restaurant', date: '2025-05-06', time: '20:00', createdBy: 'u3' },
      { id: 'ge4', name: 'Scooter Rental', amount: 1800, category: 'transport', paidBy: 'u1', forWhom: ['u1','u2','u3','u7','u8'], splitType: 'equal', note: '3 scooters for 4 days', date: '2025-05-05', time: '15:00', createdBy: 'u1' },
      { id: 'ge5', name: 'Petrol', amount: 900, category: 'petrol', paidBy: 'u2', forWhom: ['u1','u2','u3','u7','u8'], splitType: 'equal', note: '', date: '2025-05-07', time: '09:00', createdBy: 'u2' },
    ],

    itinerary: [
      {
        day: 1, date: '2025-05-05', label: 'Day 1 - 5 May',
        activities: [
          { id: 'ga1', time: '10:00', title: 'Arrival in Goa', type: 'transport', icon: 'Plane', duration: '', cost: 0, note: '' },
          { id: 'ga2', time: '14:00', title: 'Hotel Check-in', type: 'stay', icon: 'Hotel', duration: '30 min', cost: 8000, note: '' },
          { id: 'ga3', time: '16:00', title: 'Baga Beach', type: 'place', icon: 'Waves', duration: '3 hrs', cost: 0, note: '' },
        ],
      },
    ],

    places: [
      { id: 'gp1', name: 'Baga Beach', type: 'beach', description: 'Famous beach with water sports and nightlife.', distance: '3 km', visitTime: '3 hrs', entryFee: 'Free', added: true },
      { id: 'gp2', name: 'Fort Aguada', type: 'historical', description: 'Portuguese fort with lighthouse and ocean views.', distance: '8 km', visitTime: '2 hrs', entryFee: '₹25', added: true },
    ],

    stay: [
      { id: 'gs1', name: 'Beach Paradise Resort', type: 'resort', location: 'Near Baga Beach', checkIn: '2025-05-05', checkOut: '2025-05-09', rooms: 3, cost: 8000, paidBy: 'u1', facilities: ['Pool', 'WiFi', 'AC', 'Beach Access'], rating: 4.5 },
    ],

    transport: [
      { id: 'gt1', type: 'flight', from: 'Pune', to: 'Goa', date: '2025-05-05', time: '08:00', cost: 4500, paidBy: 'u1', bookingRef: 'AIR-123456', note: '' },
    ],

    activityHistory: [
      { id: 'gh1', userId: 'u1', action: 'created the trip', timestamp: '2025-04-20T10:00:00Z' },
      { id: 'gh2', userId: 'u1', action: 'completed the trip', timestamp: '2025-05-09T18:00:00Z' },
    ],

    notifications: [],

    memories: {
      photos: ['/images/goa.png'],
      summary: 'An amazing beach vacation with friends! Water sports, great food, and unforgettable sunsets.',
      totalExpense: 16400,
      placesVisited: 5,
    },
  },

  {
    id: 'trip3',
    name: 'Manali Trip',
    type: 'family',
    coverImage: '/images/manali.png',
    startingLocation: 'Delhi',
    destination: 'Manali, Himachal Pradesh',
    startDate: '2025-05-18',
    endDate: '2025-05-24',
    status: 'upcoming',
    estimatedBudget: 40000,
    createdBy: 'u1',
    createdAt: '2025-05-05T10:00:00Z',

    members: [
      { userId: 'u1', role: 'owner', joinedAt: '2025-05-05T10:00:00Z' },
      { userId: 'u2', role: 'admin', joinedAt: '2025-05-05T11:00:00Z' },
      { userId: 'u7', role: 'member', joinedAt: '2025-05-05T12:00:00Z' },
      { userId: 'u8', role: 'member', joinedAt: '2025-05-05T13:00:00Z' },
      { userId: 'u3', role: 'member', joinedAt: '2025-05-06T09:00:00Z' },
      { userId: 'u6', role: 'pending', joinedAt: '2025-05-06T10:00:00Z' },
    ],

    permissions: {
      u1: { viewTrip: true, addExpense: true, editExpense: true, deleteExpense: true, addPlace: true, editItinerary: true, deleteItinerary: true, manageMembers: true },
      u2: { viewTrip: true, addExpense: true, editExpense: true, deleteExpense: false, addPlace: true, editItinerary: true, deleteItinerary: false, manageMembers: false },
      u7: { viewTrip: true, addExpense: true, editExpense: false, deleteExpense: false, addPlace: true, editItinerary: false, deleteItinerary: false, manageMembers: false },
      u8: { viewTrip: true, addExpense: true, editExpense: false, deleteExpense: false, addPlace: false, editItinerary: false, deleteItinerary: false, manageMembers: false },
      u3: { viewTrip: true, addExpense: true, editExpense: false, deleteExpense: false, addPlace: true, editItinerary: false, deleteItinerary: false, manageMembers: false },
      u6: { viewTrip: true, addExpense: false, editExpense: false, deleteExpense: false, addPlace: false, editItinerary: false, deleteItinerary: false, manageMembers: false },
    },

    expenses: [],
    itinerary: [],
    places: [
      { id: 'mp1', name: 'Rohtang Pass', type: 'nature', description: 'High mountain pass with stunning snow views.', distance: '51 km', visitTime: '4 hrs', entryFee: '₹550', added: false },
      { id: 'mp2', name: 'Solang Valley', type: 'nature', description: 'Adventure sports hub — paragliding, skiing, zorbing.', distance: '14 km', visitTime: '5 hrs', entryFee: 'Varies', added: false },
      { id: 'mp3', name: 'Hadimba Temple', type: 'temple', description: 'Ancient cave temple surrounded by cedar forests.', distance: '2 km', visitTime: '1 hr', entryFee: 'Free', added: false },
    ],
    stay: [],
    transport: [],
    activityHistory: [
      { id: 'mh1', userId: 'u1', action: 'created the trip', timestamp: '2025-05-05T10:00:00Z' },
    ],
    notifications: [],
  },
];

// ─── CONTACTS (for Add Member) ─────────────────────────
export const phoneContacts = [
  { id: 'c1', name: 'Akash Kumar', phone: '9700000034', registered: true, userId: 'u3' },
  { id: 'c2', name: 'Rohit Sharma', phone: '9400000012', registered: true, userId: 'u2' },
  { id: 'c3', name: 'Neha Patil', phone: '9611000011', registered: true, userId: 'u7' },
  { id: 'c4', name: 'Amit Jadhav', phone: '9160000090', registered: false },
  { id: 'c5', name: 'Priya More', phone: '9110000022', registered: true, userId: 'u8' },
  { id: 'c6', name: 'Suresh Gupta', phone: '9876500001', registered: false },
  { id: 'c7', name: 'Pooja Deshpande', phone: '9876500002', registered: false },
];

// ─── Helper functions ──────────────────────────────────
export function getUserById(id) {
  return users[id] || { id, name: 'Unknown', phone: '' };
}

export function getTotalExpenses(expenses) {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

export function getMemberBalance(expenses, userId, allMembers) {
  let totalPaid = 0;
  let totalShare = 0;

  expenses.forEach((expense) => {
    if (expense.paidBy === userId) totalPaid += expense.amount;
    if (expense.forWhom.includes(userId)) {
      totalShare += expense.amount / expense.forWhom.length;
    }
  });

  return { totalPaid, totalShare, netBalance: totalPaid - totalShare };
}

export function formatCurrency(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateShort(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function getStatusColor(status) {
  switch (status) {
    case 'ongoing': return '#10B981';
    case 'completed': return '#6B7280';
    case 'upcoming': return '#3B82F6';
    default: return '#6B7280';
  }
}
