"use client";

import { ScanSearch } from "lucide-react";

const CONF_COLOR = (c) => c >= 0.85 ? "#4fffb0" : c >= 0.6 ? "#ffd166" : "#ff6b6b";
const CLASS_ICON = { car: "🚗", truck: "🚚", bus: "🚌", motorcycle: "🏍️" };

export default function DetectionResults({ detections, selectedId, analyzing, onSelectVehicle }) {
  return (
    <>
      <style>{CSS}</style>
      <div className="dr-panel">
        <div className="dr-header">
          <span className="dr-title">Detections</span>
          {detections.length > 0 && (
            <span className="dr-count">{detections.length}</span>
          )}
        </div>

        {detections.length === 0 ? (
          <div className="dr-empty">
            <ScanSearch size={18} className="dr-empty-icon" />
            <span>Press <strong>Detect vehicles</strong> to scan.</span>
          </div>
        ) : (
          <ul className="dr-list">
            {detections.map((d) => {
              const isSelected = selectedId === d.id;
              const color = CONF_COLOR(d.confidence);
              return (
                <li key={d.id}>
                  <button
                    className={`dr-item ${isSelected ? "dr-item--selected" : ""}`}
                    onClick={() => !analyzing && onSelectVehicle(d)}
                    disabled={analyzing}
                    style={{ animationDelay: `${d.id * 55}ms` }}
                  >
                    <span className="dr-icon">{CLASS_ICON[d.class] ?? "🚘"}</span>
                    <span className="dr-label">{d.class}</span>
                    <div className="dr-conf-wrap">
                      <div className="dr-conf-bar">
                        <div
                          className="dr-conf-fill"
                          style={{ width: `${d.confidence * 100}%`, background: color }}
                        />
                      </div>
                      <span className="dr-conf-val" style={{ color }}>
                        {(d.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=Geist+Mono:wght@400;500&display=swap');

  .dr-panel {
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    background: #111114;
    overflow: hidden;
    font-family: 'Syne', sans-serif;
  }

  .dr-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }

  .dr-title {
    font-family: 'Geist Mono', monospace;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(232,232,236,0.38);
  }

  .dr-count {
    font-family: 'Geist Mono', monospace;
    font-size: 0.62rem;
    background: rgba(232,255,71,0.12);
    color: #e8ff47;
    border: 1px solid rgba(232,255,71,0.22);
    padding: 0.1rem 0.5rem;
    border-radius: 20px;
  }

  .dr-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.55rem;
    padding: 2rem 1rem;
    font-family: 'Geist Mono', monospace;
    font-size: 0.72rem;
    color: rgba(232,232,236,0.28);
    text-align: center;
    letter-spacing: 0.03em;
  }
  .dr-empty strong { color: rgba(232,232,236,0.55); font-family: 'Syne', sans-serif; }
  .dr-empty-icon { color: rgba(255,255,255,0.1); }

  .dr-list {
    list-style: none;
    margin: 0;
    padding: 0.4rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .dr-item {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    width: 100%;
    padding: 0.6rem 0.75rem;
    border-radius: 9px;
    border: 1px solid transparent;
    background: transparent;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    animation: dr-slide 0.3s ease both;
    text-align: left;
    font-family: 'Syne', sans-serif;
  }
  .dr-item:hover:not(:disabled) {
    background: rgba(255,255,255,0.04);
    border-color: rgba(255,255,255,0.07);
  }
  .dr-item--selected {
    background: rgba(232,255,71,0.08) !important;
    border-color: rgba(232,255,71,0.22) !important;
  }
  .dr-item:disabled { opacity: 0.5; cursor: wait; }

  @keyframes dr-slide {
    from { opacity: 0; transform: translateY(5px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .dr-icon { font-size: 1rem; flex-shrink: 0; }
  .dr-label {
    font-size: 0.82rem;
    font-weight: 600;
    color: #e8e8ec;
    text-transform: capitalize;
    flex: 1;
    min-width: 0;
  }

  .dr-conf-wrap { display: flex; align-items: center; gap: 0.4rem; flex-shrink: 0; }
  .dr-conf-bar {
    width: 42px; height: 3px;
    background: rgba(255,255,255,0.08);
    border-radius: 2px;
    overflow: hidden;
  }
  .dr-conf-fill { height: 100%; border-radius: 2px; }
  .dr-conf-val {
    font-family: 'Geist Mono', monospace;
    font-size: 0.62rem;
    font-weight: 500;
    min-width: 36px;
    text-align: right;
  }
`;