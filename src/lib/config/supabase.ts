import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zfqvjgephyisznfkadpm.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, String(supabaseKey));

export default supabase;
