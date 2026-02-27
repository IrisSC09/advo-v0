CREATE TABLE IF NOT EXISTS public.bill_follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  bill_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, bill_id)
);
ALTER TABLE public.bill_follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own follows" ON public.bill_follows FOR ALL USING (auth.uid() = user_id);