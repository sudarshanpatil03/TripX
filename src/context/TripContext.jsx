import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './AuthContext';
import { fetchDestinationImage } from '../services/unsplashService';

const TripContext = createContext();

export function TripProvider({ children }) {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [currentTripId, setCurrentTripId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all trips for the logged-in user
  const loadTrips = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('trips')
        .select(`
          *,
          trip_members ( user_id, role, permissions, users ( name, avatar_url ) ),
          expenses (*),
          itinerary_activities (*),
          activity_history (*),
          places (*),
          stays (*),
          transports (*),
          trip_memories (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrips(data || []);
    } catch (err) {
      console.error('Error loading trips:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          trips(name, created_by),
          sender:users!notifications_sender_id_fkey(name, avatar_url)
        `)
        .or(`user_id.eq.${user.id},receiver_email.eq.${user.email}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
      setUnreadCount((data || []).filter(n => !n.is_read && n.status === 'pending').length);
    } catch (err) {
      console.error('Error loading notifications:', err);
    }
  }, [user]);

  useEffect(() => {
    loadTrips();
    fetchNotifications();

    if (!user) return;

    // Real-time subscriptions
    const tripSub = supabase
      .channel('trip_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trips' }, loadTrips)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trip_members' }, loadTrips)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, loadTrips)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `receiver_email=eq.${user.email}` }, fetchNotifications)
      .subscribe();

    return () => {
      supabase.removeChannel(tripSub);
    };
  }, [user, loadTrips, fetchNotifications]);

  const currentTrip = trips.find((t) => t.id === currentTripId) || null;

  const openTrip = useCallback((tripId) => setCurrentTripId(tripId), []);
  const closeTrip = useCallback(() => setCurrentTripId(null), []);

  const createTrip = async (tripData) => {
    if (!user) throw new Error("Must be logged in to create a trip");

    // Fetch cover image from Unsplash based on destination
    const coverImageUrl = await fetchDestinationImage(tripData.destination);

    // 1. Insert into trips table
    const { data: newTrip, error: tripError } = await supabase
      .from('trips')
      .insert({
        name: tripData.name || `${tripData.destination} Trip`,
        type: tripData.type,
        starting_location: tripData.startingLocation,
        destination: tripData.destination,
        start_date: tripData.startDate,
        end_date: tripData.endDate,
        estimated_budget: tripData.estimatedBudget || null,
        cover_image_url: coverImageUrl || '/vite.svg', // fallback image
        created_by: user.id
      })
      .select()
      .single();

    if (tripError) throw tripError;

    // 2. Add creator as owner in trip_members
    const { error: memberError } = await supabase
      .from('trip_members')
      .insert({
        trip_id: newTrip.id,
        user_id: user.id,
        role: 'owner'
      });

    if (memberError) throw memberError;

    // 3. Log activity
    await supabase.from('activity_history').insert({
      trip_id: newTrip.id,
      user_id: user.id,
      action_description: 'created the trip'
    });

    // Refresh state locally
    await loadTrips();
    return newTrip.id;
  };

  const markTripComplete = async (tripId) => {
    const { error } = await supabase.from('trips').update({ status: 'completed' }).eq('id', tripId);
    if (error) throw error;
    
    // Log activity
    await supabase.from('activity_history').insert({
      trip_id: tripId,
      user_id: user.id,
      action_description: 'marked the trip as complete'
    });
    
    await loadTrips();
  };

  const addExpense = async (tripId, expenseData, receiptFile = null) => {
    if (!user) throw new Error("Must be logged in");
    
    let receiptUrl = null;

    if (receiptFile) {
      const fileExt = receiptFile.name.split('.').pop();
      const fileName = `${tripId}/${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(fileName, receiptFile);
        
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(fileName);
        
      receiptUrl = publicUrl;
    }

    // Insert expense
    const { data: newExpense, error: expError } = await supabase
      .from('expenses')
      .insert({
        trip_id: tripId,
        name: expenseData.name,
        amount: expenseData.amount,
        category: expenseData.category,
        paid_by: expenseData.paidBy,
        note: expenseData.note,
        receipt_url: receiptUrl,
        expense_date: new Date().toISOString().split('T')[0],
        expense_time: new Date().toTimeString().split(' ')[0],
        created_by: user.id
      })
      .select()
      .single();

    if (expError) throw expError;

    // Split equally among all trip members
    const trip = trips.find(t => t.id === tripId);
    if (trip && trip.trip_members) {
      const splitAmount = expenseData.amount / trip.trip_members.length;
      const splits = trip.trip_members.map(member => ({
        expense_id: newExpense.id,
        user_id: member.user_id,
        amount_owed: splitAmount
      }));

      const { error: splitError } = await supabase
        .from('expense_splits')
        .insert(splits);
        
      if (splitError) throw splitError;
    }

    // Log activity
    await supabase.from('activity_history').insert({
      trip_id: tripId,
      user_id: user.id,
      action_description: `added an expense for ₹${expenseData.amount}`
    });

    await loadTrips();
    return newExpense;
  };

  const recordPayment = async (tripId, fromUserId, toUserId, amount) => {
    if (!user) throw new Error("Must be logged in");
    
    // Create an expense representing the payment
    const { data: paymentExpense, error: expError } = await supabase
      .from('expenses')
      .insert({
        trip_id: tripId,
        name: `Payment`,
        amount: amount,
        category: 'payment', // Add a special category for this if needed, or 'other'
        paid_by: fromUserId, // The person who owed money pays it
        note: `Settled up debt`,
        expense_date: new Date().toISOString().split('T')[0],
        expense_time: new Date().toTimeString().split(' ')[0],
        created_by: user.id
      })
      .select()
      .single();

    if (expError) throw expError;

    // Split 100% to the receiver (so receiver "owes" this expense, zeroing out their credit)
    const { error: splitError } = await supabase
      .from('expense_splits')
      .insert({
        expense_id: paymentExpense.id,
        user_id: toUserId,
        amount_owed: amount
      });

    if (splitError) throw splitError;

    // Log activity
    await supabase.from('activity_history').insert({
      trip_id: tripId,
      user_id: user.id,
      action_description: `recorded a settlement payment of ₹${amount}`
    });

    await loadTrips();
  };

  const deleteExpense = async (expenseId) => {
    const { error } = await supabase.from('expenses').delete().eq('id', expenseId);
    if (error) throw error;
    await loadTrips();
  };

  const joinTrip = async (tripId) => {
    if (!user) throw new Error("Must be logged in to join a trip");

    // Check if already a member
    const { data: existing } = await supabase
      .from('trip_members')
      .select('*')
      .eq('trip_id', tripId)
      .eq('user_id', user.id)
      .single();

    if (existing) return true; // Already joined

    // Add as member
    const { error } = await supabase
      .from('trip_members')
      .insert({
        trip_id: tripId,
        user_id: user.id,
        role: 'member'
      });
      
    if (error) throw error;
    
    // Log activity
    await supabase.from('activity_history').insert({
      trip_id: tripId,
      user_id: user.id,
      action_description: 'joined the trip via invite link'
    });

    await loadTrips();
    return true;
  };

  const sendInviteByEmail = async (tripId, email) => {
    const { error } = await supabase.from('notifications').insert({
      trip_id: tripId,
      receiver_email: email,
      sender_id: user.id,
      type: 'trip_invite',
      status: 'pending'
    });
    if (error) throw error;
  };

  const respondToInvite = async (notification, response) => {
    const { error } = await supabase
      .from('notifications')
      .update({ status: response, is_read: true })
      .eq('id', notification.id);
      
    if (error) throw error;

    if (response === 'accepted') {
      await supabase.from('trip_members').insert({
        trip_id: notification.trip_id,
        user_id: user.id,
        role: 'member'
      });
      await loadTrips();
    } else if (response === 'declined') {
      await supabase.from('notifications').insert({
        trip_id: notification.trip_id,
        user_id: notification.sender_id,
        sender_id: user.id,
        type: 'invite_declined',
        status: 'pending'
      });
    }
    await fetchNotifications();
  };

  const markNotificationRead = async (notificationId) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', notificationId);
    await fetchNotifications();
  };

  const updateExpense = async (expenseId, expenseData, receiptFile = null) => {
    if (!user) throw new Error("Must be logged in");
    let receiptUrl = expenseData.receiptUrl || null;

    if (receiptFile) {
      const fileExt = receiptFile.name.split('.').pop();
      const fileName = `${expenseData.tripId}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('receipts').upload(fileName, receiptFile);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('receipts').getPublicUrl(fileName);
      receiptUrl = publicUrl;
    }

    const { error: expError } = await supabase.from('expenses').update({
      name: expenseData.name,
      amount: expenseData.amount,
      category: expenseData.category,
      paid_by: expenseData.paidBy,
      note: expenseData.note,
      receipt_url: receiptUrl,
    }).eq('id', expenseId);

    if (expError) throw expError;
    
    await supabase.from('expense_splits').delete().eq('expense_id', expenseId);
    const trip = trips.find(t => t.id === expenseData.tripId);
    if (trip && trip.trip_members) {
      const splitAmount = expenseData.amount / trip.trip_members.length;
      const splits = trip.trip_members.map(member => ({
        expense_id: expenseId,
        user_id: member.user_id,
        amount_owed: splitAmount
      }));
      const { error: splitError } = await supabase.from('expense_splits').insert(splits);
      if (splitError) throw splitError;
    }

    await supabase.from('activity_history').insert({
      trip_id: expenseData.tripId, user_id: user.id, action_description: `updated expense: ${expenseData.name}`
    });

    await loadTrips();
  };

  const updateMemberRole = async (tripId, targetUserId, newRole) => {
    if (!user) return;
    const { error } = await supabase.from('trip_members').update({ role: newRole }).eq('trip_id', tripId).eq('user_id', targetUserId);
    if (error) throw error;
    await supabase.from('activity_history').insert({
      trip_id: tripId, user_id: user.id, action_description: `updated a member's role to ${newRole}`
    });
    await loadTrips();
  };

  const removeMember = async (tripId, targetUserId) => {
    if (!user) return;
    const { error } = await supabase.from('trip_members').update({ role: 'removed' }).eq('trip_id', tripId).eq('user_id', targetUserId);
    if (error) throw error;
    
    // Send notification to the removed user
    await supabase.from('notifications').insert({
      trip_id: tripId,
      user_id: targetUserId,
      sender_id: user.id,
      type: 'trip_removed',
      status: 'info'
    });

    await supabase.from('activity_history').insert({
      trip_id: tripId, user_id: user.id, action_description: `removed a member from the trip`
    });
    await loadTrips();
  };

  const addItineraryActivity = async (tripId, tripStartDate, activityData) => {
    if (!user) return;
    // Calculate day_number from trip start date (required, non-nullable)
    const start = new Date(tripStartDate);
    const actDate = new Date(activityData.date);
    const dayNumber = Math.max(1, Math.round((actDate - start) / (1000 * 60 * 60 * 24)) + 1);
    const payload = {
      trip_id: tripId,
      title: activityData.title,
      type: activityData.type || 'activity',
      day_number: dayNumber,
      activity_date: activityData.date,
      activity_time: activityData.activityTime || null,
      duration: activityData.duration || null,
      cost: activityData.cost ? Number(activityData.cost) : null,
      note: activityData.note || null,
    };
    const { error } = await supabase.from('itinerary_activities').insert(payload);
    if (error) throw error;
    await supabase.from('activity_history').insert({
      trip_id: tripId, user_id: user.id, action_description: `added "${activityData.title}" to the itinerary`
    });
    await loadTrips();
  };

  const updateItineraryActivity = async (activityId, activityData, tripId, tripStartDate) => {
    if (!user) return;
    const start = new Date(tripStartDate);
    const actDate = new Date(activityData.date);
    const dayNumber = Math.max(1, Math.round((actDate - start) / (1000 * 60 * 60 * 24)) + 1);
    const { error } = await supabase.from('itinerary_activities').update({
      title: activityData.title,
      type: activityData.type || 'activity',
      day_number: dayNumber,
      activity_date: activityData.date,
      activity_time: activityData.activityTime || null,
      duration: activityData.duration || null,
      cost: activityData.cost ? Number(activityData.cost) : null,
      note: activityData.note || null,
    }).eq('id', activityId);
    if (error) throw error;
    await loadTrips();
  };

  const deleteItineraryActivity = async (activityId, tripId) => {
    if (!user) return;
    const { error } = await supabase.from('itinerary_activities').delete().eq('id', activityId);
    if (error) throw error;
    await loadTrips();
  };

  const getTripStats = useCallback((tripId) => {
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return null;

    const totalExpense = (trip.expenses || []).reduce((sum, e) => sum + Number(e.amount), 0);
    const memberCount = (trip.trip_members || []).length;
    
    const expensesByCategory = (trip.expenses || []).reduce((acc, e) => {
      const cat = e.category || 'Other';
      acc[cat] = (acc[cat] || 0) + Number(e.amount);
      return acc;
    }, {});

    return {
      totalExpense,
      estimatedBudget: trip.estimated_budget || 0,
      remaining: (trip.estimated_budget || 0) - totalExpense,
      overBudget: totalExpense > (trip.estimated_budget || Infinity),
      memberCount,
      expensesByCategory
    };
  }, [trips]);

  return (
    <TripContext.Provider
      value={{
        trips,
        currentTrip,
        currentTripId,
        loading,
        error,
        notifications,
        unreadCount,
        openTrip,
        closeTrip,
        createTrip,
        joinTrip,
        sendInviteByEmail,
        respondToInvite,
        markNotificationRead,
        refreshNotifications: fetchNotifications,
        markTripComplete,
        addExpense,
        recordPayment,
        deleteExpense,
        updateExpense,
        updateMemberRole,
        removeMember,
        addItineraryActivity,
        updateItineraryActivity,
        deleteItineraryActivity,
        getTripStats,
        refreshTrips: loadTrips
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export const useTrips = () => useContext(TripContext);
