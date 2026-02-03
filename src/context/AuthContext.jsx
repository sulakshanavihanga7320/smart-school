import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState('admin');
    const [loading, setLoading] = useState(true);

    const fetchUserRole = async (user) => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (error || !data) {
                console.warn('Profile missing. Creating auto-profile for:', user.email);

                // Auto-create profile so notifications work
                const { error: insertError } = await supabase.from('profiles').insert([{
                    id: user.id,
                    email: user.email,
                    role: 'admin', // Default role
                    full_name: user.email.split('@')[0]
                }]);

                if (insertError) {
                    console.error("Auto-profile creation failed:", insertError);
                }

                setUserRole('admin');
            } else {
                setUserRole(data.role);
            }
        } catch (err) {
            console.error('Error fetching role:', err);
            setUserRole('admin');
        }
    };

    useEffect(() => {
        let mounted = true;

        const getSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) console.error('Session fetch error:', error);

                if (session?.user && mounted) {
                    setUser(session.user);
                    await fetchUserRole(session.user);
                }
            } catch (err) {
                console.error('Session check failed:', err);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        getSession();

        // Safety net: force loading to false after 3 seconds no matter what
        const timer = setTimeout(() => {
            if (mounted) setLoading(false);
        }, 3000);

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            try {
                if (session?.user && mounted) {
                    setUser(session.user);
                    await fetchUserRole(session.user);
                } else if (mounted) {
                    setUser(null);
                    setUserRole(null);
                }
            } catch (err) {
                console.error('Auth state change error:', err);
            } finally {
                if (mounted) setLoading(false);
            }
        });

        return () => {
            mounted = false;
            clearTimeout(timer);
            subscription.unsubscribe();
        };
    }, []);

    const value = {
        signUp: (data) => supabase.auth.signUp(data),
        signIn: (data) => supabase.auth.signInWithPassword(data),
        signOut: () => supabase.auth.signOut(),
        user,
        userRole,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
