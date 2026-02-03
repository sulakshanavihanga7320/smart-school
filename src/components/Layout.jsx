import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
    return (
        <div className="layout">
            <Sidebar />
            <main className="content">
                <header className="top-nav glass">
                    <div className="search-bar">
                        <input type="text" placeholder="Search anything..." />
                    </div>
                    <div className="header-actions">
                        <button className="icon-btn">
                            <span className="notification-dot"></span>
                            🔔
                        </button>
                        <button className="primary-btn">New Admission</button>
                    </div>
                </header>
                <div className="page-container">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
