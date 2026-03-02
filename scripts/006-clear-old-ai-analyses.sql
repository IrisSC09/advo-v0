-- Remove all stored AI analysis/cache data.
-- Run in Supabase SQL editor.

-- Optional: clear legacy usage table if present from earlier iterations.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'ai_daily_summaries'
  ) THEN
    EXECUTE 'TRUNCATE TABLE public.ai_daily_summaries RESTART IDENTITY';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'ai_summary_usage'
  ) THEN
    EXECUTE 'TRUNCATE TABLE public.ai_summary_usage RESTART IDENTITY';
  END IF;
END $$;
