"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_BACKEND_API;

export default function useDetection() {
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [detections, setDetections] = useState([]);
    const [croppedImage, setCroppedImage] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [history, setHistory] = useState(
        typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("detectionHistory")) || []
            : []
    );

    const maxCanvasWidth = 600;

    const saveToHistory = (imageUrl, detections) => {
        const existing =
            JSON.parse(localStorage.getItem("detectionHistory")) || [];

        const newItem = {
            id: Date.now(),
            image: imageUrl,
            detections,
            timestamp: new Date().toLocaleString(),
        };

        const updated = [newItem, ...existing].slice(0, 10);

        localStorage.setItem("detectionHistory", JSON.stringify(updated));
        setHistory(updated);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        setImage(file);
        setDetections([]);
        setCroppedImage(null);
        setMessage("");

        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!image) {
            setMessage("Please select an image first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", image);

        setLoading(true);
        setMessage("Detecting vehicles...");

        try {
            const res = await fetch(`${API}/detect_car`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.detections?.length > 0) {
                setDetections(data.detections);
                saveToHistory(previewImage, data.detections);
                setMessage("Click a vehicle to analyze it.");
            } else {
                setDetections([]);
                setMessage("No vehicles detected.");
            }
        } catch (err) {
            setMessage("Upload error.");
        } finally {
            setLoading(false);
        }
    };

    const sendSelectedCar = async (box) => {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("box", JSON.stringify(box));

        setAnalyzing(true);
        setMessage("Analyzing selected vehicle...");

        try {
            const res = await fetch(`${API}/analyze_selected_car`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.cropped_image) {
                setCroppedImage(`data:image/jpeg;base64,${data.cropped_image}`);
                setMessage("Vehicle analyzed.");
            }
        } catch {
            setMessage("Error analyzing selected vehicle.");
        } finally {
            setAnalyzing(false);
        }
    };

    const handleCanvasClick = (event) => {
        if (!detections.length || analyzing) return;

        const canvas = event.target;
        const rect = canvas.getBoundingClientRect();

        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        const img = new Image();
        img.src = previewImage;

        img.onload = () => {
            const scale = Math.min(maxCanvasWidth / img.width, 1);

            const selected = detections.find(({ box }) => {
                const x1 = box.x_min * scale;
                const y1 = box.y_min * scale;
                const x2 = box.x_max * scale;
                const y2 = box.y_max * scale;

                return clickX >= x1 && clickX <= x2 && clickY >= y1 && clickY <= y2;
            });

            if (selected) {
                setMessage(`Selected: ${selected.class}`);
                sendSelectedCar(selected.box);
            }
        };
    };

    return {
        image,
        previewImage,
        detections,
        croppedImage,
        message,
        loading,
        analyzing,
        history,

        handleImageChange,
        handleUpload,
        handleCanvasClick,
        setHistory,
    };
}
