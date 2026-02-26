import { supabase } from '@/lib/supabase/client'

export type ConsentType = 'essential' | 'analytics' | 'marketing'

export const consentService = {
  async getUserConsents(userId: string) {
    const { data, error } = await supabase
      .from('user_consents')
      .select('consent_type, is_granted')
      .eq('user_id', userId)

    if (error) throw error
    return data
  },

  async upsertConsent(
    userId: string,
    consentType: ConsentType,
    isGranted: boolean,
  ) {
    // Check if a record already exists for this user and consent type
    const { data: existing, error: fetchError } = await supabase
      .from('user_consents')
      .select('id')
      .eq('user_id', userId)
      .eq('consent_type', consentType)
      .single()

    // Ignore PGRST116 (No rows found) which is expected if it doesn't exist
    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError
    }

    const payload = {
      user_id: userId,
      consent_type: consentType,
      is_granted: isGranted,
      user_agent: navigator.userAgent,
      updated_at: new Date().toISOString(),
    }

    if (existing) {
      const { error } = await supabase
        .from('user_consents')
        .update(payload)
        .eq('id', existing.id)
      if (error) throw error
    } else {
      const { error } = await supabase.from('user_consents').insert(payload)
      if (error) throw error
    }
  },
}
