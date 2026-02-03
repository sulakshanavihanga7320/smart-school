import { supabase } from './src/lib/supabase.js';

async function checkIds() {
    console.log("Checking IDs...");

    // 1. Get a student
    const { data: students, error } = await supabase.from('students').select('*').limit(1);

    if (students && students.length > 0) {
        console.log("Student Record:", students[0]);
        // Check if there's a user_id or auth_id column different from 'id'
    } else {
        console.log("No students found or error:", error);
    }

    // 2. Get current auth user (if possible in this env, but hard without session)
    // We'll just rely on viewing the column names from step 1 output
}

checkIds();
