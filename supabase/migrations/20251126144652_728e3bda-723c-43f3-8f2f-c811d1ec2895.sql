-- Create households table
CREATE TABLE IF NOT EXISTS public.households (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  house_number TEXT NOT NULL,
  purok TEXT,
  street_address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  has_electricity BOOLEAN DEFAULT false,
  has_water BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;

-- Create policies (public read/write for now - adjust based on your auth needs)
CREATE POLICY "Enable read access for all users" ON public.households
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.households
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.households
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.households
  FOR DELETE USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.households
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();