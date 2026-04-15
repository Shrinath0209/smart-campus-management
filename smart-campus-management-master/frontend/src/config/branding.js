/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  UNIVERSITY BRANDING CONFIGURATION                          ║
 * ║  ─────────────────────────────────────────────────────────── ║
 * ║  Change these values to rebrand for ANY university.          ║
 * ║  This is the ONLY file you need to edit for white-labeling. ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

const branding = {
  // ─── University Identity ────────────────────────────────────
  universityName: "Lovely Professional University",
  universityShortName: "LPU",
  platformName: "eCampus",
  fullPlatformName: "LPU eCampus",
  tagline: "Your unified platform for academic excellence",
  
  // ─── Contact & Support ──────────────────────────────────────
  supportEmail: "support@lpu.in",
  helpDeskLabel: "IT HELPDESK",
  websiteUrl: "https://www.lpu.in",
  
  // ─── Accreditation / Badges ─────────────────────────────────
  accreditationBadge: "NAAC A++ Accredited University",
  
  // ─── Statistics (for landing page) ──────────────────────────
  stats: {
    students: "30,000+",
    programs: "200+",
    faculty: "3,500+",
    courses: "500+",
  },

  // ─── Copyright ──────────────────────────────────────────────
  copyrightYear: new Date().getFullYear(),
  get copyrightText() {
    return `© ${this.copyrightYear} ${this.universityName}. All Rights Reserved.`;
  },

  // ─── Default Academic Info ──────────────────────────────────
  defaultProgram: "B.Tech CSE",
  
  getSemester() {
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    const sem = month >= 7 ? "Odd" : "Even";
    const endYear = month >= 7 ? year + 1 : year;
    return `${sem} Semester ${year}-${String(endYear).slice(2)}`;
  },

  // ─── Colors (CSS vars are in index.css, but these are for JS use) ──
  colors: {
    primary: "#FF6B00",
    primaryDark: "#E65100",
    primaryLight: "#FF8F00",
    secondary: "#8B1A35",
    secondaryDark: "#6D1429",
    sidebarBg: "#1a1f36",
  },

  // ─── Logo SVG (inline for portability — replace with <img> if you have a logo file)
  /** Returns an SVG string for the logo at the given size */
  logoSVG(size = 32) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="${this.colors.primary}" opacity="0.1"/>
      <path d="M16 6L26 12V20L16 26L6 20V12L16 6Z" fill="${this.colors.primary}" opacity="0.85"/>
      <path d="M16 10L22 14V18L16 22L10 18V14L16 10Z" fill="${this.colors.secondary}"/>
    </svg>`;
  },
};

export default branding;
