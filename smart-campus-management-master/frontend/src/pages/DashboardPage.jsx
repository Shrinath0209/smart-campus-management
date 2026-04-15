import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { 
  FiBook, FiCheckSquare, 
  FiClock, FiTrendingUp, FiBell, FiCalendar,
  FiAward, FiPieChart, FiFileText
} from "react-icons/fi";
import { motion } from "framer-motion";
import branding from "../config/branding";

export default function DashboardPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/courses")
      .then(({ data }) => setCourses(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const enrolledCourses = courses.filter(c => 
    c.students?.some(s => s._id === user?.id || s === user?.id)
  );

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <motion.main 
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Welcome Banner */}
      <div className="dashboard-header-lms">
        <div className="welcome-section">
          <h1>{getGreeting()}, {user?.name?.split(' ')[0]}! 👋</h1>
          <p>Welcome to {branding.fullPlatformName} — you have {enrolledCourses.length} active courses.</p>
        </div>
        <div className="date-display">
          <FiCalendar />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Quick Links Grid */}
      <section>
        <div className="section-header">
          <h3 className="section-title">Quick Access</h3>
        </div>
        <div className="quick-links-grid">
          {[
            { icon: <FiBook />, label: 'My Courses', path: '/courses', color: 'orange' },
            { icon: <FiCheckSquare />, label: 'Attendance', path: '/attendance', color: 'green' },
            { icon: <FiPieChart />, label: 'Grades', path: '/grades', color: 'maroon' },
            { icon: <FiCalendar />, label: 'Exam Schedule', path: '/exams', color: 'blue' },
            { icon: <FiFileText />, label: 'Assignments', path: '/courses', color: 'teal' },
            { icon: <FiAward />, label: 'Certificates', path: '/achievements', color: 'gold' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link to={item.path} className="quick-link-card">
                <div className={`quick-link-icon ${item.color}`}>{item.icon}</div>
                <span>{item.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="dashboard-grid-lms">
        {/* Left Column */}
        <div className="dashboard-left">
          {/* Stats */}
          <section className="stats-mini-grid">
            <motion.div className="stat-mini-card indigo" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
              <div className="stat-mini-icon"><FiBook /></div>
              <div className="stat-mini-info">
                <h3>{enrolledCourses.length}</h3>
                <p>Courses</p>
              </div>
            </motion.div>
            <motion.div className="stat-mini-card green" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
              <div className="stat-mini-icon"><FiCheckSquare /></div>
              <div className="stat-mini-info">
                <h3>85%</h3>
                <p>Attendance</p>
              </div>
            </motion.div>
            <motion.div className="stat-mini-card gold" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
              <div className="stat-mini-icon"><FiTrendingUp /></div>
              <div className="stat-mini-info">
                <h3>3.8</h3>
                <p>Avg. CGPA</p>
              </div>
            </motion.div>
          </section>

          {/* My Courses */}
          <section className="enrolled-preview">
            <div className="section-header">
              <h3 className="section-title"><FiBook /> My Courses</h3>
              <Link to="/courses" className="text-link">View All →</Link>
            </div>
            <div className="course-progress-list">
              {enrolledCourses.length > 0 ? enrolledCourses.slice(0, 4).map((course, idx) => (
                <motion.div key={course._id} className="course-progress-card glass"
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.08 }}
                >
                  <div className="course-prog-info">
                    <h4>{course.title}</h4>
                    <span className="course-prog-category">{course.category}</span>
                  </div>
                  <div className="course-prog-bar-container">
                    <div className="course-prog-bar" style={{ width: `${30 + idx * 15}%` }}></div>
                    <span className="course-prog-percentage">{30 + idx * 15}%</span>
                  </div>
                </motion.div>
              )) : (
                <div className="empty-mini">
                  <p>Not enrolled yet. <Link to="/courses" style={{ color: branding.colors.primary, fontWeight: 600 }}>Browse courses →</Link></p>
                </div>
              )}
            </div>
          </section>

          {/* Semester Progress */}
          <section className="semester-progress-card" style={{ marginTop: '1rem' }}>
            <div className="section-header">
              <h3 className="section-title"><FiClock /> Semester Progress</h3>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>{branding.getSemester()}</span>
            </div>
            <div className="semester-bar-container">
              <div className="semester-bar-bg">
                <div className="semester-bar-fill" style={{ width: '65%' }}></div>
              </div>
              <div className="semester-info">
                <span>Jan 2025</span>
                <span style={{ color: branding.colors.primary, fontWeight: 700 }}>65% Complete</span>
                <span>May 2025</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="dashboard-right">
          {/* Notice Board */}
          <div className="notice-board">
            <div className="notice-board-header">
              <FiBell /> Notice Board
            </div>
            <div className="notice-board-body">
              <div className="notice-item">
                <h5><span className="notice-tag urgent">Urgent</span>Mid-Term Examination Schedule</h5>
                <p>Check the examination portal for your mid-term dates and seat allocation.</p>
              </div>
              <div className="notice-item">
                <h5><span className="notice-tag event">Event</span>Hackathon 2025 - TechFest</h5>
                <p>Registrations open for the annual hackathon. Team size: 2-4 members.</p>
              </div>
              <div className="notice-item">
                <h5><span className="notice-tag info">Info</span>Library Hours Extended</h5>
                <p>Library will remain open till 11 PM during examination period.</p>
              </div>
              <div className="notice-item">
                <h5><span className="notice-tag info">Info</span>Fee Payment Deadline</h5>
                <p>Last date for fee submission: April 30, 2025.</p>
              </div>
            </div>
          </div>

          {/* Academic Calendar */}
          <div className="calendar-widget" style={{ marginTop: '1rem' }}>
            <div className="section-header">
              <h3 className="section-title"><FiCalendar /> Upcoming Events</h3>
            </div>
            {[
              { day: '18', month: 'APR', title: 'Mid-Term Exam Begins', type: 'Examination' },
              { day: '25', month: 'APR', title: 'Project Submission', type: 'Assignment' },
              { day: '02', month: 'MAY', title: 'Sports Meet', type: 'Event' },
              { day: '10', month: 'MAY', title: 'End-Term Exams', type: 'Examination' },
            ].map((evt, idx) => (
              <div key={idx} className="calendar-event">
                <div className="calendar-event-date">
                  <span className="day">{evt.day}</span>
                  <span className="month">{evt.month}</span>
                </div>
                <div className="calendar-event-info">
                  <h5>{evt.title}</h5>
                  <p>{evt.type}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pending Tasks */}
          <section className="upcoming-tasks" style={{ marginTop: '1rem' }}>
            <div className="section-header">
              <h3 className="section-title"><FiClock /> Pending Tasks</h3>
            </div>
            <div className="task-list">
              <div className="task-item">
                <input type="checkbox" readOnly />
                <div className="task-info">
                  <h5>Submit React Assignment</h5>
                  <p>Deadline: Tomorrow, 11:59 PM</p>
                </div>
              </div>
              <div className="task-item">
                <input type="checkbox" readOnly />
                <div className="task-info">
                  <h5>Quiz: Database Management</h5>
                  <p>Starts in 2 days</p>
                </div>
              </div>
              <div className="task-item">
                <input type="checkbox" readOnly />
                <div className="task-info">
                  <h5>Lab Report Submission</h5>
                  <p>Due: April 20, 2025</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </motion.main>
  );
}
