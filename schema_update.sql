-- SQL Schema Update for TripX Remaining Features
-- Run this in your Supabase SQL Editor

-- 1. Places Table (Explore)
CREATE TABLE IF NOT EXISTS public.places (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  image_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Stays Table (Accommodation)
CREATE TABLE IF NOT EXISTS public.stays (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  check_in_date DATE,
  check_out_date DATE,
  booking_reference TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Transports Table
CREATE TABLE IF NOT EXISTS public.transports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- e.g., 'flight', 'train', 'bus'
  departure_location TEXT,
  arrival_location TEXT,
  departure_time TIMESTAMP WITH TIME ZONE,
  arrival_time TIMESTAMP WITH TIME ZONE,
  booking_reference TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Trip Memories Table
CREATE TABLE IF NOT EXISTS public.trip_memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on new tables
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_memories ENABLE ROW LEVEL SECURITY;

-- Create policies (Assuming anyone authenticated can read/write for now, to match basic usage)
-- You may want to restrict this to only trip_members later using an exists() subquery.
CREATE POLICY "Enable all access for authenticated users on places" ON public.places FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users on stays" ON public.stays FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users on transports" ON public.transports FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all access for authenticated users on trip_memories" ON public.trip_memories FOR ALL TO authenticated USING (true);
