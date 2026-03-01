CREATE TABLE IF NOT EXISTS public.ai_daily_summaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  bill_id TEXT NOT NULL,
  analysis_date DATE NOT NULL,
  analysis JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, bill_id, analysis_date)
);

CREATE INDEX IF NOT EXISTS idx_ai_daily_summaries_user_date
  ON public.ai_daily_summaries (user_id, analysis_date);
