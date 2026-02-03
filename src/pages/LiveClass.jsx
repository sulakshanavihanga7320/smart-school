import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Video, Calendar, Users, MessageSquare, Clock, Plus, ExternalLink, Search, Edit2, Trash2, X, Save } from 'lucide-react';
import './LiveClass.css';

const LiveClass = () => {
    // States
    const [loading, setLoading] = useState(false);
    const [meetings, setMeetings] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [activeTab, setActiveTab] = useState('All Meetings');

    const [formData, setFormData] = useState({
        title: '',
        meetingId: 'ESK' + Math.random().toString(36).substring(2, 11).toUpperCase(),
        meetingWith: 'All Students',
        scheduled: false,
        message: '',
        targetId: null
    });

    const { userRole } = useAuth();
    const isAdmin = userRole === 'admin';
    const [editingId, setEditingId] = useState(null);
    const [selectedTarget, setSelectedTarget] = useState(null);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        fetchInitialData();
        fetchMeetings();
        return () => clearInterval(timer);
    }, []);

    const fetchInitialData = async () => {
        try {
            const { data: classData } = await supabase.from('classes').select('*');
            const { data: studentData } = await supabase.from('students').select('id, full_name, class_name');
            const { data: teacherData } = await supabase.from('employees').select('id, full_name').eq('role', 'teacher');

            if (classData) setClasses(classData);
            if (studentData) setStudents(studentData);
            if (teacherData) setTeachers(teacherData);
        } catch (err) {
            console.error("Error fetching initial data:", err);
        }
    };

    const fetchMeetings = async () => {
        try {
            const { data, error } = await supabase
                .from('live_meetings')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                if (error.code === 'PGRST116' || error.message.includes('not found')) {
                    console.warn("Table 'live_meetings' not found.");
                }
                throw error;
            }
            if (data) setMeetings(data);
        } catch (err) {
            console.error("Error fetching meetings:", err);
            setMeetings([]);
        }
    };

    const handleCreateMeeting = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const meetingData = {
                title: formData.title,
                meeting_id: formData.meetingId,
                meeting_with: formData.meetingWith,
                target_id: formData.targetId,
                message: formData.message,
                is_scheduled: formData.scheduled,
                updated_at: new Date()
            };

            if (!editingId) {
                meetingData.created_at = new Date();
            }

            let error;
            if (editingId) {
                const { error: err } = await supabase
                    .from('live_meetings')
                    .update(meetingData)
                    .eq('id', editingId);
                error = err;
            } else {
                const { error: err } = await supabase
                    .from('live_meetings')
                    .insert([meetingData]);
                error = err;
            }

            if (error) throw error;
            alert(editingId ? 'Meeting updated successfully!' : 'Meeting created successfully!');
            resetForm();
            fetchMeetings();
        } catch (err) {
            console.error(err);
            if (err.message && err.message.includes('not found')) {
                alert('Database Table missing! Please run the SQL script.');
            } else {
                alert('Error processing meeting: ' + (err.message || 'Unknown error'));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMeeting = async (id) => {
        if (!window.confirm('Are you sure you want to delete this meeting?')) return;
        try {
            const { error } = await supabase
                .from('live_meetings')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchMeetings();
        } catch (err) {
            console.error(err);
            alert('Error deleting meeting');
        }
    };

    const startEditing = (meeting) => {
        setEditingId(meeting.id);
        setFormData({
            title: meeting.title || '',
            meetingId: meeting.meeting_id || '',
            meetingWith: meeting.meeting_with || 'All Students',
            scheduled: meeting.is_scheduled || false,
            message: meeting.message || '',
            targetId: meeting.target_id || null
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            title: '',
            meetingId: 'ESK' + Math.random().toString(36).substring(2, 11).toUpperCase(),
            meetingWith: 'All Students',
            scheduled: false,
            message: '',
            targetId: null
        });
    };

    const handleJoinMeeting = (meetingId) => {
        const win = window.open(`https://meet.jit.si/${meetingId}`, '_blank');
        if (win) win.focus();
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: '2-digit', year: 'numeric' });
    };

    return (
        <div className="live-class-page animate-fade-in">
            <div className="live-class-grid">
                {/* Left Form Section */}
                <div className="live-class-sidebar">
                    <button className="host-btn" type="button">
                        <Video size={18} />
                        <span>Host Meeting</span>
                    </button>

                    <form onSubmit={handleCreateMeeting} className="meeting-form">
                        <div className="form-group">
                            <label>Meeting Title*</label>
                            <input
                                type="text"
                                placeholder="Meeting title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Meeting ID*</label>
                            <input
                                type="text"
                                placeholder="Enter or use generated ID"
                                value={formData.meetingId}
                                onChange={(e) => setFormData({ ...formData, meetingId: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Meeting With*</label>
                            <select
                                value={formData.meetingWith}
                                onChange={(e) => {
                                    setFormData({ ...formData, meetingWith: e.target.value, targetId: null });
                                }}
                            >
                                <option value="All Students">All Students</option>
                                <option value="All Teachers">All Teachers</option>
                                <option value="Class">Specific Class</option>
                                <option value="Specific Student">Specific Student</option>
                                <option value="Specific Teacher">Specific Teacher</option>
                            </select>
                        </div>

                        {formData.meetingWith === 'Class' && (
                            <div className="form-group animate-fade-in">
                                <label>Select Class*</label>
                                <select
                                    value={formData.targetId || ''}
                                    onChange={(e) => setFormData({ ...formData, targetId: e.target.value })}
                                    required
                                >
                                    <option value="">Choose Class...</option>
                                    {(classes || []).map(c => <option key={c.id} value={c.id}>{c.class_name}</option>)}
                                </select>
                            </div>
                        )}

                        {formData.meetingWith === 'Specific Student' && (
                            <div className="form-group animate-fade-in">
                                <label>Select Student*</label>
                                <select
                                    value={formData.targetId || ''}
                                    onChange={(e) => setFormData({ ...formData, targetId: e.target.value })}
                                    required
                                >
                                    <option value="">Search Student...</option>
                                    {(students || []).map(s => <option key={s.id} value={s.id}>{s.full_name} ({s.class_name})</option>)}
                                </select>
                            </div>
                        )}

                        {formData.meetingWith === 'Specific Teacher' && (
                            <div className="form-group animate-fade-in">
                                <label>Select Teacher*</label>
                                <select
                                    value={formData.targetId || ''}
                                    onChange={(e) => setFormData({ ...formData, targetId: e.target.value })}
                                    required
                                >
                                    <option value="">Search Teacher...</option>
                                    {(teachers || []).map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
                                </select>
                            </div>
                        )}

                        <div className="checkbox-group" onClick={() => setFormData({ ...formData, scheduled: !formData.scheduled })}>
                            <input
                                type="checkbox"
                                id="schedule"
                                checked={formData.scheduled}
                                readOnly
                            />
                            <label htmlFor="schedule" style={{ cursor: 'pointer' }}>I want to schedule this meeting.</label>
                        </div>

                        <div className="form-group">
                            <textarea
                                placeholder="Write your Message here, if any.."
                                maxLength={244}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            ></textarea>
                        </div>

                        <button type="submit" className="create-join-btn" disabled={loading}>
                            {editingId ? <Save size={18} /> : <Plus size={18} />}
                            <span>{loading ? 'Processing...' : (editingId ? 'Update Meeting' : 'Create & Join')}</span>
                        </button>

                        {editingId && (
                            <button type="button" className="cancel-btn" onClick={resetForm} style={{
                                background: 'transparent',
                                border: '1px solid #ef4444',
                                color: '#ef4444',
                                padding: '0.8rem',
                                borderRadius: '15px',
                                marginTop: '1rem',
                                width: '100%',
                                cursor: 'pointer'
                            }}>
                                Cancel Editing
                            </button>
                        )}
                    </form>
                </div>

                <div className="live-class-main">
                    <div className="time-banner glass">
                        <div className="banner-visual-elements">
                            <span className="live-badge-smart">● LIVE SYSTEM</span>
                        </div>
                        <div className="time-display">{formatTime(currentTime)}</div>
                        <div className="date-display">{formatDate(currentTime)}</div>
                        <div className="welcome-msg-smart">
                            Ready to start your next session?
                        </div>
                    </div>

                    <div className="meetings-tabs">
                        {['All Meetings', 'Today', 'Tomorrow', 'Self Hosted', 'Invitations'].map(tab => (
                            <button
                                key={tab}
                                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="meetings-content">
                        {meetings.length === 0 ? (
                            <div className="no-meeting">
                                <img src="/no-meeting-3d-clean.png" alt="No meetings" />
                                <p>No meeting found.</p>
                            </div>
                        ) : (
                            <div className="meetings-list">
                                {meetings.map(meeting => (
                                    <div key={meeting.id} className="meeting-card">
                                        <div className="meeting-info-main">
                                            <div className="meeting-icon-box">
                                                <Video size={24} />
                                            </div>
                                            <div className="meeting-text">
                                                <h4>{meeting.title}</h4>
                                                <p className="meeting-sub">{meeting.meeting_with} • ID: {meeting.meeting_id}</p>
                                                {meeting.message && <p className="meeting-msg">"{meeting.message}"</p>}
                                            </div>
                                        </div>
                                        <div className="meeting-actions">
                                            <div className="action-row">
                                                <button className="action-icon-btn edit" onClick={() => startEditing(meeting)} title="Edit">
                                                    <Edit2 size={16} />
                                                </button>
                                                {isAdmin && (
                                                    <button className="action-icon-btn delete" onClick={() => handleDeleteMeeting(meeting.id)} title="Delete Meeting">
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                            <button className="join-btn-smart" onClick={() => handleJoinMeeting(meeting.meeting_id)}>Join Now</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveClass;
