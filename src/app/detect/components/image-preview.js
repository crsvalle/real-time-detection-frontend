"use client";

// Shows the raw image before any detections have been run.
// Once detections exist, DetectionCanvas takes over.
export default function ImagePreview({ imgUrl, detections }) {
  if (!imgUrl || detections.length > 0) return null;

  return (
    <>
      <style>{CSS}</style>
      <div className="ip-wrap">
        <img src={imgUrl} alt="Preview" className="ip-img" draggable={false} />
        <div className="ip-badge">Preview — press Detect to scan</div>
      </div>
    </>
  );
}

const CSS = `
  .ip-wrap {
    position: relative;
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.07);
    background: #000;
  }

  .ip-img {
    display: block;
    width: 100%;
    height: auto;
    user-select: none;
  }

  .ip-badge {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(12,12,14,0.8);
    backdrop-filter: blur(6px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 0.3rem 0.85rem;
    font-family: 'Geist Mono', monospace;
    font-size: 0.62rem;
    color: rgba(232,232,236,0.45);
    letter-spacing: 0.06em;
    white-space: nowrap;
  }
`;