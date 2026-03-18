-- Add owner_id to restaurants
ALTER TABLE IF EXISTS public.restaurants 
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);

-- Create analytics table
CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- e.g., 'book_button_click'
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on analytics
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Analytics Policies
CREATE POLICY "Owners can view their own restaurant analytics"
    ON public.analytics
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.restaurants
            WHERE public.restaurants.id = public.analytics.restaurant_id
            AND public.restaurants.owner_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can insert analytics"
    ON public.analytics
    FOR INSERT
    WITH CHECK (true);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    cover_image TEXT,
    category TEXT,
    author_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on blog_posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Blog Policies
CREATE POLICY "Anyone can view blog posts"
    ON public.blog_posts
    FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage blog posts"
    ON public.blog_posts
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE public.profiles.id = auth.uid()
            AND public.profiles.role = 'admin'
        )
    );

-- Add 'owner' to profiles role check (if using check constraint)
-- ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
-- ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'admin', 'owner'));
