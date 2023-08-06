import { createClient } from "@supabase/supabase-js";
import { useUserStore } from "@/store";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const userRole = (role) => {
  const userStore = useUserStore();
  const currentRole = userStore.getUser?.role;
  if (!Array.isArray(role)) {
    role = [role];
  }

  if (role && role.includes(currentRole)) {
    return true;
  }
  return false;
};
const supabase = createClient(supabaseUrl, supabaseAnonKey);


export { supabase, userRole };
export default supabase;
