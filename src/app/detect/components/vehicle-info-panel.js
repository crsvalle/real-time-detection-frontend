"use client";

const CONFIDENCE_COLOR = {
  high:   { bg: "#e1f5ee", text: "#085041", dot: "#1D9E75" },
  medium: { bg: "#faeeda", text: "#633806", dot: "#BA7517" },
  low:    { bg: "#faece7", text: "#712B13", dot: "#D85A30" },
};

export default function VehicleInfoPanel({ result, loading, error, onClose }) {
  if (!loading && !result && !error) return null;

  return (
    <>
      <style>{CSS}</style>
      <div className="vip-card">
        <button className="vip-close" onClick={onClose} aria-label="Dismiss">✕</button>

        {loading && (
          <div className="vip-loading">
            <span className="vip-spinner" aria-hidden="true" />
            Identifying vehicle…
          </div>
        )}

        {error && !loading && (
          <div className="vip-error">
            <span className="vip-error-icon" aria-hidden="true">⚠</span>
            {error}
          </div>
        )}

        {result && !loading && (
          <div className="vip-result">
            <div className="vip-primary">
              <span className="vip-brand">{result.brand}</span>
              <span className="vip-model">{result.model}</span>
            </div>

            <div className="vip-meta">
              {result.year && result.year !== "Unknown" && (
                <span className="vip-pill vip-pill--year">{result.year}</span>
              )}
              {result.confidence && (
                <span
                  className="vip-pill vip-pill--confidence"
                  style={{
                    background: CONFIDENCE_COLOR[result.confidence]?.bg ?? "#f1efe8",
                    color:      CONFIDENCE_COLOR[result.confidence]?.text ?? "#444441",
                  }}
                >
                  <span
                    className="vip-dot"
                    style={{ background: CONFIDENCE_COLOR[result.confidence]?.dot ?? "#888780" }}
                    aria-hidden="true"
                  />
                  {result.confidence} confidence
                </span>
              )}
            </div>

            {result.notes && (
              <p className="vip-notes">{result.notes}</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;700&display=swap');

  .vip-card {
    position: relative;
    margin-top: 12px;
    background: #111114;
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px;
    padding: 14px 16px;
    font-family: 'Geist Mono', monospace;
    color: #e8e8ec;
    min-height: 56px;
  }

  .vip-close {
    position: absolute;
    top: 10px;
    right: 12px;
    background: none;
    border: none;
    color: rgba(255,255,255,0.35);
    cursor: pointer;
    font-size: 0.7rem;
    line-height: 1;
    padding: 2px 4px;
    border-radius: 4px;
    transition: color 0.15s;
  }
  .vip-close:hover { color: #e8e8ec; }

  .vip-loading {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.75rem;
    color: rgba(255,255,255,0.5);
    letter-spacing: 0.04em;
  }

  .vip-spinner {
    display: inline-block;
    width: 13px;
    height: 13px;
    border: 1.5px solid rgba(255,255,255,0.15);
    border-top-color: #e8ff47;
    border-radius: 50%;
    animation: vip-spin 0.7s linear infinite;
    flex-shrink: 0;
  }
  @keyframes vip-spin { to { transform: rotate(360deg); } }

  .vip-error {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.72rem;
    color: #f09595;
    letter-spacing: 0.03em;
  }
  .vip-error-icon { font-size: 0.9rem; }

  .vip-result { padding-right: 20px; }

  .vip-primary {
    display: flex;
    align-items: baseline;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 8px;
  }

  .vip-brand {
    font-size: 0.95rem;
    font-weight: 700;
    color: #e8ff47;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .vip-model {
    font-size: 0.95rem;
    font-weight: 500;
    color: #e8e8ec;
    letter-spacing: 0.02em;
  }

  .vip-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 8px;
  }

  .vip-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 0.62rem;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 20px;
    letter-spacing: 0.04em;
    line-height: 1.6;
  }

  .vip-pill--year {
    background: rgba(255,255,255,0.07);
    color: rgba(255,255,255,0.55);
  }

  .vip-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .vip-notes {
    margin: 0;
    font-size: 0.65rem;
    color: rgba(255,255,255,0.4);
    letter-spacing: 0.03em;
    line-height: 1.5;
  }
`;