import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Layout.css';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
                        <button className="icon-btn">
                            <span className="notification-dot"></span>
                            🔔
                        </button>
                        <button className="primary-btn hide-mobile">New Admission</button>
                    </div>
                </header>
                <div className="page-container" onClick={() => isSidebarOpen && setIsSidebarOpen(false)}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
