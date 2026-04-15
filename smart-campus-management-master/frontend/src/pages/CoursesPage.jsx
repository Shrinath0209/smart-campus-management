import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { 
  FiPlus, FiBook, FiUser, FiX, FiSearch, 
  FiCheckCircle, FiUsers, FiClock, FiFilter
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ 
    title: "", 
    description: "", 
    category: "Computer Science", 
    duration: "8 Weeks", 
    lessons: 20 
  });
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const fetchCourses = () => {
    setLoading(true);
    api.get("/courses")
      .then(({ data }) => setCourses(data))
      .catch(() => toast.error("Failed to load courses"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleSeed = async () => {
    try {
      await api.post("/courses/seed");
      toast.success("Courses seeded! 🌟");
      fetchCourses();
    } catch (err) {
      toast.error("Failed to seed courses");
    }
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/courses", form);
      toast.success("Course created! 🚀");
      setForm({ title: "", description: "", category: "Computer Science", duration: "8 Weeks", lessons: 20 });
      setShowForm(false);
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create course");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await api.post(`/courses/${courseId}/enroll`);
      toast.success("Successfully enrolled! 🎓");
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Enrollment failed");
    }
  };

  const canCreate = user?.role === "faculty" || user?.role === "admin";

  const categories = ["All", ...new Set(courses.map(c => c.category).filter(Boolean))];
  
  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.instructor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "All" || c.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.main 
      className="page-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="page-header">
        <div>
          <h2 className="page-title"><FiBook /> Course Catalog</h2>
          <p className="page-subtitle">Browse and enroll in courses offered this semester</p>
        </div>
        <div className="header-actions">
          {canCreate && (
            <button className="btn-secondary-sm" onClick={handleSeed}>
              Seed Demo
            </button>
          )}
          <div className="search-bar">
            <FiSearch />
            <input 
              type="text" 
              placeholder="Search courses..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {canCreate && (
            <button className="btn-primary" onClick={() => setShowForm((v) => !v)}>
              {showForm ? <><FiX /> Cancel</> : <><FiPlus /> New Course</>}
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        flexWrap: 'wrap',
        padding: '4px',
        background: '#fff',
        borderRadius: '10px',
        border: '1px solid #e2e8f0'
      }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            style={{
              padding: '7px 16px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              border: 'none',
              background: activeFilter === cat ? '#FF6B00' : 'transparent',
              color: activeFilter === cat ? '#fff' : '#4a5568',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {showForm && canCreate && (
          <motion.form 
            className="form-card glass" 
            onSubmit={handleAdd}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <h3>Launch New Course</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Course Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Advanced Data Structures"
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science"
                  required
                />
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="e.g. 8 Weeks"
                />
              </div>
              <div className="form-group">
                <label>Lessons Count</label>
                <input
                  type="number"
                  name="lessons"
                  value={form.lessons}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Outline what students will learn..."
                rows={3}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? <span className="spinner" /> : "Publish Course"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Results Count */}
      <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>
        Showing {filteredCourses.length} of {courses.length} courses
      </div>

      {loading ? (
        <div className="loading-grid">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton-card" />)}
        </div>
      ) : filteredCourses.length === 0 ? (
        <motion.div 
          className="empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <FiBook size={48} opacity={0.3} />
          <p>No courses found{searchTerm ? ` for "${searchTerm}"` : ''}.</p>
        </motion.div>
      ) : (
        <div className="courses-grid">
          {filteredCourses.map((c, idx) => {
            const isEnrolled = c.students?.some(s => s._id === user?.id || s === user?.id);
            return (
              <motion.div 
                key={c._id} 
                className="course-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.04 }}
                whileHover={{ y: -5 }}
              >
                <div className="course-card-img">
                  <img src={c.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"} alt={c.title} />
                  <div className="course-category-floating">{c.category || "General"}</div>
                  {isEnrolled && (
                    <div className="enrolled-overlay">
                      <FiCheckCircle /> Enrolled
                    </div>
                  )}
                </div>

                <div className="course-card-content">
                  <h3 className="course-title">{c.title}</h3>
                  <p className="course-desc">
                    {c.description || "Unlock the potential of this subject with expert guidance."}
                  </p>
                  
                  <div className="course-stats-detailed">
                    <div className="stat-detail">
                      <FiBook />
                      <span>{c.lessons || 10} Lessons</span>
                    </div>
                    <div className="stat-detail">
                      <FiClock />
                      <span>{c.duration || "4 Weeks"}</span>
                    </div>
                  </div>

                  <div className="course-instructor-info">
                    <div className="instructor-avatar">
                      {c.instructor?.name?.charAt(0) || "U"}
                    </div>
                    <div className="instructor-details">
                      <span className="inst-name">{c.instructor?.name || "Faculty Member"}</span>
                      <span className="inst-role">Instructor</span>
                    </div>
                    <div className="student-count-mini">
                      <FiUsers />
                      <span>{c.students?.length || 0}</span>
                    </div>
                  </div>

                  <div className="course-actions-lms">
                    {user?.role === "student" && !isEnrolled && (
                      <button className="btn-enroll-lms" onClick={() => handleEnroll(c._id)}>
                        Enroll in Course
                      </button>
                    )}
                    {user?.role === "student" && isEnrolled && (
                      <button className="btn-enrolled-lms" disabled>
                        ✓ Already Enrolled
                      </button>
                    )}
                    {canCreate && (
                      <button className="btn-manage-lms">
                        Manage Course
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.main>
  );
}
