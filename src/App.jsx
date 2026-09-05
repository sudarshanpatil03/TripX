import { BrowserRouter, Routes, Route } from 'react-router';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import PageTransition from './components/PageTransition';

// Auth
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';

// Main Pages
import MyTrips from './pages/MyTrips';
import CreateTrip from './pages/CreateTrip';
import TripCreated from './pages/TripCreated';
import Profile from './pages/Profile';
import Explore from './pages/Explore';

import MainLayout from './components/MainLayout';
import TripWorkspaceLayout from './components/TripWorkspaceLayout';
import TripOverview from './pages/trip/TripOverview';
import Itinerary from './pages/trip/Itinerary';
import ExpensesList from './pages/trip/ExpensesList';
import EditExpense from './pages/trip/EditExpense';
import Balances from './pages/trip/Balances';
import MembersList from './pages/trip/MembersList';
import AddMember from './pages/trip/AddMember';
import AddExpense from './pages/trip/AddExpense';
import JoinTrip from './pages/trip/JoinTrip';
import Permissions from './pages/trip/Permissions';
import TripSettings from './pages/TripSettings'; // Already exists
import ActivityHistory from './pages/trip/ActivityHistory';
import TripComplete from './pages/trip/TripComplete';
import TripMemories from './pages/trip/TripMemories';
import ExplorePlaces from './pages/trip/ExplorePlaces';
import Stay from './pages/trip/Stay';
import StaySearch from './pages/trip/StaySearch';
import Transport from './pages/trip/Transport';
import TransportSearch from './pages/trip/TransportSearch';
import TripMore from './pages/trip/TripMore';
import GlobalChatbot from './components/GlobalChatbot';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TripProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
              <Route path="/signup" element={<PageTransition><SignUp /></PageTransition>} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                
                {/* Join Trip Route (Standalone, no layout) */}
                <Route path="/trip/:tripId/join" element={<PageTransition><JoinTrip /></PageTransition>} />

                {/* Main App Layout (Top Level) */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<PageTransition><MyTrips /></PageTransition>} />
                  <Route path="/explore" element={<PageTransition><Explore /></PageTransition>} />
                  <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
                </Route>

                <Route path="/create-trip" element={<PageTransition><CreateTrip /></PageTransition>} />
                <Route path="/trip-created" element={<PageTransition><TripCreated /></PageTransition>} />

                {/* Trip Workspace Layout (Nested Level) */}
                <Route path="/trip/:tripId" element={<TripWorkspaceLayout />}>
                  <Route path="overview" element={<PageTransition><TripOverview /></PageTransition>} />
                  <Route path="itinerary" element={<PageTransition><Itinerary /></PageTransition>} />
                  <Route path="expenses" element={<PageTransition><ExpensesList /></PageTransition>} />
                  <Route path="expenses/add" element={<PageTransition><AddExpense /></PageTransition>} />
                  <Route path="expenses/balances" element={<PageTransition><Balances /></PageTransition>} />
                  <Route path="expenses/:expenseId" element={<PageTransition><EditExpense /></PageTransition>} />
                  <Route path="members" element={<PageTransition><MembersList /></PageTransition>} />
                  <Route path="members/add" element={<PageTransition><AddMember /></PageTransition>} />
                  <Route path="settings" element={<PageTransition><TripSettings /></PageTransition>} />
                  <Route path="permissions" element={<PageTransition><Permissions /></PageTransition>} />
                  <Route path="places" element={<PageTransition><ExplorePlaces /></PageTransition>} />
                  <Route path="stay" element={<PageTransition><Stay /></PageTransition>} />
                  <Route path="stay/search" element={<PageTransition><StaySearch /></PageTransition>} />
                  <Route path="transport" element={<PageTransition><Transport /></PageTransition>} />
                  <Route path="transport/search" element={<PageTransition><TransportSearch /></PageTransition>} />
                  <Route path="history" element={<PageTransition><ActivityHistory /></PageTransition>} />
                  <Route path="complete" element={<PageTransition><TripComplete /></PageTransition>} />
                  <Route path="memories" element={<PageTransition><TripMemories /></PageTransition>} />
                  <Route path="more" element={<PageTransition><TripMore /></PageTransition>} />
                </Route>
                
              </Route>
            </Routes>
          </BrowserRouter>
        </TripProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
