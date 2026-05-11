import { useEffect, useRef, useState } from "react";

const INDIA_LAYERS = [
  { id: "border",    icon: "⚑", label: "BORDER ALERTS",       color: "#e05252", defaultOn: true },
  { id: "economic",  icon: "⬡", label: "ECONOMIC ZONES",      color: "#3ddc84", defaultOn: true },
  { id: "military",  icon: "✈", label: "MILITARY BASES",      color: "#4a8ae8" },
  { id: "ports",     icon: "⚓", label: "NAVAL PORTS",         color: "#c8922a" },
  { id: "protests",  icon: "⚑", label: "CIVIL UNREST",        color: "#e0a83a" },
  { id: "cyber",     icon: "⬜", label: "CYBER INCIDENTS",     color: "#8a6ae0" },
];

const MARKERS = {
  border: [
    { lat: 34.1,  lng: 77.5,  label: "Ladakh — Active Standoff",   pulse: true },
    { lat: 27.5,  lng: 88.5,  label: "Sikkim — Watch Zone",        pulse: true },
    { lat: 28.0,  lng: 97.3,  label: "Arunachal — Incursion Alert",pulse: true },
    { lat: 23.6,  lng: 69.2,  label: "Kutch — Border Patrol" },
  ],
  economic: [
    { lat: 19.0,  lng: 73.0,  label: "Mumbai — Financial Hub" },
    { lat: 12.9,  lng: 77.6,  label: "Bangalore — Tech Corridor" },
    { lat: 17.4,  lng: 78.5,  label: "Hyderabad — Pharma SEZ" },
    { lat: 22.5,  lng: 88.3,  label: "Kolkata — Trade Gateway" },
    { lat: 13.0,  lng: 80.2,  label: "Chennai — Auto Hub" },
    { lat: 23.0,  lng: 72.6,  label: "Ahmedabad — Diamond SEZ" },
  ],
  military: [
    { lat: 28.6,  lng: 77.2,  label: "New Delhi — South Command" },
    { lat: 26.9,  lng: 80.9,  label: "Lucknow — Central Command" },
    { lat: 11.6,  lng: 79.8,  label: "Trichy — Air Base" },
    { lat: 15.5,  lng: 73.8,  label: "Goa — Naval Station" },
    { lat: 27.5,  lng: 94.9,  label: "Jorhat — Eastern Air Cmd" },
    { lat: 30.7,  lng: 76.7,  label: "Chandigarh — Western Cmd" },
  ],
  ports: [
    { lat: 22.3,  lng: 70.0,  label: "Kandla Port" },
    { lat: 18.9,  lng: 72.8,  label: "JNPT Mumbai" },
    { lat: 13.1,  lng: 80.3,  label: "Chennai Port" },
    { lat: 10.9,  lng: 76.9,  label: "Kochi Naval Base" },
    { lat: 17.7,  lng: 83.3,  label: "Visakhapatnam" },
    { lat: 20.3,  lng: 86.8,  label: "Paradip Port" },
  ],
  protests: [
    { lat: 28.7,  lng: 77.1,  label: "Delhi — Farmers Rally",  pulse: true },
    { lat: 22.6,  lng: 88.4,  label: "Kolkata — Demonstration" },
    { lat: 23.2,  lng: 77.4,  label: "Bhopal — Civil Unrest",  pulse: true },
  ],
  cyber: [
    { lat: 12.9,  lng: 77.6,  label: "Bangalore — Breach Detected", pulse: true },
    { lat: 19.1,  lng: 72.9,  label: "Mumbai — DDoS Incident" },
    { lat: 28.6,  lng: 77.2,  label: "Delhi — Phishing Campaign",   pulse: true },
  ],
};

function markerHtml(color, pulse) {
  if (pulse) {
    return `<div style="width:22px;height:22px;position:relative;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;width:20px;height:20px;border-radius:50%;background:${color};opacity:0.25;animation:indiaPulse 1.8s ease-out infinite;"></div>
      <div style="width:8px;height:8px;border-radius:50%;background:${color};box-shadow:0 0 8px ${color};z-index:2;border:1px solid rgba(255,255,255,0.3);"></div>
    </div>`;
  }
  return `<div style="width:9px;height:9px;border-radius:50%;background:${color};box-shadow:0 0 6px ${color};border:1px solid rgba(255,255,255,0.25);"></div>`;
}

