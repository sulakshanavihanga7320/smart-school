import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, ShieldCheck } from 'lucide-react';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error } = await signIn({ email, password });

        if (error) {
            setError(error.message);
        }
        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-box glass animate-fade-in">
                <div className="login-header">
                    <div className="logo-icon">S</div>
                    <h2>SMVSMS Portal</h2>
                    <p>Please enter your details to sign in</p>
                    <p style={{ fontSize: '0.7rem', color: '#6366f1', marginTop: '5px' }}>v2.5 (Hardcoded Fix)</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="input-group">
                        <Mail size={18} className="input-icon" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Lock size={18} className="input-icon" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn primary-btn" disabled={loading}>
                        {loading ? 'Authenticating...' : (
                            <>
                                <LogIn size={18} style={{ marginRight: '8px' }} />
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <p><ShieldCheck size={14} /> Secure Administration Panel</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
