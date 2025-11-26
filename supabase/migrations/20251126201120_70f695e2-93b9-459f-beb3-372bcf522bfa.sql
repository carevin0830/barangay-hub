-- Create ordinances table
CREATE TABLE public.ordinances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ordinance_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date_enacted DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ordinances ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your needs)
CREATE POLICY "Enable read access for all users" 
ON public.ordinances 
FOR SELECT 
USING (true);

CREATE POLICY "Enable insert access for all users" 
ON public.ordinances 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update access for all users" 
ON public.ordinances 
FOR UPDATE 
USING (true);

CREATE POLICY "Enable delete access for all users" 
ON public.ordinances 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_ordinances_updated_at
BEFORE UPDATE ON public.ordinances
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();