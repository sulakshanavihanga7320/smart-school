import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { navigation } from '../navigation';
import { ChevronDown, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LogoutModal from './LogoutModal';
import './Sidebar.css';

const SidebarItem = ({ item, depth = 0, onLogoutRequest, userRole }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Check if user has permission for this item
    const hasPermission = !item.roles || item.roles.includes(userRole);
    if (!hasPermission) return null;

    const hasChildren = item.children && item.children.length > 0;

    // Filter children based on permissions
    const visibleChildren = hasChildren ? item.children.filter(child => !child.roles || child.roles.includes(userRole)) : [];
    const hasVisibleChildren = visibleChildren.length > 0;

    const toggleOpen = (e) => {
        if (hasVisibleChildren) {
            e.preventDefault();
            setIsOpen(!isOpen);
        }
    };

    const handleLogout = (e) => {
        if (item.path === '/logout') {
            e.preventDefault();
            onLogoutRequest();
        }
    };

    const Icon = item.icon;

    return (
        <div className="sidebar-item-container" onClick={item.path === '/logout' ? handleLogout : undefined}>
            {hasVisibleChildren ? (
                <div
                    className={`sidebar-link ${isOpen ? 'active' : ''}`}
                    onClick={toggleOpen}
                    style={{ paddingLeft: `${depth * 1 + 1}rem` }}
                >
                    <div className="sidebar-link-content">
                        {Icon && <Icon size={20} className="sidebar-icon" />}
                        <span className="sidebar-text">{item.name}</span>
                    </div>
                    {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
            ) : (
                <NavLink
                    to={item.path}
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    style={{ paddingLeft: `${depth * 1 + 1}rem` }}
                >
                    <div className="sidebar-link-content">
                        {Icon && <Icon size={20} className="sidebar-icon" />}
                        <span className="sidebar-text">{item.name}</span>
                    </div>
                </NavLink>
            )}

            {hasVisibleChildren && isOpen && (
                <div className="sidebar-children">
                    {visibleChildren.map((child, index) => (
                        <SidebarItem
                            key={index}
                            item={child}
                            depth={depth + 1}
                            onLogoutRequest={onLogoutRequest}
                            userRole={userRole}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { signOut, user, userRole } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

    return (
        <>
            <aside className={`sidebar glass ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo-container">
                        <div className="logo-icon">S</div>
                        <h1 className="logo-text">SMV<span>SMS</span></h1>
                    </div>
                </div>
                <nav className="sidebar-nav">
                    {navigation.map((item, index) => (
                        <div key={index} onClick={() => window.innerWidth < 1024 && toggleSidebar()}>
                            <SidebarItem
                                item={item}
                                userRole={userRole}
                                onLogoutRequest={() => setIsModalOpen(true)}
                            />
                        </div>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <div className="user-profile">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'Felix'}`} alt="User" />
                        <div className="user-info">
                            <p className="user-name">{user?.email?.split('@')[0] || 'User'}</p>
                            <p className="user-role">{capitalize(userRole) || 'Admin'}</p>
                        </div>
                    </div>
                    <button
                        className="sidebar-logout-btn"
                        onClick={() => setIsModalOpen(true)}
                        title="Log Out"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

            <LogoutModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={signOut}
            />
        </>
    );
};

export default Sidebar;