export default function IndiaPanel() {
  const mapRef  = useRef(null);
  const mapObj  = useRef(null);
  const groups  = useRef({});
  const [search, setSearch] = useState("");
  const [states, setStates] = useState(() => {
    const s = {};
    INDIA_LAYERS.forEach((l) => (s[l.id] = !!l.defaultOn));
    return s;
  });
  const [liveSync] = useState(100);

  useEffect(() => {
    if (mapObj.current || !mapRef.current) return;
    const L = window.L;
    if (!L) return;

    // India center
    const map = L.map(mapRef.current, {
      center: [22.5, 82.5],
      zoom: 4,
      zoomControl: false,
      minZoom: 3,
      maxZoom: 10,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    // Build layer groups
    INDIA_LAYERS.forEach((layer) => {
      const group = L.layerGroup();
      (MARKERS[layer.id] || []).forEach((m) => {
        const icon = L.divIcon({
          html: markerHtml(layer.color, m.pulse),
          className: "",
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });
        L.marker([m.lat, m.lng], { icon })
          .bindPopup(
            `<div style="font-family:'Share Tech Mono',monospace;font-size:11px;color:#d4cfc8;background:#0f1214;border:1px solid #2a3038;padding:8px 12px;border-radius:3px;min-width:160px;">${m.label}</div>`,
            { className: "india-popup", closeButton: false }
          )
          .addTo(group);
      });
      groups.current[layer.id] = group;
      if (layer.defaultOn) group.addTo(map);
    });

    mapObj.current = map;
    return () => { map.remove(); mapObj.current = null; };
  }, []);

  // Sync layer visibility
  useEffect(() => {
    const map = mapObj.current;
    if (!map) return;
    INDIA_LAYERS.forEach((l) => {
      const g = groups.current[l.id];
      if (!g) return;
      states[l.id]
        ? (!map.hasLayer(g) && g.addTo(map))
        : (map.hasLayer(g) && map.removeLayer(g));
    });
  }, [states]);

  const toggle = (id) => setStates((prev) => ({ ...prev, [id]: !prev[id] }));
  const filtered = INDIA_LAYERS.filter((l) =>
    l.label.includes(search.toUpperCase())
  );

  return (
    <div style={s.root}>
      <style>{`
        @keyframes indiaPulse { 0%{transform:scale(1);opacity:.4} 100%{transform:scale(3.5);opacity:0} }
        .leaflet-container { background:#080c10 !important; }
        .india-popup .leaflet-popup-content-wrapper { background:transparent!important;border:none!important;box-shadow:none!important;padding:0!important; }
        .india-popup .leaflet-popup-tip-container { display:none!important; }
        .india-popup .leaflet-popup-content { margin:0!important; }
        #india-search::placeholder { color:#3a3835; }
        .india-layer-item:hover { background: rgba(255,255,255,0.03); }
      `}</style>

      {/* ── TOP BAR ── */}
      <div style={s.topBar}>
        <div style={s.topLeft}>
          <span style={s.panelLabel}>REGIONAL IMPACT ANALYTICS</span>
          <span style={s.subLabel}>India Threat & Economic Surface</span>
        </div>
        <div style={s.topRight}>
          <span style={s.syncDot} />
          <span style={s.syncText}>LIVE SYNC: {liveSync}%</span>
        </div>
      </div>

      <div style={s.body}>
        {/* ── LAYERS PANEL ── */}
        <div style={s.panel}>
          <div style={s.pHead}>
            <span style={s.pTitle}>LAYERS</span>
            <div style={s.pIcons}>
              <span style={s.iBtn}>?</span>
              <span style={s.iBtn}>▼</span>
            </div>
          </div>

          <div style={s.searchBox}>
            <input
              id="india-search"
              style={s.search}
              placeholder="Search layers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={s.list}>
            {filtered.map((l) => (
              <div
                key={l.id}
                className="india-layer-item"
                style={s.row}
                onClick={() => toggle(l.id)}
              >
                <div style={{
                  ...s.cb,
                  background: states[l.id] ? "#1a3a5c" : "transparent",
                  borderColor: states[l.id] ? "#2a6aac" : "#2a3038",
                }}>
                  {states[l.id] && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke="#4ab8e8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span style={{ ...s.lIcon, color: l.color }}>{l.icon}</span>
                <span style={s.lLabel}>{l.label}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={s.stats}>
            <div style={s.stat}>
              <span style={s.statVal({ color: "#3ddc84" })}>+2.4%</span>
              <span style={s.statKey}>ECONOMIC</span>
            </div>
            <div style={s.statDiv} />
            <div style={s.stat}>
              <span style={s.statVal({ color: "#e0a83a" })}>ADVISORY</span>
              <span style={s.statKey}>SECURITY</span>
            </div>
          </div>
        </div>

        {/* ── MAP ── */}
        <div style={s.mapWrap}>
          <div ref={mapRef} style={s.map} />

          {/* Zoom controls */}
          <div style={s.zoom}>
            <button style={s.zBtn} onClick={() => mapObj.current?.zoomIn()}>+</button>
            <button style={s.zBtn} onClick={() => mapObj.current?.zoomOut()}>−</button>
            <button style={{ ...s.zBtn, marginTop: 4 }} onClick={() => mapObj.current?.setView([22.5, 82.5], 4)}>⌂</button>
          </div>

          {/* HUB ID badge */}
          <div style={s.hubBadge}>
            <span style={s.hubKey}>HUB-ID</span>
            <span style={s.hubVal}>IND-001</span>
          </div>

          {/* WEBGL badge */}
          <div style={s.webgl}>WEBGL</div>
        </div>
      </div>
    </div>
  );
}

const s = {
  root: {
    flex: 1,
    background: "#0f1214",
    border: "1px solid #1a1e22",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    minWidth: 0,
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 14px",
    borderBottom: "1px solid #1a1e22",
    flexShrink: 0,
  },
  topLeft: { display: "flex", flexDirection: "column", gap: "2px" },
  panelLabel: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: "11px",
    fontWeight: 700,
    color: "#3ddc84",
    letterSpacing: "2px",
    textTransform: "uppercase",
  },
  subLabel: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "10px",
    color: "#4a4845",
    letterSpacing: "0.5px",
  },
  topRight: { display: "flex", alignItems: "center", gap: "6px" },
  syncDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#3ddc84",
    boxShadow: "0 0 4px #3ddc84",
    display: "inline-block",
  },
  syncText: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "10px",
    color: "#6a6865",
    letterSpacing: "0.5px",
  },
  body: {
    flex: 1,
    display: "flex",
    overflow: "hidden",
    minHeight: 0,
  },
  panel: {
    width: "160px",
    minWidth: "160px",
    background: "rgba(10,12,14,0.95)",
    borderRight: "1px solid #1e2428",
    display: "flex",
    flexDirection: "column",
    zIndex: 10,
  },
  pHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 10px",
    borderBottom: "1px solid #1e2428",
  },
  pTitle: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "10px",
    color: "#8a8880",
    letterSpacing: "2px",
  },
  pIcons: { display: "flex", gap: "4px" },
  iBtn: {
    width: "18px",
    height: "18px",
    background: "#1a1e22",
    border: "1px solid #252b30",
    borderRadius: "2px",
    color: "#6a6865",
    fontSize: "9px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Share Tech Mono', monospace",
    userSelect: "none",
  },
  searchBox: { padding: "6px 8px", borderBottom: "1px solid #1e2428" },
  search: {
    width: "100%",
    background: "#0f1214",
    border: "1px solid #252b30",
    borderRadius: "3px",
    color: "#8a8880",
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "9px",
    padding: "4px 6px",
    outline: "none",
    letterSpacing: "0.5px",
  },
  list: { flex: 1, overflowY: "auto", padding: "3px 0" },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 10px",
    cursor: "pointer",
    userSelect: "none",
    transition: "background 0.15s",
  },
  cb: {
    width: "13px",
    height: "13px",
    border: "1px solid #2a3038",
    borderRadius: "2px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all .15s",
  },
  lIcon: { fontSize: "11px", width: "14px", textAlign: "center", flexShrink: 0 },
  lLabel: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "9px",
    color: "#8a8880",
    letterSpacing: "0.5px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  stats: {
    borderTop: "1px solid #1e2428",
    padding: "8px 10px",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },
  stat: { display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" },
  statVal: ({ color }) => ({
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "11px",
    color,
    letterSpacing: "0.5px",
    fontWeight: 700,
  }),
  statKey: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "8px",
    color: "#4a4845",
    letterSpacing: "1px",
  },
  statDiv: {
    width: "1px",
    height: "24px",
    background: "#1e2428",
  },
  mapWrap: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  zoom: {
    position: "absolute",
    top: "8px",
    right: "8px",
    zIndex: 1001,
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  zBtn: {
    width: "24px",
    height: "24px",
    background: "rgba(10,12,14,0.9)",
    border: "1px solid #2a3038",
    borderRadius: "3px",
    color: "#8a8880",
    fontSize: "13px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "monospace",
    transition: "all 0.15s",
  },
  hubBadge: {
    position: "absolute",
    bottom: "8px",
    left: "8px",
    zIndex: 1001,
    background: "rgba(10,12,14,0.88)",
    border: "1px solid #2a2218",
    borderRadius: "3px",
    padding: "4px 8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  hubKey: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "8px",
    color: "#4a4845",
    letterSpacing: "1px",
  },
  hubVal: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "11px",
    color: "#c8922a",
    letterSpacing: "1px",
  },
  webgl: {
    position: "absolute",
    bottom: "8px",
    right: "8px",
    zIndex: 1001,
    background: "rgba(0,200,100,0.1)",
    border: "1px solid rgba(61,220,132,0.3)",
    color: "#3ddc84",
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "9px",
    padding: "3px 6px",
    borderRadius: "2px",
    letterSpacing: "1px",
  },
};