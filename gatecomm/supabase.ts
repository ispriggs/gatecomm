import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iqdueavowcxmoefcsrla.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxZHVlYXZvd2N4bW9lZmNzcmxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NDU3MTcsImV4cCI6MjA4ODMyMTcxN30.HGkyq7v9FqULbnh9XZBkUMOCE9Tm0DHjd6CbCmj-q4g'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})