-- Create residents table
CREATE TABLE IF NOT EXISTS public.residents (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  age integer NOT NULL,
  gender text NOT NULL,
  purok text NOT NULL,
  status text NOT NULL DEFAULT 'Active',
  special_status text,
  household_id uuid REFERENCES public.households(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.residents ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Enable read access for all users" 
ON public.residents 
FOR SELECT 
USING (true);

CREATE POLICY "Enable insert access for all users" 
ON public.residents 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update access for all users" 
ON public.residents 
FOR UPDATE 
USING (true);

CREATE POLICY "Enable delete access for all users" 
ON public.residents 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates (using correct function name)
CREATE TRIGGER update_residents_updated_at
BEFORE UPDATE ON public.residents
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();