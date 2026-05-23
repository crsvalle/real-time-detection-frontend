"use client";

import { useState } from "react";

const CONF_COLOR = (c) => c >= 0.85 ? "#4fffb0" : c >= 0.6 ? "#ffd166" : "#ff6b6b";
const CLASS_ICON = { car: "🚗", truck: "🚚", bus: "🚌", motorcycle: "🏍️" };

export default function DetectionHistory({ history, setHistory }) {
  const [expandedId, setExpandedId] = useState(null);

  const clearHistory = () => {
    try { localStorage.removeItem("detectionHistory"); } catch {}
    setHistory([]);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="dh-wrap">
        <div className="dh-header">
          <span className="dh-title">Scan History</span>
          {history.length > 0 && (
            <button className="dh-clear-btn" onClick={clearHistory}>Clear</button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="dh-empty">No previous scans.</div>
        ) : (
          <ul className="dh-list">
            {history.map((item) => {
              const isOpen = expandedId === item.id;
              return (
                <li
                  key={item.id}
                  className={`dh-item ${isOpen ? "dh-item--open" : ""}`}
                >
                  <button
                    className="dh-summary"
                    onClick={() => setExpandedId(isOpen ? null : item.id)}
                  >
                    <img src={item.image} alt="scan" className="dh-thumb" />
                    <div className="dh-meta">
                      <span className="dh-timestamp">{item.timestamp}</span>
                      <span className="dh-vehicle-count">
                        {item.detections.length} vehicle{item.detections.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <span className={`dh-chevron ${isOpen ? "dh-chevron--open" : ""}`}>▼</span>
                  </button>

                  {isOpen && (
                    <ul className="dh-detections">
                      {item.detections.map((d, i) => {
                        const conf = d.confidence ?? 0;
                        const color = CONF_COLOR(conf);
                        return (
                          <li key={i} className="dh-detection-row">
                            <span className="dh-d-icon">{CLASS_ICON[d.class] ?? "🚘"}</span>
                            <span className="dh-d-label">{d.class}</span>
                            <div className="dh-d-bar-wrap">
                              <div
                                className="dh-d-bar"
                                style={{ width: `${conf * 100}%`, background: color }}
                              />
                            </div>
                            <span className="dh-d-conf" style={{ color }}>
                              {(conf * 100).toFixed(1)}%
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
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
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700&family=Geist+Mono:wght@400;500&display=swap');

  .dh-wrap {
    font-family: 'Syne', sans-serif;
    margin-top: 1.5rem;
  }

  .dh-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 0.75rem;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }

  .dh-title {
    font-family: 'Geist Mono', monospace;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(232,232,236,0.38);
  }

  .dh-clear-btn {
    font-family: 'Geist Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #ff6b6b;
    background: transparent;
    border: 1px solid rgba(255,107,107,0.28);
    padding: 0.28rem 0.7rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
  }
  .dh-clear-btn:hover {
    background: rgba(255,107,107,0.08);
    border-color: #ff6b6b;
  }

  .dh-empty {
    text-align: center;
    padding: 2rem 1rem;
    font-family: 'Geist Mono', monospace;
    font-size: 0.75rem;
    color: rgba(232,232,236,0.2);
    border: 1px dashed rgba(255,255,255,0.06);
    border-radius: 10px;
    letter-spacing: 0.04em;
  }

  .dh-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .dh-item {
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px;
    background: #111114;
    overflow: hidden;
    transition: border-color 0.15s;
  }
  .dh-item--open { border-color: rgba(232,255,71,0.2); }

  .dh-summary {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 0.7rem 0.9rem;
    width: 100%;
    background: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
    transition: background 0.15s;
  }
  .dh-summary:hover { background: rgba(255,255,255,0.03); }

  .dh-thumb {
    width: 46px;
    height: 34px;
    object-fit: cover;
    border-radius: 5px;
    background: rgba(255,255,255,0.05);
    flex-shrink: 0;
  }

  .dh-meta { flex: 1; min-width: 0; }

  .dh-timestamp {
    display: block;
    font-family: 'Geist Mono', monospace;
    font-size: 0.58rem;
    color: rgba(232,232,236,0.28);
    letter-spacing: 0.05em;
    margin-bottom: 0.2rem;
  }

  .dh-vehicle-count {
    font-size: 0.8rem;
    font-weight: 600;
    color: rgba(232,232,236,0.65);
  }

  .dh-chevron {
    font-size: 0.58rem;
    color: rgba(255,255,255,0.2);
    transition: transform 0.2s, color 0.2s;
    flex-shrink: 0;
  }
  .dh-chevron--open {
    transform: rotate(180deg);
    color: rgba(232,255,71,0.55);
  }

  .dh-detections {
    list-style: none;
    margin: 0;
    padding: 0.5rem 0.9rem 0.7rem;
    border-top: 1px solid rgba(255,255,255,0.05);
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .dh-detection-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.76rem;
  }

  .dh-d-icon { font-size: 0.85rem; flex-shrink: 0; }

  .dh-d-label {
    flex: 1;
    color: rgba(232,232,236,0.55);
    text-transform: capitalize;
    font-size: 0.78rem;
  }

  .dh-d-bar-wrap {
    width: 50px; height: 3px;
    background: rgba(255,255,255,0.07);
    border-radius: 2px;
    overflow: hidden;
    flex-shrink: 0;
  }
  .dh-d-bar { height: 100%; border-radius: 2px; }

  .dh-d-conf {
    font-family: 'Geist Mono', monospace;
    font-size: 0.62rem;
    font-weight: 600;
    min-width: 38px;
    text-align: right;
  }
`;