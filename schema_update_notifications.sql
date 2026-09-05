-- ==========================================
-- TripX Notification System Schema
-- Run this in the Supabase SQL Editor
-- ==========================================

CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_email TEXT,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'trip_invite', 'invite_declined', 'invite_accepted'
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'declined'
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view notifications meant for them (via ID or Email) or sent by them
CREATE POLICY "View own notifications" ON public.notifications
FOR SELECT USING (
  user_id = auth.uid() OR 
  receiver_email = (auth.jwt()->>'email') OR
  sender_id = auth.uid()
);

-- Users can insert notifications if they are the sender
CREATE POLICY "Insert notifications" ON public.notifications
FOR INSERT WITH CHECK (
  sender_id = auth.uid()
);

-- Users can update notifications meant for them
CREATE POLICY "Update own notifications" ON public.notifications
FOR UPDATE USING (
  user_id = auth.uid() OR 
  receiver_email = (auth.jwt()->>'email')
);
