import { createClient } from '@supabase/supabase-js';

// STRICT HARDCODED VALUES - NO ENV VARS
// This ensures that even if Vercel env vars are missing, the app works.
const URL = "https://zoevnoomuwupskeodlms.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZXZub29tdXd1cHNrZW9kbG1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwOTQ4ODYsImV4cCI6MjA4NTY3MDg4Nn0.7AKK9MK8UY4nMdXDrkjuVVAiH84nMsyLwI-8JXwBfog";

console.log("Initializing Supabase Client with Hardcoded Credentials...");

export const supabase = createClient(URL, KEY);
