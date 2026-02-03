import { supabase } from './supabase';

// Helper to fetch all valid user IDs (Students + Teachers)
const getAllUserIds = async () => {
    try {
        const { data: sData } = await supabase.from('students').select('id');
        const { data: eData } = await supabase.from('employees').select('id');

        const ids = [];
        if (sData) ids.push(...sData.map(s => s.id));
        if (eData) ids.push(...eData.map(e => e.id));

        return ids;
    } catch (e) {
        console.error("Error fetching user IDs", e);
        return [];
    }
};

export const NotificationService = {
    // Send to a single user
    send: async (userId, title, message, type = 'info') => {
        try {
            await supabase.from('notifications').insert([{
                user_id: userId,
                title,
                message,
                type,
                is_read: false,
                created_at: new Date()
            }]);
        } catch (error) {
            console.error("Notification Send Error:", error);
        }
    },

    // Broadcast to EVERYONE (Staff + Students), optionally excluding one user (sender)
    broadcast: async (title, message, type = 'alert', excludeUserId = null) => {
        try {
            const allIds = await getAllUserIds();
            if (allIds.length === 0) return;

            // Filter out the sender so they don't get their own notification
            const targetIds = excludeUserId ? allIds.filter(id => id !== excludeUserId) : allIds;

            if (targetIds.length === 0) return;

            const notifications = targetIds.map(id => ({
                user_id: id,
                title,
                message,
                type,
                is_read: false,
                created_at: new Date()
            }));

            const { error } = await supabase.from('notifications').insert(notifications);
            if (error) console.error("Broadcast Insert Error:", error);

        } catch (error) {
            console.error("Broadcast Logic Error:", error);
        }
    }
};
