import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { FiCheckSquare, FiPlus, FiX, FiUser, FiCalendar, FiPercent } from "react-icons/fi";
import { motion } from "framer-motion";

const STATUS_COLOR = { 
  present: "#4CAF50", 
  absent: "#F44336" 
};

export default function AttendancePage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ student: "", status: "present" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get("/courses")
      .then(({ data }) => setCourses(data))
      .catch(() => toast.error("Could not load courses"));
  }, []);

  const fetchAttendance = (courseId) => {
    if (!courseId) return;
    setLoadingRecords(true);
    api.get(`/attendance/${courseId}`)
      .then(({ data }) => setRecords(data))
      .catch(() => toast.error("Could not load attendance"))
      .finally(() => setLoadingRecords(false));
  };

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
    fetchAttendance(e.target.value);
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleMark = async (e) => {
    e.preventDefault();
    if (!selectedCourse) return toast.error("Please select a course first");
    setSubmitting(true);
    try {
      await api.post("/attendance", { course: selectedCourse, ...form });
      toast.success("Attendance marked!");
      setForm({ student: "", status: "present" });
      setShowForm(false);
      fetchAttendance(selectedCourse);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to mark attendance");
    } finally {
      setSubmitting(false);
    }
  };

  const canMark = user?.role === "faculty" || user?.role === "admin";
  const presentCount = records.filter(r => r.status === 'present').length;
  const absentCount = records.filter(r => r.status === 'absent').length;
  const attendancePercent = records.length > 0 ? Math.round((presentCount / records.length) * 100) : 0;

  return (
    <motion.main 
      className="page-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="page-header">
        <div>
          <h2 className="page-title"><FiCheckSquare /> Attendance</h2>
          <p className="page-subtitle">Track and manage your attendance records</p>
        </div>
        {canMark && (
          <button className="btn-primary" onClick={() => setShowForm((v) => !v)}>
            {showForm ? <><FiX /> Cancel</> : <><FiPlus /> Mark Attendance</>}
          </button>
        )}
      </div>

      {/* Course selector */}
      <div className="filter-bar">
        <label>Select Course:</label>
        <select value={selectedCourse} onChange={handleCourseChange} className="select-input">
          <option value="">— Choose a course —</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>{c.title}</option>
          ))}
        </select>
      </div>

      {/* Attendance Summary Cards */}
      {selectedCourse && records.length > 0 && (
        <div className="stats-mini-grid">
          <motion.div 
            className="stat-mini-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ borderLeft: '4px solid #4CAF50' }}
          >
            <div className="stat-mini-icon" style={{ background: 'rgba(76,175,80,0.1)', color: '#4CAF50' }}>
              <FiCheckSquare />
            </div>
            <div className="stat-mini-info">
              <h3>{presentCount}</h3>
              <p>Present</p>
            </div>
          </motion.div>
          <motion.div 
            className="stat-mini-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            style={{ borderLeft: '4px solid #F44336' }}
          >
            <div className="stat-mini-icon" style={{ background: 'rgba(244,67,54,0.1)', color: '#F44336' }}>
              <FiX />
            </div>
            <div className="stat-mini-info">
              <h3>{absentCount}</h3>
              <p>Absent</p>
            </div>
          </motion.div>
          <motion.div 
            className="stat-mini-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            style={{ borderLeft: '4px solid #FF6B00' }}
          >
            <div className="stat-mini-icon" style={{ background: 'rgba(255,107,0,0.1)', color: '#FF6B00' }}>
              <FiPercent />
            </div>
            <div className="stat-mini-info">
              <h3>{attendancePercent}%</h3>
              <p>Overall</p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Mark attendance form */}
      {showForm && canMark && (
        <form className="form-card" onSubmit={handleMark}>
          <h3>Mark Attendance</h3>
          <div className="form-group">
            <label>Student ID</label>
            <input
              name="student"
              value={form.student}
              onChange={handleChange}
              placeholder="Enter student user ID"
              required
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? <span className="spinner" /> : "Submit"}
          </button>
        </form>
      )}

      {/* Records */}
      {!selectedCourse ? (
        <div className="empty-state">
          <FiCheckSquare size={48} style={{ color: '#cbd5e1' }} />
          <p>Select a course above to view attendance records.</p>
        </div>
      ) : loadingRecords ? (
        <div className="loading-grid">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton-card" />)}
        </div>
      ) : records.length === 0 ? (
        <div className="empty-state">
          <p>No attendance records for this course yet.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th><FiUser size={13} /> Student</th>
                <th>Email</th>
                <th>Status</th>
                <th><FiCalendar size={13} /> Date</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, idx) => (
                <motion.tr 
                  key={r._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <td style={{ fontWeight: 600 }}>{r.student?.name || r.student}</td>
                  <td>{r.student?.email || "—"}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ background: STATUS_COLOR[r.status] }}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td>{new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.main>
  );
}
