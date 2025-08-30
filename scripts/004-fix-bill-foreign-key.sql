-- Remove the foreign key constraint from threads table
-- since we're using external bill IDs that may not exist in our bills table
ALTER TABLE public.threads DROP CONSTRAINT IF EXISTS threads_bill_id_fkey;

-- Change bill_id to allow any string value (external API IDs)
ALTER TABLE public.threads ALTER COLUMN bill_id TYPE TEXT;

-- Add an index for better performance on bill_id lookups
CREATE INDEX IF NOT EXISTS idx_threads_bill_id ON public.threads(bill_id);

-- Update the bills table to handle external IDs better
ALTER TABLE public.bills ALTER COLUMN id TYPE TEXT;

-- Add a column to track if this is an external bill reference
ALTER TABLE public.threads ADD COLUMN IF NOT EXISTS external_bill_reference BOOLEAN DEFAULT TRUE;
