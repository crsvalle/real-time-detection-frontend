import { useState, useCallback } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";


export function useVehicleIdentifier() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const identify = useCallback(async (imageFile, detection) => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", imageFile);                        // original File object
      formData.append("box", JSON.stringify(detection.box));     // { x_min, y_min, x_max, y_max }

      const response = await fetch(`${API_BASE}/analyze_selected_car`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error ?? `Server error ${response.status}`);
      }

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      setResult(data);
    } catch (e) {
      setError(e.message ?? "Identification failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  return { identify, result, loading, error, reset };
}