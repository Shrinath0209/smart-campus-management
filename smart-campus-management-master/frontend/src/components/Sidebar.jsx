import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, FiBook, FiUser, FiCheckSquare, 
  FiPieChart, FiBell, FiSettings, FiLogOut,
  FiCalendar, FiAward
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import branding from '../config/branding';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const mainItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiHome /> },
    { name: 'My Courses', path: '/courses', icon: <FiBook /> },
    { name: 'Attendance', path: '/attendance', icon: <FiCheckSquare /> },
  ];

  const academicItems = [
    { name: 'Grades & CGPA', path: '/grades', icon: <FiPieChart /> },
    { name: 'Exam Schedule', path: '/exams', icon: <FiCalendar /> },
    { name: 'Achievements', path: '/achievements', icon: <FiAward /> },
  ];

  const personalItems = [
    { name: 'My Profile', path: '/profile', icon: <FiUser /> },
    { name: 'Notifications', path: '/notifications', icon: <FiBell /> },
  ];

  if (user?.role === 'admin') {
    personalItems.push({ name: 'Admin Panel', path: '/admin', icon: <FiSettings /> });
  }

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="rgba(255,255,255,0.2)"/>
            <path d="M16 6L26 12V20L16 26L6 20V12L16 6Z" fill="white" opacity="0.9"/>
            <path d="M16 10L22 14V18L16 22L10 18V14L16 10Z" fill="rgba(255,107,0,0.8)"/>
          </svg>
          <span>{branding.fullPlatformName}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main Menu</div>
        {mainItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-name">{item.name}</span>
          </NavLink>
        ))}

        <div className="sidebar-section-label">Academics</div>
        {academicItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-name">{item.name}</span>
          </NavLink>
        ))}

        <div className="sidebar-section-label">Personal</div>
        {personalItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-name">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar-small">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="user-info-small">
            <span className="user-name-small">{user?.name}</span>
            <span className="user-role-small">{user?.role}</span>
          </div>
        </div>
        <button onClick={logout} className="sidebar-logout" title="Logout">
          <FiLogOut />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
