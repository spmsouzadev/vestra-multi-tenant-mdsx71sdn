import { supabase } from '@/lib/supabase/client'

export type ConsentType = 'Termos de Uso' | 'Cookies Analíticos' | 'Marketing'

export const consentService = {
  async getUserConsents(userId: string) {
    const { data, error } = await supabase
      .from('user_consents')
      .select('consent_type, is_accepted')
      .eq('user_id', userId)

    if (error) throw error
    return data
  },

  async upsertConsent(
    userId: string,
    consentType: string,
    isAccepted: boolean,
  ) {
    const payload = {
      user_id: userId,
      consent_type: consentType,
      is_accepted: isAccepted,
      user_agent: navigator.userAgent,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('user_consents')
      .upsert(payload, { onConflict: 'user_id,consent_type' })

    if (error) throw error
  },
}
