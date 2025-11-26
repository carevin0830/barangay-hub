-- Create certificates table
CREATE TABLE IF NOT EXISTS public.certificates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  certificate_no text NOT NULL UNIQUE,
  certificate_type text NOT NULL,
  resident_id uuid REFERENCES public.residents(id) ON DELETE CASCADE,
  resident_name text NOT NULL,
  resident_age integer,
  purpose text NOT NULL,
  issued_date date NOT NULL DEFAULT CURRENT_DATE,
  valid_until date,
  status text NOT NULL DEFAULT 'Active',
  control_number text,
  amount_paid numeric,
  business_type text,
  verified_by_kagawad1 text,
  verified_by_kagawad2 text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Enable read access for all users" 
ON public.certificates 
FOR SELECT 
USING (true);

CREATE POLICY "Enable insert access for all users" 
ON public.certificates 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update access for all users" 
ON public.certificates 
FOR UPDATE 
USING (true);

CREATE POLICY "Enable delete access for all users" 
ON public.certificates 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_certificates_updated_at
BEFORE UPDATE ON public.certificates
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create index for faster lookups
CREATE INDEX idx_certificates_resident_id ON public.certificates(resident_id);
CREATE INDEX idx_certificates_certificate_no ON public.certificates(certificate_no);