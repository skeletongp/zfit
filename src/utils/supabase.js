import { createClient } from "@supabase/supabase-js";
import { useUserStore } from "@/store";
let supabaseUrl = "";
let supabaseAnonKey="";
let serviceRole=""
if (import.meta.NODE_ENV != "production") {
  supabaseUrl = import.meta.env.VITE_SUPABASE_LOCAL_URL;
  supabaseAnonKey = import.meta.env.VITE_SUPABASE_LOCAL_ANON_KEY;
  serviceRole=import.meta.env.VITE_SUPABASE_LOCAL_SERVICE_ROLE;
} else {
  supabaseUrl=import.meta.env.VITE_SUPABASE_URL;
  supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
}

const userRole = (role) => {
  const userStore = useUserStore();
  const currentRole = userStore.getUser?.role;

  if (role && role.includes(currentRole)) {
    return true;
  }
  return false;
};
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin=createClient(supabaseUrl, serviceRole,{
  auth: {
    autoRefreshToken: false,
    persistSession:true
  }
})

export { supabase, userRole, supabaseAdmin };
export default supabase;
