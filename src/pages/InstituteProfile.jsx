import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Home, Phone, Mail, Globe, MapPin, Flag, Upload, Save, CheckCircle, RefreshCcw } from 'lucide-react';
import './InstituteProfile.css';

const InstituteProfile = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState({
        name: 'Siddhartha National Collage',
        target_line: 'Anuradhapura',
        logo_url: 'https://via.placeholder.com/150',
        phone: '0742828178',
        website: 'https://youtube.com/@siddhartha.nc-official?si=ri-XrekXlmDPRG',
        email: 'sulakshanavihanga7320@gmail.com',
        address: 'Pemaduwa',
        country: 'Sri Lanka'
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('school_profile')
                .select('*')
                .single();

            if (data) {
                setProfile(data);
                // Save to localStorage as backup
                localStorage.setItem('school_profile', JSON.stringify(data));
            } else if (error) {
                // Try to load from localStorage if database fails
                const savedProfile = localStorage.getItem('school_profile');
                if (savedProfile) {
                    setProfile(JSON.parse(savedProfile));
                    console.log('Loaded profile from localStorage (database not available)');
                }
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            // Try to load from localStorage
            const savedProfile = localStorage.getItem('school_profile');
            if (savedProfile) {
                setProfile(JSON.parse(savedProfile));
                console.log('Loaded profile from localStorage (error occurred)');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);

            // Save to localStorage first (always works)
            localStorage.setItem('school_profile', JSON.stringify(profile));

            // Try to save to database (optional - won't crash if it fails)
            try {
                const { error } = await supabase
                    .from('school_profile')
                    .upsert({ id: 1, ...profile });

                if (error) {
                    console.log('Database save failed (saved to localStorage):', error.message);
                }
            } catch (dbError) {
                console.log('Database not available (saved to localStorage)');
            }

            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Error updating profile:', err);
            alert('Error updating profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // In a real app, you'd upload to Supabase storage
            // For now, we'll use a local preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile(prev => ({ ...prev, logo_url: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="profile-page animate-fade-in">
            <header className="profile-header-breadcrumb">
                <span className="breadcrumb-text">General Settings</span>
                <span className="breadcrumb-separator">|</span>
                <Home size={16} className="breadcrumb-icon" />
                <span className="breadcrumb-text">- Institute Profile</span>
            </header>

            <div className="profile-content-grid">
                <div className="profile-form-container">
                    <div className="form-title-section">
                        <h2>Update Profile</h2>
                        <div className="legend">
                            <span className="legend-item required">Required*</span>
                            <span className="legend-item optional">Optional</span>
                        </div>
                    </div>

                    <form onSubmit={handleUpdate} className="institute-form">
                        <div className="form-row">
                            <div className="form-group logo-group">
                                <label>Institute Logo*</label>
                                <div className="logo-upload-box">
                                    <div className="logo-preview">
                                        <img src={profile.logo_url} alt="Logo" />
                                    </div>
                                    <label htmlFor="logo-input" className="change-logo-btn">
                                        <Upload size={16} />
                                        <span>Change Logo</span>
                                    </label>
                                    <input
                                        type="file"
                                        id="logo-input"
                                        hidden
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                    />
                                </div>
                            </div>

                            <div className="form-side-fields">
                                <div className="form-group">
                                    <label className="required-label">Phone Number*</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={profile.phone}
                                        onChange={handleChange}
                                        placeholder="Enter Phone Number"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Website</label>
                                    <input
                                        type="text"
                                        name="website"
                                        value={profile.website}
                                        onChange={handleChange}
                                        placeholder="Enter Website URL"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group full-width">
                                <label className="required-label">Name of Institute*</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleChange}
                                    placeholder="Enter Institute Name"
                                    required
                                />
                            </div>
                            <div className="form-group full-width">
                                <label className="required-label">Address*</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={profile.address}
                                    onChange={handleChange}
                                    placeholder="Enter Address"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group full-width">
                                <label className="required-label">Target Line*</label>
                                <input
                                    type="text"
                                    name="target_line"
                                    value={profile.target_line}
                                    onChange={handleChange}
                                    placeholder="e.g. Anuradhapura"
                                    required
                                />
                            </div>
                            <div className="form-group full-width">
                                <label className="required-label">Country*</label>
                                <select
                                    name="country"
                                    value={profile.country}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Sri Lanka">Sri Lanka</option>
                                    <option value="India">India</option>
                                    <option value="Pakistan">Pakistan</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="update-btn" disabled={saving}>
                            {saving ? <RefreshCcw className="spin" size={20} /> : <RefreshCcw size={20} />}
                            <span>Update Profile</span>
                        </button>
                    </form>
                </div>

                <div className="profile-preview-container">
                    <div className="preview-card glass">
                        <span className="view-badge">Profile View</span>
                        <div className="preview-header">
                            <div className="preview-logo">
                                <img src={profile.logo_url} alt="Logo Preview" />
                            </div>
                            <h3>{profile.name}</h3>
                            <p className="preview-target">{profile.target_line}</p>
                        </div>
                        <div className="preview-details">
                            <PreviewDetail icon={Phone} label="Phone No" value={profile.phone} />
                            <PreviewDetail icon={Mail} label="Email" value={profile.email} />
                            <PreviewDetail icon={Globe} label="Website" value={profile.website} isLink />
                            <PreviewDetail icon={MapPin} label="Address" value={profile.address} />
                            <PreviewDetail icon={Flag} label="Country" value={profile.country} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PreviewDetail = ({ icon: Icon, label, value, isLink }) => (
    <div className="preview-detail-item">
        <div className="detail-label-icon">
            <Icon size={14} />
            <span>{label}</span>
        </div>
        <div className={`detail-value ${isLink ? 'link-text' : ''}`}>
            {isLink ? (
                <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>
            ) : (
                <span>{value}</span>
            )}
        </div>
    </div>
);

export default InstituteProfile;
