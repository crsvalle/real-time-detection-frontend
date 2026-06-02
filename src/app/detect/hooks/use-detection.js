"use client";

import { useState, useCallback } from "react";

const API = process.env.NEXT_PUBLIC_BACKEND_API;

export default function useDetection() {
  const [file, setFile] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [detections, setDetections] = useState([]);
  const [croppedImage, setCroppedImage] = useState(null);
  const [vehicleInfo, setVehicleInfo] = useState(null);   
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [history, setHistory] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("detectionHistory")) || [];
    } catch {
      return [];
    }
  });

  // ── Save to history 

  const saveToHistory = useCallback((imageUrl, dets) => {
    try {
      const existing = JSON.parse(localStorage.getItem("detectionHistory")) || [];
      const newItem = {
        id: Date.now(),
        image: imageUrl,
        detections: dets,
        timestamp: new Date().toLocaleString(),
      };
      const updated = [newItem, ...existing].slice(0, 10);
      localStorage.setItem("detectionHistory", JSON.stringify(updated));
      setHistory(updated);
    } catch {}
  }, []);

  // ── File handling ────────────────────────────────────────────────────────

  const handleFiles = useCallback((files) => {
    const f = files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      return;
    }
    if (f.size > 8 * 1024 * 1024) {
      setMessage("Image must be under 8 MB.");
      return;
    }
    setMessage("");
    setDetections([]);
    setCroppedImage(null);
    setVehicleInfo(null);
    setSelectedId(null);
    setFile(f);
    setImgUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(f);
    });
  }, []);

  const handleImageChange = useCallback((e) => {
    handleFiles(e.target.files);
  }, [handleFiles]);



  const handleUpload = useCallback(async (e) => {
    e?.preventDefault();
    if (!file) { setMessage("Please select an image first."); return; }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setMessage("Detecting vehicles…");
    setDetections([]);
    setCroppedImage(null);
    setVehicleInfo(null);
    setSelectedId(null);

    try {
      const res = await fetch(`${API}/detect_car`, { method: "POST", body: formData });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();

      if (data.detections?.length > 0) {
        const dets = data.detections.map((d, i) => ({ ...d, id: i }));
        setDetections(dets);
        saveToHistory(imgUrl, dets);
        setMessage("Click a vehicle to identify it.");
      } else {
        setDetections([]);
        setMessage("No vehicles detected.");
      }
    } catch (err) {
      setMessage(`Detection error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [file, imgUrl, saveToHistory]);

  // ── Analyze selected vehicle → get brand/model/year 

  const sendSelectedCar = useCallback(async (detection) => {
    if (!file || analyzing) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("box", JSON.stringify(detection.box));

    setSelectedId(detection.id);
    setAnalyzing(true);
    setCroppedImage(null);
    setVehicleInfo(null);
    setMessage(`Identifying ${detection.class}…`);

    try {
      const res = await fetch(`${API}/analyze_selected_car`, { method: "POST", body: formData });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      // Store the vehicle identification result
      setVehicleInfo({
        brand:        data.brand,
        model:        data.model,
        year:         data.year,
        confidence:   data.confidence,
        notes:        data.notes,
        score:        data.score,
        alternatives: data.alternatives ?? [],
      });

      setMessage(`${data.brand} ${data.model} ${data.year}`);
    } catch (err) {
      setMessage(`Analysis error: ${err.message}`);
      setVehicleInfo(null);
    } finally {
      setAnalyzing(false);
    }
  }, [file, analyzing]);


  const reset = useCallback(() => {
    if (imgUrl) URL.revokeObjectURL(imgUrl);
    setFile(null);
    setImgUrl(null);
    setDetections([]);
    setCroppedImage(null);
    setVehicleInfo(null);
    setSelectedId(null);
    setMessage("");
  }, [imgUrl]);

  return {
    file,
    imgUrl,
    detections,
    croppedImage,
    vehicleInfo,       
    selectedId,
    message,
    loading,
    analyzing,
    history,
    setHistory,
    handleFiles,
    handleImageChange,
    handleUpload,
    sendSelectedCar,
    reset,
  };
}