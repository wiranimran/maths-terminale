import { createClient } from "@supabase/supabase-js";

const url = process.env.REACT_APP_SUPABASE_URL || "";
const key = process.env.REACT_APP_SUPABASE_ANON_KEY || "";

// Retourne null si les variables d'env ne sont pas renseignées
// → l'app bascule automatiquement sur localStorage
export const supabase =
  url && key && url !== "https://VOTRE_PROJECT_ID.supabase.co"
    ? createClient(url, key)
    : null;
