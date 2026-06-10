import { useState } from "react";

const tabs = ["ALL", "GEO", "DEFENSE", "TECH", "CLIMATE"];

export default function Navbar() {
  const [active, setActive] = useState("ALL");

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <span style={styles.logoText}>GOE</span>
        <span style={styles.logoDivider}> – </span>
        <span style={styles.logoSub}>India's POV</span>
      </div>

      <div style={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab}
            style={{
              ...styles.tab,
              ...(active === tab ? styles.tabActive : {}),
            }}
            onClick={() => setActive(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={styles.actions}>
        <button style={styles.iconBtn} title="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span style={styles.notifDot}></span>
        </button>
        <button style={styles.iconBtn} title="Settings">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    height: "56px",
    background: "#0a0c0e",
    borderBottom: "1px solid #1a1e22",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    display: "flex",
    alignItems: "baseline",
    gap: "2px",
    minWidth: "200px",
  },
  logoText: {
    fontFamily: "'Orbitron', monospace",
    fontSize: "18px",
    fontWeight: 700,
    color: "#c8922a",
    letterSpacing: "2px",
  },
  logoDivider: {
    color: "#4a4845",
    fontFamily: "'Orbitron', monospace",
    fontSize: "16px",
  },
  logoSub: {
    fontFamily: "'Orbitron', monospace",
    fontSize: "14px",
    fontWeight: 400,
    color: "#d4cfc8",
    letterSpacing: "1px",
  },
  tabs: {
    display: "flex",
    gap: "4px",
    background: "#0f1214",
    border: "1px solid #1e2428",
    borderRadius: "6px",
    padding: "4px",
  },
  tab: {
    padding: "6px 20px",
    background: "transparent",
    border: "none",
    color: "#8a8880",
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: 600,
    fontSize: "13px",
    letterSpacing: "1.5px",
    borderRadius: "4px",
    transition: "all 0.2s",
    cursor: "pointer",
  },
  tabActive: {
    background: "#1e1a12",
    color: "#c8922a",
    border: "1px solid #3a2e18",
  },
  actions: {
    display: "flex",
    gap: "8px",
    minWidth: "200px",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  iconBtn: {
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    border: "1px solid #1e2428",
    borderRadius: "6px",
    color: "#8a8880",
    cursor: "pointer",
    position: "relative",
    transition: "all 0.2s",
  },
  notifDot: {
    position: "absolute",
    top: "6px",
    right: "6px",
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#c8922a",
  },
};