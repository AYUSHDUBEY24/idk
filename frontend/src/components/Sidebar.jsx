import { useState, useEffect } from "react";

const feedItems = [
  {
    id: 1,
    time: "14:02 IST",
    text: "Maritime activity spike detected in IOR. Surveillance active.",
    status: "active",
    icon: "●",
  },
  {
    id: 2,
    time: "13:45 IST",
    text: "Trade agreement negotiations in Brussels entering Phase 3.",
    status: "info",
    icon: null,
  },
  {
    id: 3,
    time: "12:30 IST",
    text: "Border watch alert: Regional instability reported near Sect. G.",
    status: "warn",
    icon: "△",
  },
  {
    id: 4,
    time: "11:15 IST",
    text: "Semi-conductor supply chain diversifying through QUAD partners.",
    status: "info",
    icon: null,
  },
];

export default function Sidebar() {
  const [blinking, setBlinking] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setBlinking((b) => !b), 900);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={styles.sidebar}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Intelligence<br />Feed</h2>
          <p style={styles.subtitle}>Current Live Updates</p>
        </div>
        <div style={styles.hubId}>
          <span style={styles.hubLabel}>HUB-ID:</span>
          <span style={styles.hubValue}>IND-001</span>
        </div>
      </div>

      {/* Feed Items */}
      <div style={styles.feedList}>
        {feedItems.map((item) => (
          <div key={item.id} style={styles.feedItem}>
            <div
              style={{
                ...styles.feedAccent,
                background: item.status === "warn"
                  ? "#e07a3a"
                  : item.status === "active"
                  ? "#3ddc84"
                  : "#2a3038",
              }}
            />
            <div style={styles.feedContent}>
              <div style={styles.feedMeta}>
                <span style={styles.feedTime}>{item.time}</span>
                {item.status === "active" && (
                  <span
                    style={{
                      ...styles.activeDot,
                      opacity: blinking ? 1 : 0.3,
                    }}
                  >●</span>
                )}
                {item.status === "warn" && (
                  <span style={styles.warnIcon}>△</span>
                )}
              </div>
              <p style={styles.feedText}>{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Button */}
      <div style={styles.footer}>
        <button style={styles.protocolBtn}>
          INITIATE PROTOCOL
        </button>
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "280px",
    minWidth: "280px",
    background: "#0f1214",
    border: "1px solid #1a1e22",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    padding: "20px 20px 16px",
    borderBottom: "1px solid #1a1e22",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontFamily: "'Orbitron', monospace",
    fontSize: "20px",
    fontWeight: 700,
    color: "#c8922a",
    lineHeight: 1.2,
    marginBottom: "6px",
  },
  subtitle: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: "12px",
    color: "#6a6865",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  hubId: {
    background: "#1a1612",
    border: "1px solid #2a2218",
    borderRadius: "4px",
    padding: "6px 10px",
    textAlign: "center",
  },
  hubLabel: {
    display: "block",
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "10px",
    color: "#6a6865",
    letterSpacing: "1px",
  },
  hubValue: {
    display: "block",
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "12px",
    color: "#c8922a",
    letterSpacing: "1px",
  },
  feedList: {
    flex: 1,
    padding: "12px 0",
    overflowY: "auto",
  },
  feedItem: {
    display: "flex",
    gap: "12px",
    padding: "12px 20px",
    borderBottom: "1px solid #13161a",
    transition: "background 0.2s",
  },
  feedAccent: {
    width: "2px",
    minWidth: "2px",
    borderRadius: "2px",
    alignSelf: "stretch",
  },
  feedContent: {
    flex: 1,
  },
  feedMeta: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "4px",
  },
  feedTime: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "11px",
    color: "#6a6865",
    letterSpacing: "0.5px",
  },
  activeDot: {
    color: "#3ddc84",
    fontSize: "10px",
    transition: "opacity 0.3s",
  },
  warnIcon: {
    color: "#e07a3a",
    fontSize: "11px",
  },
  feedText: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: "14px",
    color: "#c0bbb4",
    lineHeight: 1.4,
    fontWeight: 500,
  },
  footer: {
    padding: "16px 20px",
    borderTop: "1px solid #1a1e22",
  },
  protocolBtn: {
    width: "100%",
    padding: "12px",
    background: "transparent",
    border: "1px solid #3a2e18",
    borderRadius: "4px",
    color: "#c8922a",
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: 700,
    fontSize: "13px",
    letterSpacing: "2px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
};