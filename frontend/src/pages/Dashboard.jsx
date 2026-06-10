import Sidebar from "../components/Sidebar";
import WorldMap from "../components/WorldMap";
import IndiaPanel from "../components/IndiaPanel";
import AIConsole from "../components/AIConsole";

export default function Dashboard() {
  return (
    <main style={styles.main}>
      {/* Left column – Intelligence Feed */}
      <div style={styles.leftCol}>
        <Sidebar />
      </div>

      {/* Right column */}
      <div style={styles.rightCol}>
        {/* Top – World Map */}
        <div style={styles.mapRow}>
          <WorldMap />
        </div>

        {/* Bottom row – India Analytics + AI Console */}
        <div style={styles.bottomRow}>
          <IndiaPanel />
          <AIConsole />
        </div>
      </div>
    </main>
  );
}

const styles = {
  main: {
    display: "flex",
    gap: "12px",
    padding: "12px",
    flex: 1,
    overflow: "hidden",
    height: "100%",
  },
  leftCol: {
    display: "flex",
    flexDirection: "column",
  },
  rightCol: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    minWidth: 0,
    overflow: "hidden",
  },
  mapRow: {
    flex: "0 0 46%",
    display: "flex",
    minHeight: 0,
  },
  bottomRow: {
    flex: 1,
    display: "flex",
    gap: "12px",
    minHeight: 0,
  },
};