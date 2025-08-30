-- Remove the foreign key constraint that's causing the issue
ALTER TABLE public.threads DROP CONSTRAINT IF EXISTS threads_bill_id_fkey;

-- Add a column to track if this is an external bill reference
ALTER TABLE public.threads ADD COLUMN IF NOT EXISTS external_bill_reference BOOLEAN DEFAULT TRUE;

-- Update existing threads to mark them as external references
UPDATE public.threads SET external_bill_reference = TRUE WHERE external_bill_reference IS NULL;

-- Create an index on bill_id for better performance
CREATE INDEX IF NOT EXISTS idx_threads_bill_id ON public.threads(bill_id);

-- Create an index on external_bill_reference for filtering
CREATE INDEX IF NOT EXISTS idx_threads_external_bill ON public.threads(external_bill_reference);

-- Update RLS policies to ensure threads are visible to everyone
DROP POLICY IF EXISTS "Threads are viewable by everyone" ON public.threads;
CREATE POLICY "Threads are viewable by everyone" ON public.threads FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create threads" ON public.threads;
CREATE POLICY "Users can create threads" ON public.threads FOR INSERT WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can update own threads" ON public.threads;
CREATE POLICY "Users can update own threads" ON public.threads FOR UPDATE USING (auth.uid() = author_id);

-- Ensure profiles can be created by authenticated users
DROP POLICY IF EXISTS "Users can create own profile" ON public.profiles;
CREATE POLICY "Users can create own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
