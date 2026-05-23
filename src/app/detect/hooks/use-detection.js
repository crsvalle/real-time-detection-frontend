"use client";

import { useState, useCallback } from "react";

const API = process.env.NEXT_PUBLIC_BACKEND_API;

export default function useDetection() {
  const [file, setFile] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [detections, setDetections] = useState([]);
  const [croppedImage, setCroppedImage] = useState(null);
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

  // ── Save to history ──────────────────────────────────────────────────────

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
    } catch {

    }
  }, []);


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
    setSelectedId(null);

    try {
      const res = await fetch(`${API}/detect_car`, { method: "POST", body: formData });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();

      if (data.detections?.length > 0) {
        const dets = data.detections.map((d, i) => ({ ...d, id: i }));
        setDetections(dets);
        saveToHistory(imgUrl, dets);
        setMessage("Click a vehicle to analyze it.");
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

  const sendSelectedCar = useCallback(async (detection) => {
    if (!file || analyzing) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("box", JSON.stringify(detection.box));

    setSelectedId(detection.id);
    setAnalyzing(true);
    setCroppedImage(null);
    setMessage(`Analyzing ${detection.class}…`);

    try {
      const res = await fetch(`${API}/analyze_selected_car`, { method: "POST", body: formData });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      if (data.cropped_image) {
        setCroppedImage(`data:image/jpeg;base64,${data.cropped_image}`);
        setMessage("Vehicle analyzed.");
      }
    } catch (err) {
      setMessage(`Analysis error: ${err.message}`);
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
    setSelectedId(null);
    setMessage("");
  }, [imgUrl]);

  return {
    file,
    imgUrl,
    detections,
    croppedImage,
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