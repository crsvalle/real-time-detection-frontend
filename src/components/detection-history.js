"use client";

import { useEffect, useState } from "react";

export default function DetectionHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("detectionHistory")) || [];
    setHistory(storedHistory);
  }, []);

  if (history.length === 0) {
    return (
      <div style={styles.panel}>
        <h2>Detection History</h2>
        <p>No scans yet.</p>
      </div>
    );
  }

  return (
    <div style={styles.panel}>
      <h2>Detection History</h2>

      {history.map((item) => (
        <div key={item.id} style={styles.card}>
          <img src={item.image} style={styles.image} />

          <div>
            <p><strong>{item.timestamp}</strong></p>

            {item.detections.map((d, i) => (
              <p key={i}>
                {d.label} — {(d.confidence * 100).toFixed(1)}%
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  panel: {
    marginTop: "40px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  card: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
  },
  image: {
    width: "120px",
    borderRadius: "6px",
  },
};
