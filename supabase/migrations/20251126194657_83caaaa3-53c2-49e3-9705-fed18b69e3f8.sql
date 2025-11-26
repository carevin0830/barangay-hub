-- Create officials table
CREATE TABLE IF NOT EXISTS public.officials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id UUID REFERENCES public.residents(id) ON DELETE CASCADE NOT NULL,
  position TEXT NOT NULL,
  term_start DATE NOT NULL,
  term_end DATE,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.officials ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for all users" 
  ON public.officials FOR SELECT 
  USING (true);

CREATE POLICY "Enable insert access for all users" 
  ON public.officials FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Enable update access for all users" 
  ON public.officials FOR UPDATE 
  USING (true);

CREATE POLICY "Enable delete access for all users" 
  ON public.officials FOR DELETE 
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_officials_updated_at
  BEFORE UPDATE ON public.officials
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();