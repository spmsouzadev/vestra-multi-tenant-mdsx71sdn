import { supabase } from '@/lib/supabase/client'

export type ConsentType = 'TERMS_OF_USE' | 'ANALYTICS' | 'MARKETING'

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
    consentType: ConsentType,
    isAccepted: boolean,
  ) {
    let ip_address = null
    try {
      const res = await fetch('https://api.ipify.org?format=json')
      const json = await res.json()
      ip_address = json.ip
    } catch (e) {
      // ignore
    }

    const payload = {
      user_id: userId,
      consent_type: consentType,
      is_accepted: isAccepted,
      user_agent: navigator.userAgent,
      ip_address,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('user_consents')
      .upsert(payload, { onConflict: 'user_id,consent_type' })

    if (error) throw error
  },
}
