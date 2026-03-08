"use client";

import { useState, useRef, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_BACKEND_API;

export default function ImageUpload() {
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [detections, setDetections] = useState([]);
    const [croppedImage, setCroppedImage] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const canvasRef = useRef(null);

    // NEW: max canvas width instead of fixed height
    const maxCanvasWidth = 600;

    // Handle file selection
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

    // Upload image to backend (detect ALL vehicles)
    const handleUpload = async (e) => {
        e.preventDefault();

        if (!image) {
            setMessage("Please select an image first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", image);

        setLoading(true);
        setMessage("");

        try {
            const response = await fetch(`${API}/detect_car`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();

                if (data.detections?.length > 0) {
                    setDetections(data.detections);
                    setMessage("Click a vehicle to analyze it.");
                } else {
                    setDetections([]);
                    setMessage("No vehicles detected.");
                }
            } else {
                setMessage(`Error: ${response.statusText}`);
            }
        } catch (error) {
            setMessage(`Upload error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Send selected vehicle to backend
    const sendSelectedCar = async (box) => {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("box", JSON.stringify(box));

        try {
            const response = await fetch(`${API}/analyze_selected_car`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (data.cropped_image) {
                setCroppedImage(`data:image/jpeg;base64,${data.cropped_image}`);
            }
        } catch (error) {
            setMessage("Error analyzing selected vehicle.");
        }
    };

    // Handle clicking on canvas
    const handleCanvasClick = (event) => {
        if (!detections.length) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        const img = new Image();
        img.src = previewImage;

        img.onload = () => {
            const scale = Math.min(maxCanvasWidth / img.width, 1);
            const canvasWidth = img.width * scale;
            const canvasHeight = img.height * scale;

            const selected = detections.find(({ box }) => {
                const scaledXMin = box.x_min * scale;
                const scaledYMin = box.y_min * scale;
                const scaledXMax = box.x_max * scale;
                const scaledYMax = box.y_max * scale;

                return (
                    clickX >= scaledXMin &&
                    clickX <= scaledXMax &&
                    clickY >= scaledYMin &&
                    clickY <= scaledYMax
                );
            });

            if (selected) {
                setMessage(`Selected: ${selected.class}`);
                sendSelectedCar(selected.box);
            }
        };
    };

    // Draw image + ALL bounding boxes
    useEffect(() => {
        if (!previewImage || detections.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = previewImage;

        img.onload = () => {
            const scale = Math.min(maxCanvasWidth / img.width, 1);

            canvas.width = img.width * scale;
            canvas.height = img.height * scale;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            detections.forEach(({ class: label, box }) => {
                const scaledXMin = box.x_min * scale;
                const scaledYMin = box.y_min * scale;
                const scaledXMax = box.x_max * scale;
                const scaledYMax = box.y_max * scale;

                ctx.strokeStyle = "lime";
                ctx.lineWidth = 3;
                ctx.strokeRect(
                    scaledXMin,
                    scaledYMin,
                    scaledXMax - scaledXMin,
                    scaledYMax - scaledYMin
                );

                ctx.fillStyle = "lime";
                ctx.font = "16px Arial";
                ctx.fillText(label, scaledXMin + 4, scaledYMin - 6);
            });
        };
    }, [previewImage, detections]);

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1>Car Detection</h1>

            <form onSubmit={handleUpload}>
                <input type="file" accept="image/*" onChange={handleImageChange} required />
                <button type="submit" disabled={loading}>
                    {loading ? "Detect Vehicles..." : "Detect Vehicles"}
                </button>
            </form>

            {/* Preview before detection */}
            {previewImage && detections.length === 0 && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Preview:</h3>
                    <img
                        src={previewImage}
                        alt="Preview"
                        style={{ maxWidth: "600px", border: "1px solid black" }}
                    />
                </div>
            )}

            {/* Canvas with clickable detections */}
            {detections.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Click a Vehicle:</h3>
                    <canvas
                        ref={canvasRef}
                        onClick={handleCanvasClick}
                        style={{
                            border: "1px solid black",
                            cursor: "pointer"
                        }}
                    />
                </div>
            )}

            {/* Cropped Selected Vehicle */}
            {croppedImage && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Selected Vehicle:</h3>
                    <img
                        src={croppedImage}
                        alt="Cropped Vehicle"
                        style={{ maxWidth: "600px", border: "1px solid black" }}
                    />
                </div>
            )}

            {message && <p style={{ marginTop: "10px" }}>{message}</p>}
        </div>
    );
}
