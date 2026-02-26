-- Re-create user_consents with correct schema and audit trail
DROP TABLE IF EXISTS public.user_consents CASCADE;
DROP TABLE IF EXISTS public.user_consents_history CASCADE;

CREATE TABLE public.user_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    consent_type TEXT NOT NULL,
    is_accepted BOOLEAN NOT NULL DEFAULT false,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, consent_type)
);

CREATE TABLE public.user_consents_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_consent_id UUID REFERENCES public.user_consents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    consent_type TEXT NOT NULL,
    is_accepted BOOLEAN NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Function to track changes into history table automatically
CREATE OR REPLACE FUNCTION public.log_user_consent_change()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_consents_history (user_consent_id, user_id, consent_type, is_accepted, ip_address, user_agent)
    VALUES (NEW.id, NEW.user_id, NEW.consent_type, NEW.is_accepted, NEW.ip_address, NEW.user_agent);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the history logging
CREATE TRIGGER trg_log_user_consent
AFTER INSERT OR UPDATE ON public.user_consents
FOR EACH ROW EXECUTE FUNCTION public.log_user_consent_change();

-- Enable RLS
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_consents_history ENABLE ROW LEVEL SECURITY;

-- Policies for RLS
CREATE POLICY "Users can manage their own consents"
    ON public.user_consents
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own consent history"
    ON public.user_consents_history FOR SELECT
    USING (auth.uid() = user_id);
