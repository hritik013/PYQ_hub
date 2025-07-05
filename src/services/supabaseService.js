import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zfxdjxpozpuiydwgizfo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmeGRqeHBvenB1aXlkd2dpemZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNzI3MjQsImV4cCI6MjA2Njg0ODcyNH0.QBdQfozY2seczr66BAKUAjrtv2OHbk9C5FcDoIZL2kc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Save PYQ metadata to Supabase
export async function savePYQToSupabase(pyqData) {
  const { data, error } = await supabase.from('pyqs').insert([pyqData]);
  if (error) throw error;
  return data;
}

// Fetch all PYQs from Supabase
export async function fetchPYQsFromSupabase() {
  const { data, error } = await supabase.from('pyqs').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
} 