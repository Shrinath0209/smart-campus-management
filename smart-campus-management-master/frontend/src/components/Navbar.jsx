import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiSearch, FiBell, FiUser, FiMessageSquare } from "react-icons/fi";
import branding from "../config/branding";

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = (path) => {
    const titles = {
      dashboard: 'Dashboard',
      courses: 'My Courses',
      attendance: 'Attendance',
      profile: 'My Profile',
      admin: 'Admin Panel',
      grades: 'Grades & CGPA',
      exams: 'Exam Schedule',
      achievements: 'Achievements',
      notifications: 'Notifications',
    };
    const p = path.split('/')[1];
    return titles[p] || 'Dashboard';
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="current-page-indicator">
          {getPageTitle(location.pathname)}
        </span>
        <span style={{ 
          fontSize: '0.72rem', 
          color: '#94a3b8', 
          fontWeight: 600,
          marginLeft: '8px',
          padding: '4px 10px',
          background: '#f0f2f5',
          borderRadius: '6px'
        }}>
          {branding.getSemester()}
        </span>
      </div>

      <div className="navbar-center search-container-top">
        <FiSearch className="search-icon-top" />
        <input type="text" placeholder="Search courses, materials, faculty..." className="navbar-search" />
      </div>

      <div className="navbar-right">
        <button className="icon-btn-top" title="Messages">
          <FiMessageSquare size={18} />
        </button>
        <button className="icon-btn-top" title="Notifications">
          <FiBell size={18} />
          <span className="notif-badge"></span>
        </button>
        
        <div className="divider-vr"></div>
        
        <div className="navbar-profile">
          <div className="profile-text">
            <span className="profile-name">{user?.name}</span>
            <span className="profile-id">{user?.role?.toUpperCase()}</span>
          </div>
          <div className="profile-avatar-top">
            <FiUser size={16} />
          </div>
        </div>
      </div>
    </nav>
  );
}
