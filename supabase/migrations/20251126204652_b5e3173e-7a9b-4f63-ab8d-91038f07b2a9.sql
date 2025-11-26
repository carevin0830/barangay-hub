-- Create activities table
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  expected_participants INTEGER,
  status TEXT NOT NULL DEFAULT 'Scheduled',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (similar to other tables)
CREATE POLICY "Enable read access for all users" ON public.activities
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.activities
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.activities
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.activities
  FOR DELETE USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON public.activities
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();