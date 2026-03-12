export default function DetectionResults({ detections }) {
  if (!detections || detections.length === 0) {
    return (
      <div style={styles.panel}>
        <h2>Detection Results</h2>
        <p>No vehicles detected yet.</p>
      </div>
    );
  }

  return (
    <div style={styles.panel}>
      <h2>Detected Vehicles</h2>

      <ul style={styles.list}>
        {detections.map((detection, index) => (
          <li key={index} style={styles.item}>
            <strong>{detection.label}</strong> —{" "}
            {(detection.confidence * 100).toFixed(1)}%
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  panel: {
    marginTop: "30px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fafafa",
  },
  list: {
    marginTop: "10px",
    paddingLeft: "20px",
  },
  item: {
    marginBottom: "8px",
  },
};
