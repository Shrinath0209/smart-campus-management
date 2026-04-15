import { Link } from "react-router-dom";
import { 
  FiArrowRight, FiBookOpen, FiCheckCircle, FiTrendingUp, 
  FiShield, FiUsers, FiGlobe, FiAward
} from "react-icons/fi";
import { motion } from "framer-motion";
import branding from "../config/branding";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export default function HomePage() {
  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-brand">
          <div dangerouslySetInnerHTML={{ __html: branding.logoSVG(36) }} />
          <span>{branding.fullPlatformName}</span>
        </div>
        <div className="landing-auth-links">
          <Link to="/login" className="nav-btn-outline">Sign In</Link>
          <Link to="/register" className="nav-btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="hero-content">
          <motion.div variants={itemVariants} style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            background: `rgba(255,107,0,0.08)`,
            borderRadius: '30px',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: branding.colors.primary,
            marginBottom: '1.5rem',
            border: '1px solid rgba(255,107,0,0.15)'
          }}>
            <FiAward size={14} />
            {branding.accreditationBadge}
          </motion.div>

          <motion.h1 className="hero-title" variants={itemVariants}>
            {branding.universityName} <br/>
            <span className="text-gradient">{branding.platformName}</span>
          </motion.h1>
          <motion.p className="hero-subtitle" variants={itemVariants}>
            {branding.tagline}. Access courses, track attendance, 
            view grades, and manage your entire academic journey — all in one powerful ecosystem.
          </motion.p>
          <motion.div className="hero-actions" variants={itemVariants}>
            <Link to="/register" className="btn-hero-primary">
              Register Now <FiArrowRight />
            </Link>
            <Link to="/login" className="btn-hero-secondary">
              Student Login
            </Link>
          </motion.div>

          {/* Mini Stats */}
          <motion.div variants={itemVariants} style={{
            display: 'flex',
            gap: '2rem',
            marginTop: '2.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e2e8f0'
          }}>
            {[
              { val: branding.stats.students, label: 'Students' },
              { val: branding.stats.programs, label: 'Programs' },
              { val: branding.stats.faculty, label: 'Faculty' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: branding.colors.primary, fontFamily: 'Poppins' }}>{s.val}</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="hero-visual">
          <motion.div 
            className="floating-card card-1"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <FiBookOpen size={22} />
            <span>Smart Courses</span>
          </motion.div>
          <motion.div 
            className="floating-card card-2"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          >
            <FiCheckCircle size={22} />
            <span>Live Attendance</span>
          </motion.div>
          <motion.div 
            className="floating-card card-3"
            animate={{ y: [0, -18, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          >
            <FiTrendingUp size={22} />
            <span>Grade Analytics</span>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="features-section">
        <motion.h2 
          className="section-title-centered"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Why Choose <span className="text-gradient">{branding.fullPlatformName}?</span>
        </motion.h2>
        <div className="features-grid">
          {[
            { icon: <FiBookOpen />, title: "Course Management", desc: "Access all your enrolled courses, materials, assignments, and lecture schedules in one place." },
            { icon: <FiCheckCircle />, title: "Smart Attendance", desc: "Real-time attendance tracking with detailed reports and percentage analytics." },
            { icon: <FiTrendingUp />, title: "Grade Analytics", desc: "Track your CGPA, semester performance, and detailed grade breakdowns." },
            { icon: <FiShield />, title: "Secure Platform", desc: "Enterprise-grade security to protect your academic data and privacy." },
            { icon: <FiUsers />, title: "Faculty Connect", desc: "Direct communication with faculty members for doubt resolution and mentorship." },
            { icon: <FiGlobe />, title: "24/7 Access", desc: "Access your academic resources anytime, anywhere from any device." }
          ].map((feature, idx) => (
            <motion.div 
              key={idx} 
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="landing-stats">
        {[
          { label: "Active Courses", val: branding.stats.courses },
          { label: "Happy Students", val: branding.stats.students },
          { label: "Expert Faculty", val: branding.stats.faculty },
          { label: "Programs Offered", val: branding.stats.programs }
        ].map((stat, idx) => (
          <motion.div 
            key={idx} 
            className="stat-item"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <h2>{stat.val}</h2>
            <p>{stat.label}</p>
          </motion.div>
        ))}
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div dangerouslySetInnerHTML={{ __html: branding.logoSVG(24) }} />
            <span>{branding.fullPlatformName}</span>
          </div>
          <p>{branding.copyrightText}</p>
        </div>
      </footer>
    </div>
  );
}
