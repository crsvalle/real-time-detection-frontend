"use client";

import { useRef } from "react";
import { Upload, ScanSearch, X, Loader2, ImageIcon } from "lucide-react";
import { useState } from "react";

export default function UploadForm({
  handleFiles,
  handleImageChange,
  handleUpload,
  onReset,
  loading,
  analyzing,
  hasImage,
  hasDetections,
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  // ── Drop zone (shown before any image is loaded) ──
  if (!hasImage) {
    return (
      <>
        <style>{CSS}</style>
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={`uf-dropzone ${isDragging ? "uf-dropzone--active" : ""}`}
        >
          <div className="uf-drop-icon">
            <ImageIcon size={28} />
          </div>
          <h2 className="uf-drop-title">Drop a photo to scan</h2>
          <p className="uf-drop-sub">
            Detects cars, trucks, buses &amp; motorcycles via your YOLOv8 backend.
            <br />JPG, PNG, WEBP up to 8 MB.
          </p>
          <label className="uf-browse-btn">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="uf-sr-only"
              onChange={handleImageChange}
            />
            <Upload size={14} /> Choose image
          </label>
        </div>
      </>
    );
  }

  // ── Action bar (shown after image is loaded) ──
  return (
    <>
      <style>{CSS}</style>
      <div className="uf-actions">
        <button
          className="uf-btn uf-btn--primary"
          onClick={handleUpload}
          disabled={loading || analyzing}
        >
          {loading ? (
            <><Loader2 size={14} className="uf-spin" /> Detecting…</>
          ) : hasDetections ? (
            <><ScanSearch size={14} /> Re-scan</>
          ) : (
            <><ScanSearch size={14} /> Detect vehicles</>
          )}
        </button>

        <label className="uf-btn uf-btn--ghost">
          <input
            type="file"
            accept="image/*"
            className="uf-sr-only"
            onChange={handleImageChange}
          />
          <Upload size={14} /> Change image
        </label>

        <button
          className="uf-btn uf-btn--danger"
          onClick={onReset}
          disabled={loading || analyzing}
        >
          <X size={14} /> Clear
        </button>
      </div>
    </>
  );
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Geist+Mono:wght@400;500&display=swap');

  .uf-dropzone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1.5px dashed rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 5rem 2rem;
    text-align: center;
    background: #111114;
    transition: border-color 0.2s, background 0.2s;
    cursor: pointer;
    font-family: 'Syne', sans-serif;
  }
  .uf-dropzone--active {
    border-color: #e8ff47;
    background: rgba(232,255,71,0.05);
  }

  .uf-drop-icon {
    width: 58px; height: 58px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: rgba(232,255,71,0.12);
    color: #e8ff47;
    border: 1px solid rgba(232,255,71,0.2);
    margin-bottom: 1.25rem;
  }

  .uf-drop-title {
    font-size: 1.4rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: #e8e8ec;
    margin: 0 0 0.4rem;
  }

  .uf-drop-sub {
    font-size: 0.82rem;
    color: rgba(232,232,236,0.38);
    line-height: 1.6;
    max-width: 360px;
    margin: 0 0 1.75rem;
  }

  .uf-browse-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    background: #e8ff47;
    color: #0c0c0e;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.82rem;
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    cursor: pointer;
    transition: opacity 0.15s;
    letter-spacing: 0.02em;
    border: none;
  }
  .uf-browse-btn:hover { opacity: 0.88; }

  .uf-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }

  .uf-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: opacity 0.15s, background 0.15s, border-color 0.15s;
    letter-spacing: 0.01em;
  }
  .uf-btn:disabled { opacity: 0.45; cursor: not-allowed; }

  .uf-btn--primary { background: #e8ff47; color: #0c0c0e; }
  .uf-btn--primary:hover:not(:disabled) { opacity: 0.88; }

  .uf-btn--ghost {
    background: #111114;
    color: #e8e8ec;
    border-color: rgba(255,255,255,0.07);
  }
  .uf-btn--ghost:hover:not(:disabled) { border-color: rgba(255,255,255,0.14); }

  .uf-btn--danger {
    background: transparent;
    color: #ff6b6b;
    border-color: rgba(255,107,107,0.25);
  }
  .uf-btn--danger:hover:not(:disabled) { background: rgba(255,107,107,0.08); }

  .uf-sr-only {
    position: absolute; width: 1px; height: 1px;
    overflow: hidden; clip: rect(0,0,0,0);
  }

  .uf-spin { animation: uf-spin 0.8s linear infinite; }
  @keyframes uf-spin { to { transform: rotate(360deg); } }
`;