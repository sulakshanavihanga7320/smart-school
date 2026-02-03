import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { Menu, X, Bell, Search, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import './Layout.css';

const Layout = () => {
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    useEffect(() => {
        if (!user) return;

        fetchNotifications();

        // 1. Realtime Listener
        const subscription = supabase
            .channel('public:notifications')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
                // Filter manually for safety if RLS/filter string is tricky
                if (payload.new.user_id === user.id) {
                    setNotifications(prev => [payload.new, ...prev]);
                }
            })
            .subscribe();

        // 2. Polling Fallback (Every 5s) - Ensures even if realtime fails, data arrives
        const intervalId = setInterval(fetchNotifications, 5000);

        return () => {
            supabase.removeChannel(subscription);
            clearInterval(intervalId);
        };
    }, [user]);

    const fetchNotifications = async () => {
        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5);
        if (data) setNotifications(data);
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const markAsRead = async () => {
        if (unreadCount === 0) return;
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', user.id);
        fetchNotifications();
    };

    return (
        <div className="layout">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <main className={`content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <header className="top-nav glass">
                    <div className="nav-left">
                        <button className="mobile-toggle" onClick={toggleSidebar}>
                            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <div className="search-bar">
                            <input type="text" placeholder="Search anything..." />
                        </div>
                    </div>
                    <div className="header-actions">
                        <div className="notification-wrapper">
                            <button
                                className="icon-btn"
                                onClick={() => {
                                    setShowNotifications(!showNotifications);
                                    if (!showNotifications) markAsRead();
                                }}
                            >
                                {unreadCount > 0 && <span className="notification-dot">{unreadCount}</span>}
                                <Bell size={22} />
                            </button>

                            {showNotifications && (
                                <div className="notifications-dropdown glass animate-fade-in">
                                    <div className="dropdown-header">
                                        <h4>Notifications</h4>
                                    </div>
                                    <div className="notifications-list">
                                        {notifications.length > 0 ? (
                                            notifications.map(n => (
                                                <div key={n.id} className={`notification-item ${!n.is_read ? 'unread' : ''}`}>
                                                    <p className="notif-title">{n.title}</p>
                                                    <p className="notif-msg">{n.message}</p>
                                                    <span className="notif-time">{new Date(n.created_at).toLocaleTimeString()}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="empty-notif">No new notifications</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <button className="primary-btn hide-mobile">New Admission</button>
                    </div>
                </header>
                <div className="page-container" onClick={() => {
                    if (isSidebarOpen) setIsSidebarOpen(false);
                    if (showNotifications) setShowNotifications(false);
                }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
