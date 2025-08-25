-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bills table
CREATE TABLE IF NOT EXISTS public.bills (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  sponsor TEXT NOT NULL,
  party TEXT NOT NULL,
  topic TEXT NOT NULL,
  status TEXT NOT NULL,
  introduced_date DATE NOT NULL,
  summary TEXT,
  key_points TEXT[],
  full_text TEXT,
  committee TEXT,
  next_action TEXT,
  ai_summary_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create threads table
CREATE TABLE IF NOT EXISTS public.threads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('zine', 'art', 'music', 'blog')),
  bill_id TEXT REFERENCES public.bills(id),
  author_id UUID REFERENCES public.profiles(id) NOT NULL,
  file_url TEXT,
  preview_url TEXT,
  tags TEXT[],
  likes_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_trending BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create thread_likes table
CREATE TABLE IF NOT EXISTS public.thread_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID REFERENCES public.threads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(thread_id, user_id)
);

-- Create thread_comments table
CREATE TABLE IF NOT EXISTS public.thread_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID REFERENCES public.threads(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_type)
);

-- Create user_streaks table
CREATE TABLE IF NOT EXISTS public.user_streaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE DEFAULT CURRENT_DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thread_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thread_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Bills are viewable by everyone" ON public.bills FOR SELECT USING (true);

CREATE POLICY "Threads are viewable by everyone" ON public.threads FOR SELECT USING (true);
CREATE POLICY "Users can create threads" ON public.threads FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own threads" ON public.threads FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Thread likes are viewable by everyone" ON public.thread_likes FOR SELECT USING (true);
CREATE POLICY "Users can manage own likes" ON public.thread_likes FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Thread comments are viewable by everyone" ON public.thread_comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON public.thread_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own comments" ON public.thread_comments FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "User badges are viewable by everyone" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "Users can view own badges" ON public.user_badges FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "User streaks are viewable by everyone" ON public.user_streaks FOR SELECT USING (true);
CREATE POLICY "Users can manage own streaks" ON public.user_streaks FOR ALL USING (auth.uid() = user_id);
