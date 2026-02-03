import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Send, User, UserPlus, Search, MoreVertical } from 'lucide-react';
import './Chat.css';

const Chat = () => {
    const { user, userRole } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (selectedUser) {
            fetchMessages();
            const subscription = supabase
                .channel('public:messages')
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
                    const msg = payload.new;
                    if (
                        (msg.sender_id === user.id && msg.receiver_id === selectedUser.id) ||
                        (msg.sender_id === selectedUser.id && msg.receiver_id === user.id)
                    ) {
                        setMessages((prev) => [...prev, msg]);
                    }
                })
                .subscribe();

            return () => {
                supabase.removeChannel(subscription);
            };
        }
    }, [selectedUser, user.id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        // In a real app, you'd fetch from profiles table
        const { data, error } = await supabase.from('profiles').select('*');
        if (data) setUsers(data.filter(u => u.id !== user.id));
    };

    const fetchMessages = async () => {
        if (!selectedUser) return;
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${user.id})`)
            .order('created_at', { ascending: true });

        if (data) setMessages(data);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        const messageData = {
            sender_id: user.id,
            receiver_id: selectedUser.id,
            content: newMessage.trim(),
        };

        const { error } = await supabase.from('messages').insert([messageData]);
        if (error) {
            console.error('Error sending message:', error);
        } else {
            setNewMessage('');
            // Optional: Create a notification for the receiver
            await supabase.from('notifications').insert([{
                user_id: selectedUser.id,
                title: 'New Message',
                message: `${user.email.split('@')[0]} sent you a message: ${newMessage.substring(0, 30)}...`,
                type: 'message'
            }]);
        }
    };

    return (
        <div className="chat-container glass animate-fade-in">
            <div className="chat-sidebar">
                <div className="chat-sidebar-header">
                    <h2>Chats</h2>
                    <button className="icon-btn"><UserPlus size={20} /></button>
                </div>
                <div className="chat-search">
                    <Search size={18} />
                    <input type="text" placeholder="Search users..." />
                </div>
                <div className="chat-user-list">
                    {users.map((u) => (
                        <div
                            key={u.id}
                            className={`chat-user-item ${selectedUser?.id === u.id ? 'active' : ''}`}
                            onClick={() => setSelectedUser(u)}
                        >
                            <div className="user-avatar">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`} alt="avatar" />
                            </div>
                            <div className="user-details">
                                <h3>{u.full_name || u.id.substring(0, 8)}</h3>
                                <p className="text-muted">{u.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="chat-main">
                {selectedUser ? (
                    <>
                        <div className="chat-header">
                            <div className="user-info">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.id}`} alt="avatar" />
                                <div>
                                    <h3>{selectedUser.full_name || selectedUser.id.substring(0, 8)}</h3>
                                    <p className="status-online">Online</p>
                                </div>
                            </div>
                            <button className="icon-btn"><MoreVertical size={20} /></button>
                        </div>

                        <div className="chat-messages">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`message-bubble ${msg.sender_id === user.id ? 'sent' : 'received'}`}
                                >
                                    <div className="message-content">
                                        {msg.content}
                                        <span className="message-time">
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <form className="chat-input" onSubmit={handleSendMessage}>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button type="submit" className="send-btn">
                                <Send size={20} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="chat-empty">
                        <MessageSquare size={80} className="text-muted" />
                        <h2>Welcome to Live Chat</h2>
                        <p className="text-muted">Select a user to start messaging.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
