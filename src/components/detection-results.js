export default function DetectionResults({ detections }) {
  if (!detections || detections.length === 0) {
    return (
      <div className="mt-8 p-5 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-2">Detection Results</h2>
        <p className="text-gray-500">No vehicles detected yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 p-5 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-semibold mb-3">Detected Vehicles</h2>

      <ul className="space-y-2">
        {detections.map((detection, index) => (
          <li
            key={index}
            className="p-3 bg-white rounded-md border flex justify-between"
          >
            <span className="font-medium">{detection.label}</span>
            <span className="text-gray-600">
              {(detection.confidence * 100).toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
