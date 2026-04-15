import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { 
  FiUser, FiMail, FiShield, FiBook, FiCheckCircle, 
  FiActivity, FiCalendar, FiAward, FiHash 
} from "react-icons/fi";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import branding from "../config/branding";

export default function ProfilePage() {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "student") {
      api.get("/courses")
        .then(({ data }) => {
          const enrolled = data.filter(c => 
            c.students?.some(s => s._id === user.id || s === user.id)
          );
          setEnrolledCourses(enrolled);
        })
        .catch(() => toast.error("Failed to load your courses"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <motion.main 
      className="page-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="page-header">
        <h2 className="page-title"><FiUser /> My Profile</h2>
      </div>

      <div className="profile-grid">
        {/* User Card */}
        <motion.div 
          className="profile-card"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h3>{user?.name}</h3>
            <p className="profile-role-badge">{user?.role}</p>
            
            <div className="profile-details">
              <div className="detail-item">
                <FiMail /> <span>{user?.email || `student@${branding.universityShortName.toLowerCase()}.in`}</span>
              </div>
              <div className="detail-item">
                <FiHash /> <span>Reg. No: {user?.id?.slice(-8)?.toUpperCase()}</span>
              </div>
              <div className="detail-item">
                <FiCalendar /> <span>{branding.getSemester()}</span>
              </div>
              <div className="detail-item">
                <FiShield /> <span>Programme: {branding.defaultProgram}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="profile-stats-container">
          <motion.div 
            className="stat-mini-card"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="stat-mini-icon" style={{ background: 'rgba(76,175,80,0.1)', color: '#4CAF50' }}>
              <FiActivity />
            </div>
            <div className="stat-mini-info">
              <h3 style={{ fontSize: '1rem', color: '#4CAF50' }}>Active</h3>
              <p>Account Status</p>
            </div>
          </motion.div>

          {user?.role === "student" && (
            <>
              <motion.div 
                className="stat-mini-card"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="stat-mini-icon" style={{ background: 'rgba(255,107,0,0.1)', color: '#FF6B00' }}>
                  <FiBook />
                </div>
                <div className="stat-mini-info">
                  <h3>{enrolledCourses.length}</h3>
                  <p>Enrolled Courses</p>
                </div>
              </motion.div>

              <motion.div 
                className="stat-mini-card"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                <div className="stat-mini-icon" style={{ background: 'rgba(139,26,53,0.1)', color: '#8B1A35' }}>
                  <FiAward />
                </div>
                <div className="stat-mini-info">
                  <h3>3.8</h3>
                  <p>Current CGPA</p>
                </div>
              </motion.div>

              <motion.div 
                className="stat-mini-card"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="stat-mini-icon" style={{ background: 'rgba(33,150,243,0.1)', color: '#2196F3' }}>
                  <FiCheckCircle />
                </div>
                <div className="stat-mini-info">
                  <h3>85%</h3>
                  <p>Attendance</p>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {user?.role === "student" && (
        <section className="profile-courses-section">
          <h3 className="section-title"><FiBook /> My Enrolled Courses</h3>
          
          {loading ? (
            <div className="loading-grid">
              <div className="skeleton-card" />
              <div className="skeleton-card" />
            </div>
          ) : enrolledCourses.length === 0 ? (
            <div className="empty-state">
              <FiBook size={40} style={{ color: '#cbd5e1' }} />
              <p>You haven't enrolled in any courses yet.</p>
            </div>
          ) : (
            <div className="enrolled-list">
              {enrolledCourses.map((c, idx) => (
                <motion.div 
                  key={c._id} 
                  className="enrolled-item"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <div className="enrolled-item-info">
                    <h4>{c.title}</h4>
                    <p>Instructor: {c.instructor?.name} • {c.category || 'General'}</p>
                  </div>
                  <div className="enrolled-item-status">
                    <FiCheckCircle />
                    <span>Active</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      )}
    </motion.main>
  );
}
