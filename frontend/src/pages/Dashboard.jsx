import Sidebar from "../components/Sidebar";
import WorldMap from "../components/WorldMap";
import IndiaPanel from "../components/IndiaPanel";
import AIConsole from "../components/AIConsole";

import {
  Group,
  Panel,
  Separator,
} from "react-resizable-panels";

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
    height: "100%",
    padding: "12px",
    overflow: "hidden",
    display: "flex",
  },

  group: {
    width: "100%",
    height: "100%",
  },

  panel: {
    display: "flex",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
  },

  separatorVertical: {
    width: "6px",
    background: "#1a1e22",
    cursor: "col-resize",
  },

  separatorHorizontal: {
    height: "6px",
    background: "#1a1e22",
    cursor: "row-resize",
  },
};
