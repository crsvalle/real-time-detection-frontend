"use client";

import { ZoomIn } from "lucide-react";

const CONF_COLOR = (c) => c >= 0.85 ? "#4fffb0" : c >= 0.6 ? "#ffd166" : "#ff6b6b";

export default function CroppedResult({ croppedImage, selectedDetection }) {
  return (
    <>
      <style>{CSS}</style>
      <div className="cr-panel">
        <div className="cr-header">
          <span className="cr-title">Selected Vehicle</span>
          {selectedDetection && (
            <span className="cr-sub">
              {selectedDetection.class}
            </span>
          )}
        </div>

        {!croppedImage ? (
          <div className="cr-empty">
            <ZoomIn size={22} className="cr-empty-icon" />
            <span>Click any detected vehicle to inspect it.</span>
          </div>
        ) : (
          <div className="cr-body">
            <img src={croppedImage} alt="Cropped vehicle" className="cr-img" />
            {selectedDetection && (
              <div className="cr-meta">
                <span className="cr-class">{selectedDetection.class}</span>
                <span
                  className="cr-conf"
                  style={{ color: CONF_COLOR(selectedDetection.confidence) }}
                >
                  {(selectedDetection.confidence * 100).toFixed(1)}% confidence
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=Geist+Mono:wght@400;500&display=swap');

  .cr-panel {
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    background: #111114;
    overflow: hidden;
    font-family: 'Syne', sans-serif;
  }

  .cr-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }

  .cr-title {
    font-family: 'Geist Mono', monospace;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(232,232,236,0.38);
  }

  .cr-sub {
    font-size: 0.72rem;
    color: rgba(232,232,236,0.38);
    text-transform: capitalize;
  }

  .cr-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
    padding: 2.5rem 1rem;
    font-family: 'Geist Mono', monospace;
    font-size: 0.72rem;
    color: rgba(232,232,236,0.28);
    text-align: center;
    letter-spacing: 0.03em;
  }

  .cr-empty-icon {
    color: rgba(255,255,255,0.12);
  }

  .cr-body {
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .cr-img {
    width: 100%;
    border-radius: 9px;
    border: 1px solid rgba(255,255,255,0.07);
    display: block;
  }

  .cr-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.1rem;
  }

  .cr-class {
    font-size: 0.82rem;
    font-weight: 700;
    text-transform: capitalize;
    color: #e8e8ec;
  }

  .cr-conf {
    font-family: 'Geist Mono', monospace;
    font-size: 0.65rem;
    font-weight: 600;
  }
`;