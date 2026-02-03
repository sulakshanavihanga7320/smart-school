import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Send, User, UserPlus, Search, MoreVertical, MessageSquare, Users, Check, CheckCheck } from 'lucide-react';
import './Chat.css';

const Chat = () => {
    const { user, userRole } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null); // 'GROUP' or user object
    const messagesEndRef = useRef(null);

    // Dummy object for the General Group
    const GENERAL_GROUP = {
        id: 'GROUP_001',
        full_name: 'School General Group',
        role: 'Public Chat',
        avatar_seed: 'GROUP',
        isGroup: true
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // 1. Fetch Users & Set Default to Group
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data: studentsData } = await supabase.from('students').select('id, full_name, class_name');
            const { data: employeesData } = await supabase.from('employees').select('id, full_name, role');

            const allUsers = [];

            if (employeesData) {
                allUsers.push(...employeesData.map(e => ({
                    id: e.id,
                    full_name: e.full_name,
                    role: e.role || 'Staff',
                    avatar_seed: e.full_name
                })));
            }

            if (studentsData) {
                allUsers.push(...studentsData.map(s => ({
                    id: s.id,
                    full_name: s.full_name,
                    role: `Student (${s.class_name})`,
                    avatar_seed: s.full_name
                })));
            }

            setUsers(allUsers.filter(u => u.id !== user.id));
            // Default to General Group
            setSelectedUser(GENERAL_GROUP);
        } catch (err) {
            console.error("Error fetching chat users:", err);
        }
    };

    // 2. Real-time Subscription management
    useEffect(() => {
        if (!selectedUser) return;

        fetchMessages();

        const subscription = supabase
            .channel('public:messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
                const msg = payload.new;
                handleNewMessage(msg);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [selectedUser, user.id]);

    const handleNewMessage = (msg) => {
        if (selectedUser.isGroup) {
            // Include if it's a group message (receiver_id is null)
            if (msg.receiver_id === null) {
                setMessages((prev) => [...prev, msg].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));
            }
        } else {
            // Private message logic
            const isRelated =
                (msg.sender_id === user.id && msg.receiver_id === selectedUser.id) ||
                (msg.sender_id === selectedUser.id && msg.receiver_id === user.id);

            if (isRelated) {
                setMessages((prev) => [...prev, msg].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));
            }
        }
    };

    // 3. Auto Scroll
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        if (!selectedUser) return;
        setMessages([]); // Clear previous view

        let query = supabase.from('messages').select('*').order('created_at', { ascending: true });

        if (selectedUser.isGroup) {
            // Fetch public messages (receiver_id IS NULL)
            query = query.is('receiver_id', null);
        } else {
            // Fetch private messages between me and selectedUser
            query = query.or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${user.id})`);
        }

        const { data, error } = await query;
        if (data) setMessages(data);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        const messageData = {
            sender_id: user.id,
            receiver_id: selectedUser.isGroup ? null : selectedUser.id, // NULL for group chat
            content: newMessage.trim(),
        };

        const { error } = await supabase.from('messages').insert([messageData]);

        if (!error) {
            setNewMessage('');

            if (!selectedUser.isGroup) {
                // Notify receiver only for private chats
                import('../lib/NotificationService').then(({ NotificationService }) => {
                    NotificationService.send(
                        selectedUser.id,
                        'New Message',
                        `${user.email.split('@')[0]} sent you a message`,
                        'message'
                    );
                });
            }
        }
    };

    // Helper to find sender name for group chats
    const getSenderName = (senderId) => {
        if (senderId === user.id) return "You";
        const found = users.find(u => u.id === senderId);
        return found ? found.full_name : 'Unknown User';
    };

    return (
        <div className="chat-container glass animate-fade-in">
            {/* Sidebar */}
            <div className="chat-sidebar">
                <div className="chat-sidebar-header">
                    <h2>Messages</h2>
                    <div className="header-icons">
                        <MoreVertical size={20} className="icon-btn-plain" />
                    </div>
                </div>
                <div className="chat-search">
                    <div className="search-box">
                        <Search size={16} />
                        <input type="text" placeholder="Search or start new chat" />
                    </div>
                </div>

                <div className="chat-user-list">
                    {/* General Group Item */}
                    <div
                        className={`chat-user-item ${selectedUser?.id === GENERAL_GROUP.id ? 'active' : ''}`}
                        onClick={() => setSelectedUser(GENERAL_GROUP)}
                    >
                        <div className="user-avatar group-avatar">
                            <Users size={22} color="white" />
                        </div>
                        <div className="user-details">
                            <div className="name-row">
                                <h3>School General Group</h3>
                                <span className="time-stamp">Now</span>
                            </div>
                            <p className="text-muted">Broadcast to everyone</p>
                        </div>
                    </div>

                    <div className="divider-label">Direct Messages</div>

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
                                <div className="name-row">
                                    <h3>{u.full_name || u.id.substring(0, 8)}</h3>
                                </div>
                                <p className="text-muted">{u.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="chat-main" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")' }}>
                {selectedUser ? (
                    <>
                        <div className="chat-header main-header">
                            <div className="user-info">
                                {selectedUser.isGroup ? (
                                    <div className="user-avatar group-avatar-small"><Users size={18} color="white" /></div>
                                ) : (
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.id}`} alt="avatar" />
                                )}
                                <div>
                                    <h3>{selectedUser.full_name}</h3>
                                    <p className="status-online">{selectedUser.isGroup ? 'everyone, you' : 'Online'}</p>
                                </div>
                            </div>
                            <div className="chat-actions">
                                <Search size={20} className="icon-btn-plain" />
                                <MoreVertical size={20} className="icon-btn-plain" />
                            </div>
                        </div>

                        <div className="chat-messages">
                            {messages.map((msg, index) => {
                                const isMe = msg.sender_id === user.id;
                                const showSender = selectedUser.isGroup && !isMe;

                                return (
                                    <div
                                        key={msg.id || index}
                                        className={`message-wrapper ${isMe ? 'my-msg' : 'other-msg'}`}
                                    >
                                        <div className="message-bubble">
                                            {showSender && <span className="sender-name">{getSenderName(msg.sender_id)}</span>}
                                            <div className="message-content">
                                                {msg.content}
                                            </div>
                                            <div className="message-meta">
                                                <span className="message-time">
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {isMe && <CheckCheck size={14} className="read-receipt" />}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <form className="chat-input-area" onSubmit={handleSendMessage}>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button type="submit" className="send-btn-whatsapp">
                                <Send size={20} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="chat-empty">
                        <MessageSquare size={80} className="text-muted" />
                        <h2>Welcome to School Chat</h2>
                        <p className="text-muted">Select a chat to start messaging.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
