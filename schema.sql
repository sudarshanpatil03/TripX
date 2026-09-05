-- ==========================================
-- TripX Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ==========================================

-- 1. Users Table (extends Supabase Auth)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger to automatically create a profile in public.users on sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, avatar_url)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', new.email), new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. Trips Table
CREATE TABLE public.trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  starting_location TEXT,
  destination TEXT NOT NULL,
  cover_image_url TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'upcoming',
  estimated_budget NUMERIC,
  created_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 3. Trip Members Table
CREATE TABLE public.trip_members (
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- owner, admin, member, pending
  permissions JSONB DEFAULT '{"viewTrip": true, "addExpense": true, "editExpense": false, "deleteExpense": false, "addPlace": true, "editItinerary": false, "deleteItinerary": false, "manageMembers": false}'::jsonb,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (trip_id, user_id)
);


-- 4. Expenses Table
CREATE TABLE public.expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  category TEXT NOT NULL,
  paid_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
  note TEXT,
  receipt_url TEXT,
  expense_date DATE NOT NULL,
  expense_time TIME NOT NULL,
  created_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 5. Expense Splits Table (who owes what for an expense)
CREATE TABLE public.expense_splits (
  expense_id UUID REFERENCES public.expenses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  amount_owed NUMERIC NOT NULL,
  PRIMARY KEY (expense_id, user_id)
);


-- 6. Itinerary Activities Table
CREATE TABLE public.itinerary_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  activity_date DATE NOT NULL,
  activity_time TIME,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  icon TEXT,
  duration TEXT,
  cost NUMERIC DEFAULT 0,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 7. Activity History Table
CREATE TABLE public.activity_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action_description TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_history ENABLE ROW LEVEL SECURITY;

-- Helper Functions to prevent infinite recursion in RLS
CREATE OR REPLACE FUNCTION public.is_member_of(target_trip_id uuid)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.trip_members 
    WHERE trip_id = target_trip_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin_of(target_trip_id uuid)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.trip_members 
    WHERE trip_id = target_trip_id AND user_id = auth.uid() AND role IN ('owner', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users can read all users (needed to see who is on a trip)
CREATE POLICY "Users are viewable by everyone" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Trips
CREATE POLICY "View trips you are a member of" ON public.trips FOR SELECT USING (auth.uid() = created_by OR public.is_member_of(id));
CREATE POLICY "Users can create trips" ON public.trips FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Update trips if owner or admin" ON public.trips FOR UPDATE USING (public.is_admin_of(id));

-- Trip Members
CREATE POLICY "View trip members of your trips" ON public.trip_members FOR SELECT USING (public.is_member_of(trip_id));
CREATE POLICY "Insert trip members" ON public.trip_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Update trip members" ON public.trip_members FOR UPDATE USING (public.is_admin_of(trip_id));

-- Expenses
CREATE POLICY "View expenses of your trips" ON public.expenses FOR SELECT USING (public.is_member_of(trip_id));
CREATE POLICY "Insert expenses" ON public.expenses FOR INSERT WITH CHECK (public.is_member_of(trip_id));
CREATE POLICY "Update expenses" ON public.expenses FOR UPDATE USING (public.is_member_of(trip_id));
CREATE POLICY "Delete expenses" ON public.expenses FOR DELETE USING (public.is_member_of(trip_id));

-- Expense splits
CREATE POLICY "View expense splits" ON public.expense_splits FOR SELECT USING (true);
CREATE POLICY "Insert expense splits" ON public.expense_splits FOR INSERT WITH CHECK (true);
CREATE POLICY "Update expense splits" ON public.expense_splits FOR UPDATE USING (true);
CREATE POLICY "Delete expense splits" ON public.expense_splits FOR DELETE USING (true);

-- Itinerary
CREATE POLICY "View itinerary" ON public.itinerary_activities FOR SELECT USING (true);
CREATE POLICY "Insert itinerary" ON public.itinerary_activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Update itinerary" ON public.itinerary_activities FOR UPDATE USING (true);
CREATE POLICY "Delete itinerary" ON public.itinerary_activities FOR DELETE USING (true);

-- Activity History
CREATE POLICY "View activity history" ON public.activity_history FOR SELECT USING (true);
CREATE POLICY "Insert activity history" ON public.activity_history FOR INSERT WITH CHECK (true);

-- ==========================================
-- STORAGE BUCKETS
-- ==========================================
-- (Run this after creating the 'receipts' and 'memories' buckets in the Storage UI)
-- Or you can just use the Storage UI to create them and set them to public.
