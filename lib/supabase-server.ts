import { createClient } from "@supabase/supabase-js"

export function createServerClient() {
  const supabaseUrl = "https://mweaqdserejokxniakyn.supabase.co"
  const supabaseServiceKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13ZWFxZHNlcmVqb2t4bmlha3luIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjA3MzM1NSwiZXhwIjoyMDcxNjQ5MzU1fQ.L2mLPEm4VSlWP8LlOli0FF67yqqhl3nIxHzEJtMRixU"

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export const supabase = createServerClient()
