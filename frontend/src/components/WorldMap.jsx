import { useEffect, useRef, useState } from "react";
import {
  Group,
  Panel,
  Separator,
} from "react-resizable-panels";

const LAYERS_DATA = [
  {
    id: "intel_nodes",
    icon: "◈",
    label: "INTELLIGENCE NODES",
    color: "#c8922a",
    defaultOn: true,
  },
  { id: "pipelines", icon: "⬡", label: "PIPELINES", color: "#e07a3a" },
  { id: "storage", icon: "⊟", label: "STORAGE FACILITIES", color: "#c8922a" },
  { id: "fuel", icon: "⊙", label: "FUEL SHORTAGES", color: "#e05252" },
  { id: "ai", icon: "⬜", label: "AI DATA CENTERS", color: "#4ab8e8" },
  {
    id: "military",
    icon: "✈",
    label: "MILITARY ACTIVITY",
    color: "#4a8ae8",
    defaultOn: true,
  },
  { id: "ships", icon: "⚓", label: "SHIP TRAFFIC", color: "#3ddc84" },
  { id: "trade", icon: "⚓", label: "TRADE ROUTES", color: "#c8922a" },
  { id: "aviation", icon: "✈", label: "AVIATION", color: "#8a6ae0" },
  { id: "protests", icon: "⚑", label: "PROTESTS", color: "#e0a83a" },
  { id: "armed", icon: "⚑", label: "ARMED CONFLICT EVENTS", color: "#e05252" },
];
const COUNTRY_COORDS = {
  Iran: [32.4, 53.7],
  India: [20.6, 78.9],
  Israel: [31.0, 35.0],
  "U.S.": [38.9, -77.0],
  Pakistan: [30.4, 69.3],
  China: [35.9, 104.2],
  Russia: [61.5, 105.3],
  Turkey: [38.9, 35.2],
  "Saudi Arabia": [23.9, 45.1],
  Ukraine: [48.4, 31.2],
  France: [46.2, 2.2],
  Germany: [51.2, 10.4],
  UK: [55.4, -3.4],
  Congress: [38.9, -77.0],
  UN: [40.7, -74.0],
  Hamas: [31.5, 34.5],
  NATO: [50.9, 4.3],
  Gaza: [31.4, 34.3],
};
const MARKERS = {
  military: [
    { lat: 28.6, lng: 77.2, label: "New Delhi — Op Zone" },
    { lat: 19.0, lng: 73.0, label: "Mumbai — Naval Base" },
    { lat: 13.0, lng: 80.2, label: "Chennai — Air Command" },
    { lat: 51.5, lng: -0.1, label: "London — NATO HQ" },
    { lat: 55.75, lng: 37.6, label: "Moscow — Defense Min" },
    { lat: 39.9, lng: 116.4, label: "Beijing — Command" },
    { lat: 38.9, lng: -77.0, label: "Washington — Pentagon" },
  ],
  ships: [
    { lat: 12.0, lng: 45.0, label: "Gulf of Aden — Convoy" },
    { lat: 1.2, lng: 104.0, label: "Strait of Malacca" },
    { lat: 30.0, lng: 32.5, label: "Suez — Transit" },
    { lat: -6.0, lng: 39.0, label: "Dar es Salaam Port" },
  ],
  trade: [
    { lat: 22.3, lng: 114.2, label: "Hong Kong — Trade Hub" },
    { lat: 1.3, lng: 103.8, label: "Singapore Port" },
    { lat: 51.9, lng: 4.5, label: "Rotterdam" },
    { lat: 34.0, lng: -118.2, label: "Los Angeles Port" },
  ],
  armed: [
    { lat: 15.5, lng: 32.5, label: "Sudan Conflict Zone", pulse: true },
    { lat: 48.4, lng: 35.0, label: "Ukraine Frontline", pulse: true },
    { lat: 31.5, lng: 35.0, label: "Gaza — Active", pulse: true },
    { lat: 15.0, lng: 42.0, label: "Yemen — Air Strikes", pulse: true },
  ],
  protests: [
    { lat: 41.0, lng: 29.0, label: "Istanbul — Rally" },
    { lat: 48.9, lng: 2.3, label: "Paris — Demonstration" },
    { lat: -26.2, lng: 28.0, label: "Johannesburg" },
  ],
  fuel: [
    { lat: 23.6, lng: -102.5, label: "Mexico — Shortage" },
    { lat: -8.8, lng: 13.2, label: "Luanda Fuel Crisis" },
    { lat: 6.5, lng: 3.4, label: "Lagos — Scarcity" },
  ],
  ai: [
    { lat: 37.4, lng: -122.1, label: "Silicon Valley DC" },
    { lat: 53.3, lng: -6.3, label: "Dublin Cloud Hub" },
    { lat: 35.7, lng: 139.7, label: "Tokyo Data Center" },
    { lat: 22.5, lng: 114.1, label: "Shenzhen AI Campus" },
  ],
  pipelines: [
    { lat: 57.0, lng: 65.0, label: "Trans-Siberian Pipeline" },
    { lat: 41.0, lng: 49.0, label: "BTC Pipeline — Baku" },
    { lat: 36.0, lng: 58.0, label: "Iran — Gas Corridor" },
    { lat: 27.0, lng: 53.0, label: "Persian Gulf Line" },
  ],
  storage: [
    { lat: 26.0, lng: 50.5, label: "Saudi Aramco — Ras Tanura" },
    { lat: 29.3, lng: 47.9, label: "Kuwait Storage Terminal" },
    { lat: 24.4, lng: 54.4, label: "Abu Dhabi Reserve" },
  ],
  aviation: [
    { lat: 25.2, lng: 55.4, label: "Dubai — Aviation Hub" },
    { lat: 51.5, lng: -0.5, label: "Heathrow — IFR Zone" },
    { lat: 40.6, lng: -73.8, label: "JFK — Airspace" },
    { lat: 35.5, lng: 139.8, label: "Tokyo Narita" },
  ],
};

