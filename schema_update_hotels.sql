-- ==========================================
-- TripX Global Hotels Schema
-- Run this in the Supabase SQL Editor
-- ==========================================

CREATE TABLE IF NOT EXISTS public.global_hotels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  rating DECIMAL(2,1) NOT NULL, -- e.g., 4.5
  price_per_night DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  provider TEXT NOT NULL, -- 'Booking.com', 'Airbnb', 'Agoda'
  booking_url TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.global_hotels ENABLE ROW LEVEL SECURITY;

-- Anyone can read available hotels
DROP POLICY IF EXISTS "Enable read access for all users on hotels" ON public.global_hotels;
CREATE POLICY "Enable read access for all users on hotels" 
  ON public.global_hotels FOR SELECT 
  USING (true);

-- Insert realistic mock data
INSERT INTO public.global_hotels (name, location, rating, price_per_night, provider, booking_url, image_url)
VALUES 
  ('Taj Exotica Resort & Spa', 'Goa', 4.9, 25000.00, 'Booking.com', 'https://www.booking.com', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
  ('Seaside Villa', 'Goa', 4.5, 4500.00, 'Airbnb', 'https://www.airbnb.com', 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
  ('W Goa', 'Goa', 4.7, 18500.00, 'MakeMyTrip', 'https://www.makemytrip.com/hotels/', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
  ('Zostel Hostel', 'Goa', 4.2, 999.00, 'Agoda', 'https://www.agoda.com', 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
  
  ('Oberoi Udaivilas', 'Udaipur', 5.0, 35000.00, 'Booking.com', 'https://www.booking.com', 'https://images.unsplash.com/photo-1542314831-c6a4d142104d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
  ('Lake View Guesthouse', 'Udaipur', 4.3, 2100.00, 'Airbnb', 'https://www.airbnb.com', 'https://images.unsplash.com/photo-1517840901100-8179e982acb7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
  
  ('Taj Mahal Palace', 'Mumbai', 5.0, 45000.00, 'Booking.com', 'https://www.booking.com', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
  ('Trident Nariman Point', 'Mumbai', 4.8, 15000.00, 'MakeMyTrip', 'https://www.makemytrip.com', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
  ('Bandra Sea View Apartment', 'Mumbai', 4.5, 6000.00, 'Airbnb', 'https://www.airbnb.com', 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
  
  ('Kashi Ashram Stay', 'Kashi', 4.2, 1200.00, 'Agoda', 'https://www.agoda.com', 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
  ('Ganges View Hotel', 'Kashi', 4.6, 3500.00, 'Booking.com', 'https://www.booking.com', 'https://images.unsplash.com/photo-1517840901100-8179e982acb7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
  
  ('Snow Valley Resorts', 'Manali', 4.5, 5500.00, 'MakeMyTrip', 'https://www.makemytrip.com', 'https://images.unsplash.com/photo-1542314831-c6a4d142104d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
  ('Riverside Cottage', 'Manali', 4.8, 4200.00, 'Airbnb', 'https://www.airbnb.com', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')
ON CONFLICT DO NOTHING;
