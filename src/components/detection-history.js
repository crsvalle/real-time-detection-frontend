export default function DetectionHistory({ history, setHistory }) {
  const clearHistory = () => {
    localStorage.removeItem("detectionHistory");
    setHistory([]);
  };

  if (history.length === 0) {
    return (
      <div className="mt-10 p-5 border rounded-lg">
        <h2 className="text-xl font-semibold">Detection History</h2>
        <p>No previous detections.</p>
      </div>
    );
  }

  return (
    <div className="mt-10 p-5 border rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Detection History</h2>
        <button
          onClick={clearHistory}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Clear History
        </button>
      </div>

      {history.map((item) => (
        <div key={item.id} className="flex gap-5 mb-5">
          <img src={item.image} alt="scan" className="w-32 rounded-md" />

          <div>
            <p className="text-sm text-gray-500">{item.timestamp}</p>

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
