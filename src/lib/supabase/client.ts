import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hhbzujouvzwktxfkrpbx.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_mJoAPPylDB7kdW_wumv37Q_OCnB-oWj";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