function markerHtml(color, pulse) {
  if (pulse) {
    return `<div style="width:22px;height:22px;position:relative;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;width:20px;height:20px;border-radius:50%;background:${color};opacity:0.25;animation:mapPulse 1.8s ease-out infinite;"></div>
      <div style="width:8px;height:8px;border-radius:50%;background:${color};box-shadow:0 0 8px ${color};z-index:2;border:1px solid rgba(255,255,255,0.3);"></div>
    </div>`;
  }
  return `<div style="width:9px;height:9px;border-radius:50%;background:${color};box-shadow:0 0 6px ${color};border:1px solid rgba(255,255,255,0.25);"></div>`;
}

export default function WorldMap() {
  const mapRef = useRef(null);
  const mapObj = useRef(null);
  const groups = useRef({});
  const [search, setSearch] = useState("");
  const [intelEntities, setIntelEntities] = useState([]);
  const [states, setStates] = useState(() => {
    const s = {};
    LAYERS_DATA.forEach((l) => (s[l.id] = !!l.defaultOn));
    return s;
  });

  useEffect(() => {
    if (mapObj.current || !mapRef.current) return;
    const L = window.L;
    if (!L) return;

    const map = L.map(mapRef.current, {
      center: [20, 20],
      zoom: 2,
      zoomControl: false,
      minZoom: 2,
      maxZoom: 10,
      attributionControl: false,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 19,
      },
    ).addTo(map);

    LAYERS_DATA.forEach((layer) => {
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
            { className: "goe-popup", closeButton: false },
          )
          .addTo(group);
      });
      groups.current[layer.id] = group;
      if (layer.defaultOn) group.addTo(map);
    });
    // Intel nodes group
    const intelGroup = L.layerGroup();
    groups.current["intel_nodes"] = intelGroup;
    if (true) intelGroup.addTo(map); // default on
    mapObj.current = map;
    return () => {
      map.remove();
      mapObj.current = null;
    };
  }, []);
  useEffect(() => {
    fetch("http://localhost:8000/api/graph/entities?limit=30")
      .then((r) => r.json())
      .then((data) => setIntelEntities(data))
      .catch(() => {});
  }, []);
  useEffect(() => {
    const map = mapObj.current;
    if (!map) return;
    LAYERS_DATA.forEach((l) => {
      const g = groups.current[l.id];
      if (!g) return;
      states[l.id]
        ? !map.hasLayer(g) && g.addTo(map)
        : map.hasLayer(g) && map.removeLayer(g);
    });
  }, [states]);

  const toggle = (id) => setStates((prev) => ({ ...prev, [id]: !prev[id] }));
  const filtered = LAYERS_DATA.filter((l) =>
    l.label.includes(search.toUpperCase()),
  );
  useEffect(() => {
    const map = mapObj.current;
    const L = window.L;
    if (!map || !L || intelEntities.length === 0) return;

    const group = groups.current["intel_nodes"];
    if (!group) return;
    group.clearLayers();

    const maxConn = Math.max(...intelEntities.map((e) => e.connections || 1));

    intelEntities.forEach((entity) => {
      const coords = COUNTRY_COORDS[entity.name];
      if (!coords) return;

      const size = Math.max(
        8,
        Math.min(24, (entity.connections / maxConn) * 24),
      );
      const color =
        entity.label === "PERSON"
          ? "#c8922a"
          : entity.label === "ORG"
            ? "#4a9eff"
            : entity.label === "NORP"
              ? "#e07a3a"
              : "#c8922a";

      const html = `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;width:${size + 8}px;height:${size + 8}px;">
        <div style="position:absolute;width:${size + 8}px;height:${size + 8}px;border-radius:50%;background:${color};opacity:0.15;animation:mapPulse 2s ease-out infinite;"></div>
        <div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};opacity:0.85;box-shadow:0 0 ${size}px ${color};border:1px solid rgba(255,255,255,0.3);display:flex;align-items:center;justify-content:center;">
          <span style="font-family:'Share Tech Mono',monospace;font-size:${Math.max(6, size / 3)}px;color:#000;font-weight:700;">${entity.connections}</span>
        </div>
      </div>`;

      const icon = L.divIcon({
        html,
        className: "",
        iconSize: [size + 8, size + 8],
        iconAnchor: [(size + 8) / 2, (size + 8) / 2],
      });

      L.marker(coords, { icon })
        .bindPopup(
          `<div style="font-family:'Share Tech Mono',monospace;font-size:11px;color:#d4cfc8;background:#0f1214;border:1px solid #2a3038;padding:8px 12px;border-radius:3px;min-width:160px;">
          <div style="color:#c8922a;font-weight:700;margin-bottom:4px;">${entity.name}</div>
          <div style="color:#6a6865;">${entity.label} · ${entity.connections} connections</div>
        </div>`,
          { className: "goe-popup", closeButton: false },
        )
        .addTo(group);
    });
  }, [intelEntities]);
  return (
    <div style={s.root}>
      <style>{`
        @keyframes mapPulse { 0%{transform:scale(1);opacity:.4} 100%{transform:scale(3.5);opacity:0} }
        .leaflet-container { background:#080c10 !important; }
        .goe-popup .leaflet-popup-content-wrapper { background:transparent!important;border:none!important;box-shadow:none!important;padding:0!important; }
        .goe-popup .leaflet-popup-tip-container { display:none!important; }
        .goe-popup .leaflet-popup-content { margin:0!important; }
        #layer-search::placeholder { color:#3a3835; }
      `}</style>

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
            id="layer-search"
            style={s.search}
            placeholder="Search layers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={s.list}>
          {filtered.map((l) => (
            <div key={l.id} style={s.row} onClick={() => toggle(l.id)}>
              <div
                style={{
                  ...s.cb,
                  background: states[l.id] ? "#1a3a5c" : "transparent",
                  borderColor: states[l.id] ? "#2a6aac" : "#2a3038",
                }}
              >
                {states[l.id] && (
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path
                      d="M1 3.5L3.5 6L8 1"
                      stroke="#4ab8e8"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span style={{ ...s.lIcon, color: l.color }}>{l.icon}</span>
              <span style={s.lLabel}>{l.label}</span>
            </div>
          ))}
        </div>

        <div style={s.pFoot}>
          <span style={s.credit}>
            © <span style={{ color: "#4ab8e8" }}>Elie Habib</span> · Someone™
          </span>
        </div>
      </div>

      {/* ── MAP ── */}
      <div ref={mapRef} style={s.map} />

      {/* ── ZOOM ── */}
      <div style={s.zoom}>
        <button style={s.zBtn} onClick={() => mapObj.current?.zoomIn()}>
          +
        </button>
        <button style={s.zBtn} onClick={() => mapObj.current?.zoomOut()}>
          −
        </button>
        <button
          style={{ ...s.zBtn, marginTop: 4 }}
          onClick={() => mapObj.current?.setView([20, 20], 2)}
        >
          ⌂
        </button>
      </div>

      <button style={s.legend}>LEGEND</button>
      <div style={s.webgl}>WEBGL</div>

      <Group orientation="horizontal" style={{ width: "100%", height: "100%" }}>
        
        {/* ── LAYERS PANEL ── */}
        <Panel defaultSize={25} minSize={15}>
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
                id="layer-search"
                style={s.search}
                placeholder="Search layers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div style={s.list}>
              {filtered.map((l) => (
                <div key={l.id} style={s.row} onClick={() => toggle(l.id)}>
                  <div style={{ ...s.cb, background: states[l.id] ? "#1a3a5c" : "transparent", borderColor: states[l.id] ? "#2a6aac" : "#2a3038" }}>
                    {states[l.id] && (
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3.5L3.5 6L8 1" stroke="#4ab8e8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span style={{ ...s.lIcon, color: l.color }}>{l.icon}</span>
                  <span style={s.lLabel}>{l.label}</span>
                </div>
              ))}
            </div>

            <div style={s.pFoot}>
              <span style={s.credit}>© <span style={{ color: "#4ab8e8" }}>Elie Habib</span> · Someone™</span>
            </div>
          </div>
        </Panel>

        {/* ── RESIZE HANDLE ── */}
        <Separator /> 

        {/* ── MAP PANEL ── */}
        <Panel defaultSize={75}>
          <div ref={mapRef} style={s.map} />
        </Panel>

      </Group>
    </div>
  );
}

const s = {
  root: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    background: "#080c10",
    border: "1px solid #1a1e22",
    borderRadius: "8px",
    display: "flex",
  },
  panel: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "210px",
    height: "100%",
    background: "rgba(10,12,14,0.93)",
    borderRight: "1px solid #1e2428",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    backdropFilter: "blur(6px)",
  },
  pHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 12px",
    borderBottom: "1px solid #1e2428",
  },
  pTitle: {
    fontFamily: "'Share Tech Mono',monospace",
    fontSize: "12px",
    color: "#8a8880",
    letterSpacing: "2px",
  },
  pIcons: { display: "flex", gap: "5px" },
  iBtn: {
    width: "22px",
    height: "22px",
    background: "#1a1e22",
    border: "1px solid #252b30",
    borderRadius: "3px",
    color: "#6a6865",
    fontSize: "10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Share Tech Mono',monospace",
    userSelect: "none",
  },
  searchBox: { padding: "8px 10px", borderBottom: "1px solid #1e2428" },
  search: {
    width: "100%",
    background: "#0f1214",
    border: "1px solid #252b30",
    borderRadius: "3px",
    color: "#8a8880",
    fontFamily: "'Share Tech Mono',monospace",
    fontSize: "11px",
    padding: "5px 8px",
    outline: "none",
    letterSpacing: "0.5px",
  },
  list: { flex: 1, overflowY: "auto", padding: "4px 0" },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "7px 12px",
    cursor: "pointer",
    userSelect: "none",
  },
  cb: {
    width: "14px",
    height: "14px",
    border: "1px solid #2a3038",
    borderRadius: "2px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all .15s",
  },
  lIcon: {
    fontSize: "12px",
    width: "16px",
    textAlign: "center",
    flexShrink: 0,
  },
  lLabel: {
    fontFamily: "'Share Tech Mono',monospace",
    fontSize: "10px",
    color: "#8a8880",
    letterSpacing: "0.8px",
    whiteSpace: "nowrap",
  },
  pFoot: { padding: "8px 12px", borderTop: "1px solid #1e2428" },
  credit: {
    fontFamily: "'Share Tech Mono',monospace",
    fontSize: "10px",
    color: "#3a3835",
  },
  map: { flex: 1, width: "100%", height: "100%", zIndex: 1 },
  zoom: {
    position: "absolute",
    top: "10px",
    right: "10px",
    zIndex: 1001,
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  zBtn: {
    width: "28px",
    height: "28px",
    background: "rgba(10,12,14,0.9)",
    border: "1px solid #2a3038",
    borderRadius: "3px",
    color: "#8a8880",
    fontSize: "14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "monospace",
  },
  legend: {
    position: "absolute",
    bottom: "12px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 1001,
    background: "rgba(10,12,14,0.9)",
    border: "1px solid #2a3038",
    borderRadius: "3px",
    color: "#8a8880",
    fontFamily: "'Share Tech Mono',monospace",
    fontSize: "11px",
    padding: "6px 18px",
    letterSpacing: "1.5px",
    cursor: "pointer",
  },
  webgl: {
    position: "absolute",
    bottom: "8px",
    right: "8px",
    zIndex: 1001,
    background: "rgba(0,200,100,0.1)",
    border: "1px solid rgba(61,220,132,0.3)",
    color: "#3ddc84",
    fontFamily: "'Share Tech Mono',monospace",
    fontSize: "10px",
    padding: "3px 7px",
    borderRadius: "2px",
    letterSpacing: "1px",
  },
};