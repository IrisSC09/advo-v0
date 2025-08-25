import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://mweaqdserejokxniakyn.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13ZWFxZHNlcmVqb2t4bmlha3luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNzMzNTUsImV4cCI6MjA3MTY0OTM1NX0.9D09ycbbcvIh11986GC35cZ-CT_wiOA4vlJ7QryfSaE"

export function createServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey)
}
