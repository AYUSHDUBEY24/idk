import { useState } from "react";
import "./styles/globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [activeDomain, setActiveDomain] = useState("ALL");

  return (
    <div style={styles.app}>
      <Navbar activeDomain={activeDomain} setActiveDomain={setActiveDomain} />
      <div style={styles.body}>
        <Dashboard activeDomain={activeDomain} />
      </div>
      <Footer />
    </div>
  );
}

const styles = {
  app: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    background: "#0a0c0e",
    overflow: "hidden",
  },
  body: {
    flex: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
};