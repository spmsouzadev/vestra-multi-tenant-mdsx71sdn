-- Create the user_consents table for tracking LGPD consent
CREATE TABLE public.user_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    consent_type VARCHAR(50) NOT NULL,
    is_granted BOOLEAN NOT NULL DEFAULT false,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add a unique index to easily enforce one record per user per consent_type
-- The WHERE clause ensures it only applies to logged-in users (if anonymous tracking was enabled later)
CREATE UNIQUE INDEX idx_user_consents_user_type 
ON public.user_consents (user_id, consent_type) 
WHERE user_id IS NOT NULL;

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;

-- Policies for user_consents
CREATE POLICY "Users can view their own consents"
    ON public.user_consents FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consents"
    ON public.user_consents FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own consents"
    ON public.user_consents FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
