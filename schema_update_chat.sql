-- ==========================================
-- TripX Live Chat Schema
-- Run this in the Supabase SQL Editor
-- ==========================================

CREATE TABLE IF NOT EXISTS public.trip_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL, -- The sender
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.trip_messages ENABLE ROW LEVEL SECURITY;

-- 1. Users can view messages for trips they belong to
DROP POLICY IF EXISTS "Members can view trip messages" ON public.trip_messages;
CREATE POLICY "Members can view trip messages" 
  ON public.trip_messages FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.trip_members 
      WHERE trip_members.trip_id = trip_messages.trip_id 
      AND trip_members.user_id = auth.uid()
      AND trip_members.role != 'removed'
    )
  );

-- 2. Users can insert messages to trips they belong to
DROP POLICY IF EXISTS "Members can send trip messages" ON public.trip_messages;
CREATE POLICY "Members can send trip messages" 
  ON public.trip_messages FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.trip_members 
      WHERE trip_members.trip_id = trip_messages.trip_id 
      AND trip_members.user_id = auth.uid()
      AND trip_members.role != 'removed'
    )
    AND user_id = auth.uid()
  );

-- Note: We do not need dummy data here since messages are highly specific to the current user and their active trip.
