import { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { 
  FiShield, FiTrash2, FiAlertTriangle, FiUsers, 
  FiBook, FiUserCheck, FiSearch, FiEdit3, FiRefreshCw
} from "react-icons/fi";
import { motion } from "framer-motion";
import branding from "../config/branding";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Delete user state
  const [userId, setUserId] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [confirmId, setConfirmId] = useState("");

  const fetchUsers = () => {
    setLoadingUsers(true);
    api.get("/users")
      .then(({ data }) => setUsers(data))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoadingUsers(false));
  };

  const fetchStats = () => {
    api.get("/users/stats")
      .then(({ data }) => setStats(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const handleDelete = async (e) => {
    e.preventDefault();
    if (userId !== confirmId) {
      toast.error("IDs don't match. Please confirm carefully.");
      return;
    }
    setDeleting(true);
    try {
      await api.delete(`/users/${userId}`);
      toast.success("User deleted successfully.");
      setUserId("");
      setConfirmId("");
      fetchUsers();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  const handleRoleChange = async (uid, newRole) => {
    try {
      await api.put(`/users/${uid}/role`, { role: newRole });
      toast.success("Role updated!");
      fetchUsers();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role");
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
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
          <h2 className="page-title"><FiShield /> Admin Panel</h2>
          <p className="page-subtitle">{branding.fullPlatformName} — System Administration</p>
        </div>
        <button className="btn-secondary-sm" onClick={() => { fetchUsers(); fetchStats(); }}>
          <FiRefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="stats-mini-grid">
          <motion.div className="stat-mini-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="stat-mini-icon" style={{ background: 'rgba(255,107,0,0.1)', color: '#FF6B00' }}>
              <FiUsers />
            </div>
            <div className="stat-mini-info">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </motion.div>
          <motion.div className="stat-mini-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }}>
            <div className="stat-mini-icon" style={{ background: 'rgba(33,150,243,0.1)', color: '#2196F3' }}>
              <FiUserCheck />
            </div>
            <div className="stat-mini-info">
              <h3>{stats.students}</h3>
              <p>Students</p>
            </div>
          </motion.div>
          <motion.div className="stat-mini-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <div className="stat-mini-icon" style={{ background: 'rgba(76,175,80,0.1)', color: '#4CAF50' }}>
              <FiBook />
            </div>
            <div className="stat-mini-info">
              <h3>{stats.faculty}</h3>
              <p>Faculty</p>
            </div>
          </motion.div>
        </div>
      )}

      {/* User Management Table */}
      <section>
        <div className="section-header" style={{ marginBottom: '1rem' }}>
          <h3 className="section-title"><FiUsers /> User Management</h3>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
            {filteredUsers.length} of {users.length} users
          </span>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div className="search-bar" style={{ flex: 1, minWidth: '200px' }}>
            <FiSearch />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '4px', background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '4px' }}>
            {["all", "student", "faculty", "admin"].map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: 'none',
                  background: roleFilter === r ? '#FF6B00' : 'transparent',
                  color: roleFilter === r ? '#fff' : '#4a5568',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {loadingUsers ? (
          <div className="loading-grid">
            {[1, 2, 3].map(i => <div key={i} className="skeleton-card" />)}
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, idx) => (
                  <motion.tr 
                    key={u._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          background: 'linear-gradient(135deg, #FF6B00, #8B1A35)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0
                        }}>
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600 }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ color: '#64748b' }}>{u.email}</td>
                    <td>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          border: '1px solid #e2e8f0',
                          background: u.role === 'admin' ? 'rgba(244,67,54,0.08)' :
                                     u.role === 'faculty' ? 'rgba(76,175,80,0.08)' : 'rgba(33,150,243,0.08)',
                          color: u.role === 'admin' ? '#F44336' :
                                 u.role === 'faculty' ? '#4CAF50' : '#2196F3',
                          width: 'auto',
                          cursor: 'pointer',
                          textTransform: 'capitalize'
                        }}
                      >
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
                      {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => {
                          setUserId(u._id);
                          setConfirmId("");
                        }}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '6px',
                          background: 'rgba(244,67,54,0.08)',
                          color: '#F44336',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          border: '1px solid rgba(244,67,54,0.15)',
                          cursor: 'pointer'
                        }}
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Delete Confirmation */}
      {userId && (
        <motion.div 
          className="admin-card danger-card"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ 
            background: '#fff', 
            border: '1px solid rgba(244,67,54,0.2)',
            maxWidth: '500px'
          }}
        >
          <div className="admin-card-header">
            <FiAlertTriangle size={20} color="#F44336" />
            <h3>Confirm User Deletion</h3>
          </div>
          <div className="alert-box">
            <FiAlertTriangle size={16} />
            <span>This action is permanent and cannot be undone.</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#4a5568' }}>
            Deleting user: <code style={{ background: 'rgba(255,107,0,0.08)', color: '#FF6B00', padding: '2px 8px', borderRadius: '4px' }}>{userId}</code>
          </p>
          <form onSubmit={handleDelete}>
            <div className="form-group">
              <label>Type the User ID to confirm</label>
              <input
                value={confirmId}
                onChange={(e) => setConfirmId(e.target.value)}
                placeholder="Paste user ID to confirm deletion"
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
              <button
                type="submit"
                className="btn-danger"
                disabled={deleting || !confirmId || userId !== confirmId}
                style={{ flex: 1 }}
              >
                {deleting ? <span className="spinner" /> : <><FiTrash2 /> Delete Permanently</>}
              </button>
              <button
                type="button"
                className="btn-secondary-sm"
                onClick={() => { setUserId(""); setConfirmId(""); }}
                style={{ flex: 0 }}
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </motion.main>
  );
}
