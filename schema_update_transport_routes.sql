-- ==========================================
-- TripX Global Transport Routes Schema
-- Run this in the Supabase SQL Editor
-- ==========================================

CREATE TABLE IF NOT EXISTS public.global_transport_routes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL, -- 'bus', 'flight', 'train', 'cab'
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  provider TEXT NOT NULL, -- 'RedBus', 'Book Karo', 'MakeMyTrip', 'Indigo', etc.
  departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
  arrival_time TIMESTAMP WITH TIME ZONE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  booking_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.global_transport_routes ENABLE ROW LEVEL SECURITY;

-- Anyone can read available routes
DROP POLICY IF EXISTS "Enable read access for all users on routes" ON public.global_transport_routes;
CREATE POLICY "Enable read access for all users on routes" 
  ON public.global_transport_routes FOR SELECT 
  USING (true);

-- Insert some realistic data for testing
INSERT INTO public.global_transport_routes (type, origin, destination, provider, departure_time, arrival_time, price, booking_url)
VALUES 
  ('bus', 'Mumbai', 'Goa', 'RedBus', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 12 hours', 1200.00, 'https://www.redbus.in'),
  ('bus', 'Mumbai', 'Goa', 'Book Karo', NOW() + INTERVAL '1 day 2 hours', NOW() + INTERVAL '1 day 14 hours', 1150.00, 'https://bookkaro.com'),
  ('bus', 'Mumbai', 'Goa', 'Zingbus', NOW() + INTERVAL '1 day 4 hours', NOW() + INTERVAL '1 day 16 hours', 999.00, 'https://www.zingbus.com'),
  ('flight', 'Delhi', 'Goa', 'Indigo', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days 2 hours', 5500.00, 'https://www.goindigo.in'),
  ('flight', 'Delhi', 'Goa', 'MakeMyTrip', NOW() + INTERVAL '2 days 1 hour', NOW() + INTERVAL '2 days 3 hours', 5200.00, 'https://www.makemytrip.com'),
  ('train', 'Bangalore', 'Goa', 'IRCTC', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days 14 hours', 850.00, 'https://www.irctc.co.in'),
  ('cab', 'Pune', 'Mumbai', 'Uber', NOW() + INTERVAL '5 hours', NOW() + INTERVAL '8 hours', 2500.00, 'https://www.uber.com/in/en/'),
  
  ('flight', 'Mumbai', 'Kashi', 'Air India', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 2 hours', 6500.00, 'https://www.airindia.com'),
  ('train', 'Delhi', 'Kashi', 'IRCTC', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days 10 hours', 1200.00, 'https://www.irctc.co.in'),
  
  ('bus', 'Delhi', 'Manali', 'Zingbus', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 14 hours', 1500.00, 'https://www.zingbus.com'),
  ('cab', 'Chandigarh', 'Manali', 'MakeMyTrip Cabs', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days 8 hours', 4500.00, 'https://www.makemytrip.com'),
  
  ('flight', 'Mumbai', 'Udaipur', 'Indigo', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days 1 hour', 4200.00, 'https://www.goindigo.in'),
  ('train', 'Delhi', 'Udaipur', 'IRCTC', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 12 hours', 950.00, 'https://www.irctc.co.in'),
  
  ('flight', 'Bangalore', 'Mumbai', 'Vistara', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 2 hours', 5800.00, 'https://www.airvistara.com'),
  ('bus', 'Pune', 'Mumbai', 'RedBus', NOW() + INTERVAL '5 hours', NOW() + INTERVAL '8 hours', 400.00, 'https://www.redbus.in')
ON CONFLICT DO NOTHING;
