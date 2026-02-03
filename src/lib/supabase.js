import { createClient } from '@supabase/supabase-js';

// Hardcoded values for quick deployment (as requested)
const HARDCODED_URL = "https://zoevnoomuwupskeodlms.supabase.co";
const HARDCODED_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZXZub29tdXd1cHNrZW9kbG1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwOTQ4ODYsImV4cCI6MjA4NTY3MDg4Nn0.7AKK9MK8UY4nMdXDrkjuVVAiH84nMsyLwI-8JXwBfog";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || HARDCODED_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || HARDCODED_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
