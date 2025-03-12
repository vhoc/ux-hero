"use server";
import { createClient } from "@/utils/supabase/server";

export const signOut = async () => {
  const supabase = await createClient()
  const { error: signOutError } = await supabase.auth.signOut()
  if (signOutError) {
    console.error('Error signing out: ', signOutError)
  }
}