-- Drop existing policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage own streaks" ON public.user_streaks;
DROP POLICY IF EXISTS "Users can view own badges" ON public.user_badges;

-- Create more permissive policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Fix user_streaks policies
CREATE POLICY "User streaks are viewable by everyone" ON public.user_streaks FOR SELECT USING (true);
CREATE POLICY "Users can insert own streaks" ON public.user_streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own streaks" ON public.user_streaks FOR UPDATE USING (auth.uid() = user_id);

-- Fix user_badges policies  
CREATE POLICY "User badges are viewable by everyone" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "Users can insert own badges" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own badges" ON public.user_badges FOR UPDATE USING (auth.uid() = user_id);
