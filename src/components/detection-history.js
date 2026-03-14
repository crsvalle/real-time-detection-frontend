export default function DetectionHistory({ history, setHistory }) {

  const clearHistory = () => {
    localStorage.removeItem("detectionHistory");
    setHistory([]);
  };

  if (history.length === 0) {
    return (
      <div style={styles.panel}>
        <h2>Detection History</h2>
        <p>No previous detections.</p>
      </div>
    );
  }

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <h2>Detection History</h2>
        <button onClick={clearHistory} style={styles.clearBtn}>
          Clear History
        </button>
      </div>

      {history.map((item) => (
        <div key={item.id} style={styles.card}>
          <img src={item.image} alt="scan" style={styles.image} />

          <div>
            <p style={styles.timestamp}>{item.timestamp}</p>

            {item.detections.map((d, i) => (
              <p key={i}>
                {d.class} — {(d.confidence * 100).toFixed(1)}%
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
