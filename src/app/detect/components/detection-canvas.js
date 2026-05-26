"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

const CLASS_ICON = { car: "🚗" };

export default function DetectionCanvas({
  imgUrl,
  detections,
  selectedId,
  analyzing,
  onSelectVehicle,
}) {
  const imgRef = useRef(null);
  const [imgRect, setImgRect] = useState({ w: 0, h: 0, natW: 1, natH: 1 });

  // ✅ ALL hooks declared before any conditional return

  const onImgLoad = () => {
    const el = imgRef.current;
    if (!el) return;
    setImgRect({ w: el.clientWidth, h: el.clientHeight, natW: el.naturalWidth, natH: el.naturalHeight });
  };

  useEffect(() => {
    const onResize = () => {
      const el = imgRef.current;
      if (!el) return;
      setImgRect({ w: el.clientWidth, h: el.clientHeight, natW: el.naturalWidth, natH: el.naturalHeight });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scale = useMemo(() => ({
    x: imgRect.natW ? imgRect.w / imgRect.natW : 1,
    y: imgRect.natH ? imgRect.h / imgRect.natH : 1,
  }), [imgRect]);

  // ✅ Early return AFTER all hooks
  if (!imgUrl || detections.length === 0) return null;

  return (
    <>
      <style>{CSS}</style>
      <div className="dc-wrap">
        <img
          ref={imgRef}
          src={imgUrl}
          alt="Detected"
          onLoad={onImgLoad}
          className="dc-img"
          draggable={false}
        />

        {/* CSS overlay bounding boxes */}
        {detections.map((d) => {
          const isSelected = selectedId === d.id;
          const left   = d.box.x_min * scale.x;
          const top    = d.box.y_min * scale.y;
          const width  = (d.box.x_max - d.box.x_min) * scale.x;
          const height = (d.box.y_max - d.box.y_min) * scale.y;

          return (
            <button
              key={d.id}
              onClick={() => !analyzing && onSelectVehicle(d)}
              disabled={analyzing}
              style={{ left, top, width, height }}
              className={`dc-box ${isSelected ? "dc-box--selected" : ""}`}
              aria-label={`Select ${d.class}`}
            >
              <span className={`dc-label ${isSelected ? "dc-label--selected" : ""}`}>
                {CLASS_ICON[d.class] ?? "🚘"} {d.class}
              </span>
            </button>
          );
        })}

        {/* Analyzing overlay */}
        {analyzing && (
          <div className="dc-overlay">
            <div className="dc-overlay-pill">
              <Loader2 size={14} className="dc-spin" /> Analyzing…
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;700&display=swap');

  .dc-wrap {
    position: relative;
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.07);
    background: #000;
  }
  .dc-img {
    display: block;
    width: 100%;
    height: auto;
    user-select: none;
  }
  .dc-box {
    position: absolute;
    border: 2px solid rgba(255,255,255,0.55);
    border-radius: 6px;
    background: transparent;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
    padding: 0;
  }
  .dc-box:hover:not(:disabled) {
    border-color: #e8ff47;
    background: rgba(232,255,71,0.06);
  }
  .dc-box--selected {
    border-color: #e8ff47 !important;
    background: rgba(232,255,71,0.08) !important;
    box-shadow: 0 0 0 3px rgba(232,255,71,0.18);
  }
  .dc-box:disabled { cursor: wait; }
  .dc-label {
    position: absolute;
    top: -26px;
    left: 0;
    background: rgba(0,0,0,0.78);
    color: #fff;
    font-family: 'Geist Mono', monospace;
    font-size: 0.62rem;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 4px;
    white-space: nowrap;
    letter-spacing: 0.04em;
    backdrop-filter: blur(4px);
    pointer-events: none;
  }
  .dc-label--selected {
    background: #e8ff47;
    color: #0c0c0e;
    font-weight: 700;
  }
  .dc-overlay {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    background: rgba(12,12,14,0.6);
    backdrop-filter: blur(4px);
  }
  .dc-overlay-pill {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #111114;
    border: 1px solid rgba(255,255,255,0.07);
    padding: 0.5rem 1.1rem;
    border-radius: 20px;
    font-family: 'Geist Mono', monospace;
    font-size: 0.75rem;
    color: #e8e8ec;
    letter-spacing: 0.04em;
  }
  .dc-spin { animation: dc-spin 0.8s linear infinite; }
  @keyframes dc-spin { to { transform: rotate(360deg); } }
`;