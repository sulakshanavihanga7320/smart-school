import React from 'react';
import { LogOut, AlertCircle, X } from 'lucide-react';
import './Modal.css';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content glass animate-fade-in">
                <button className="modal-close" onClick={onClose}>
                    <X size={20} />
                </button>
                <div className="modal-body">
                    <div className="modal-icon-container">
                        <LogOut size={32} className="modal-icon" />
                    </div>
                    <h3>Confirm Logout</h3>
                    <p>Are you sure you want to sign out of SMVSMS? You will need to login again to access your dashboard.</p>
                    <div className="modal-actions">
                        <button className="secondary-btn" onClick={onClose}>Cancel</button>
                        <button className="danger-btn" onClick={onConfirm}>Logout</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;
