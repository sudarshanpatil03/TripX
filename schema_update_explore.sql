-- ==========================================
-- TripX Explore & Recommendations Schema
-- Run this in the Supabase SQL Editor
-- ==========================================

-- 1. Global Destinations (For main Explore page)
CREATE TABLE IF NOT EXISTS public.global_destinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  popularity_score INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.global_destinations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users on destinations" ON public.global_destinations;
CREATE POLICY "Enable read access for all users on destinations" 
  ON public.global_destinations FOR SELECT 
  USING (true);

-- 2. Global Spots (For Trip-specific Explore Places)
CREATE TABLE IF NOT EXISTS public.global_spots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  destination TEXT NOT NULL, -- The city name to match against (e.g. 'Goa', 'Mumbai')
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.global_spots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users on spots" ON public.global_spots;
CREATE POLICY "Enable read access for all users on spots" 
  ON public.global_spots FOR SELECT 
  USING (true);

-- Insert dummy data for global_destinations
INSERT INTO public.global_destinations (name, image_url, popularity_score)
VALUES 
  ('Goa, India', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop', 100),
  ('Manali, Himachal Pradesh', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop', 95),
  ('Kashi, Uttar Pradesh', 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop', 90),
  ('Mumbai, Maharashtra', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&auto=format&fit=crop', 85),
  ('Udaipur, Rajasthan', 'https://images.unsplash.com/photo-1542314831-c6a4d142104d?w=800&auto=format&fit=crop', 80),
  ('Paris, France', 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&auto=format&fit=crop', 75)
ON CONFLICT DO NOTHING;

-- Insert dummy data for global_spots
INSERT INTO public.global_spots (destination, title, location, description, image_url)
VALUES 
  ('Goa', 'Baga Beach', 'North Goa', 'Famous for its vibrant nightlife, water sports, and beach shacks.', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&auto=format&fit=crop'),
  ('Goa', 'Dudhsagar Falls', 'South Goa', 'Majestic four-tiered waterfall located on the Mandovi River.', 'https://images.unsplash.com/photo-1598462002102-143003046f88?w=500&auto=format&fit=crop'),
  ('Goa', 'Aguada Fort', 'Candolim', 'A 17th-century Portuguese fort standing on Sinquerim Beach.', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop'),
  
  ('Mumbai', 'Gateway of India', 'Colaba', 'Iconic arch monument built in the early 20th century.', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=500&auto=format&fit=crop'),
  ('Mumbai', 'Marine Drive', 'South Mumbai', 'A 3.6-kilometer-long boulevard, famously known as the Queen''s Necklace.', 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=500&auto=format&fit=crop'),
  ('Mumbai', 'Elephanta Caves', 'Elephanta Island', 'A network of sculpted caves located on Elephanta Island.', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&auto=format&fit=crop'),

  ('Kashi', 'Dashashwamedh Ghat', 'Varanasi', 'The main and most spectacular ghat on the Ganges River.', 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=500&auto=format&fit=crop'),
  ('Kashi', 'Kashi Vishwanath Temple', 'Varanasi', 'One of the most famous Hindu temples dedicated to Lord Shiva.', 'https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=500&auto=format&fit=crop'),

  ('Manali', 'Solang Valley', 'Kullu', 'A side valley at the top of the Kullu Valley, famous for its summer and winter sports.', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=500&auto=format&fit=crop'),
  ('Manali', 'Rohtang Pass', 'Pir Panjal Range', 'A high mountain pass connecting the Kullu Valley with the Lahaul and Spiti Valleys.', 'https://images.unsplash.com/photo-1542314831-c6a4d142104d?w=500&auto=format&fit=crop'),

  ('Udaipur', 'City Palace', 'Lake Pichola', 'A palace complex situated in the city of Udaipur, built over nearly 400 years.', 'https://images.unsplash.com/photo-1542314831-c6a4d142104d?w=500&auto=format&fit=crop'),
  ('Udaipur', 'Lake Pichola', 'Udaipur', 'An artificial fresh water lake, created in the year 1362 AD.', 'https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=500&auto=format&fit=crop'),

  ('Paris', 'Eiffel Tower', 'Champ de Mars', 'Iconic iron lattice tower.', 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=500&auto=format&fit=crop'),
  ('Paris', 'Louvre Museum', 'Rue de Rivoli', 'World largest art museum.', 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=500&auto=format&fit=crop')
ON CONFLICT DO NOTHING;
