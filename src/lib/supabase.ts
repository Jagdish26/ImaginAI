import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface SubscriptionTier {
  id: string
  name: string
  price_monthly: number
  transforms_per_week: number
  features: Record<string, any>
  created_at: string
  updated_at: string
}

export interface UserSubscription {
  id: string
  user_id: string
  tier_id: string
  status: 'active' | 'cancelled' | 'expired' | 'pending'
  created_at: string
  expires_at: string | null
  stripe_subscription_id: string | null
  updated_at: string
  subscription_tiers?: SubscriptionTier
}

export interface Transformation {
  id: string
  user_id: string
  original_filename: string
  output_url: string | null
  status: 'pending' | 'processing' | 'completed' | 'failed'
  created_at: string
  completed_at: string | null
  file_size: number | null
  processing_time: number | null
  style: 'ghibli' | 'spirited_away' | 'totoro' | 'howls_castle'
  error_message: string | null
}

export interface UsageTracking {
  id: string
  user_id: string
  week_start: string
  transforms_used: number
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
  preferences: Record<string, any>
}

export interface TempFile {
  id: string
  user_id: string
  filename: string
  file_path: string
  file_size: number
  mime_type: string
  upload_completed_at: string | null
  scheduled_deletion_at: string
  webhook_status: 'pending' | 'success' | 'failed' | 'retrying'
  privacy_status: {
    exif_removed: boolean
    original_deleted: boolean
    encrypted_storage: boolean
  }
  created_at: string
  updated_at: string
}

export interface StorageQuota {
  id: string
  user_id: string
  total_quota: number
  used_storage: number
  temp_storage: number
  permanent_storage: number
  daily_uploads: number
  daily_upload_limit: number
  created_at: string
  updated_at: string
}

// Auth helpers
export const signUp = async (email: string, password: string, fullName?: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// Database helpers
export const getSubscriptionTiers = async () => {
  const { data, error } = await supabase
    .from('subscription_tiers')
    .select('*')
    .order('price_monthly', { ascending: true })
  
  return { data, error }
}

export const getUserSubscription = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select(`
      *,
      subscription_tiers (*)
    `)
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()
  
  return { data, error }
}

export const getUserTransformations = async (userId: string, limit = 10) => {
  const { data, error } = await supabase
    .from('transformations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  return { data, error }
}

export const getCurrentWeekUsage = async (userId: string) => {
  const { data, error } = await supabase
    .rpc('get_current_week_usage', { p_user_id: userId })
  
  return { data, error }
}

export const canUserTransform = async (userId: string) => {
  const { data, error } = await supabase
    .rpc('can_user_transform', { p_user_id: userId })
  
  return { data, error }
}

export const createTransformation = async (transformation: Partial<Transformation>) => {
  const { data, error } = await supabase
    .from('transformations')
    .insert(transformation)
    .select()
    .single()
  
  return { data, error }
}

export const updateTransformation = async (id: string, updates: Partial<Transformation>) => {
  const { data, error } = await supabase
    .from('transformations')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  return { data, error }
}

export const incrementUsage = async (userId: string) => {
  const { data, error } = await supabase
    .rpc('increment_usage', { p_user_id: userId })
  
  return { data, error }
}

// Storage helpers
export const uploadTempFile = async (file: File, userId: string) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from('temp-uploads')
    .upload(fileName, file)
  
  return { data, error }
}

export const getTempFileUrl = async (path: string) => {
  const { data } = supabase.storage
    .from('temp-uploads')
    .getPublicUrl(path)
  
  return data.publicUrl
}

export const deleteTempFile = async (path: string) => {
  const { data, error } = await supabase.storage
    .from('temp-uploads')
    .remove([path])
  
  return { data, error }
}

export const getTransformationUrl = async (path: string) => {
  const { data } = supabase.storage
    .from('transformations')
    .getPublicUrl(path)
  
  return data.publicUrl
}

// Temporary file management
export const getTempFiles = async (userId: string) => {
  const { data, error } = await supabase
    .from('temp_files')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export const createTempFile = async (tempFile: Partial<TempFile>) => {
  const { data, error } = await supabase
    .from('temp_files')
    .insert(tempFile)
    .select()
    .single()
  
  return { data, error }
}

export const updateTempFile = async (id: string, updates: Partial<TempFile>) => {
  const { data, error } = await supabase
    .from('temp_files')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  return { data, error }
}

export const deleteTempFileRecord = async (id: string) => {
  const { data, error } = await supabase
    .from('temp_files')
    .delete()
    .eq('id', id)
  
  return { data, error }
}

// Storage quota management
export const getStorageQuota = async (userId: string) => {
  const { data, error } = await supabase
    .from('storage_quotas')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  return { data, error }
}

export const updateStorageQuota = async (userId: string, updates: Partial<StorageQuota>) => {
  const { data, error } = await supabase
    .from('storage_quotas')
    .upsert({ user_id: userId, ...updates })
    .select()
    .single()
  
  return { data, error }
}

// Real-time subscriptions
export const subscribeToTempFiles = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('temp_files_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'temp_files',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe()
}

export const subscribeToStorageQuota = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('storage_quota_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'storage_quotas',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe()
}

// Webhook management
export const updateWebhookStatus = async (tempFileId: string, status: 'pending' | 'success' | 'failed' | 'retrying') => {
  const { data, error } = await supabase
    .from('temp_files')
    .update({ webhook_status: status, updated_at: new Date().toISOString() })
    .eq('id', tempFileId)
    .select()
    .single()
  
  return { data, error }
}

// Analytics helpers
export const getStorageAnalytics = async (userId: string, days = 7) => {
  const { data, error } = await supabase
    .rpc('get_storage_analytics', { 
      p_user_id: userId, 
      p_days: days 
    })
  
  return { data, error }
}

export const getUsageAnalytics = async (userId: string, weeks = 4) => {
  const { data, error } = await supabase
    .rpc('get_usage_analytics', { 
      p_user_id: userId, 
      p_weeks: weeks 
    })
  
  return { data, error }
}