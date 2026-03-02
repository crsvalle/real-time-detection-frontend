"use client";

import { useState, useRef, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_BACKEND_API;

export default function ImageUpload() {
    const [image, setImage] = useState(null);
    const [detections, setDetections] = useState([]);
    const [croppedImage, setCroppedImage] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const canvasRef = useRef(null);
    const [imgDimensions, setImgDimensions] = useState({ height: 300 });

    // Handle file selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setDetections([]);
        setCroppedImage(null);
        setMessage("");
    };

    // Upload image to backend
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
                const detection = data.detections?.[0]; // Only one detection returned
                if (detection) {
                    setDetections([detection]);
                    setMessage(`Detected: ${detection.class}`);

                    // Set cropped vehicle image
                    if (data.cropped_image) {
                        setCroppedImage(`data:image/jpeg;base64,${data.cropped_image}`);
                    }
                } else {
                    setDetections([]);
                    setCroppedImage(null);
                    setMessage("No vehicles detected.");
                }
            } else {
                setMessage(`Error: ${response.statusText}`);
            }
        } catch (error) {
            setMessage(`Error uploading image: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Draw the original image with bounding box (optional)
    useEffect(() => {
        if (!image || detections.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = URL.createObjectURL(image);

        img.onload = () => {
            const aspectRatio = img.width / img.height;
            canvas.width = imgDimensions.height * aspectRatio;
            canvas.height = imgDimensions.height;

            // Draw the original image
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Draw bounding box for the detected vehicle
            const { class: label, box } = detections[0];
            if (box) {
                const { x_min, y_min, x_max, y_max } = box;

                const scaledXMin = (x_min * canvas.width) / img.width;
                const scaledYMin = (y_min * canvas.height) / img.height;
                const scaledXMax = (x_max * canvas.width) / img.width;
                const scaledYMax = (y_max * canvas.height) / img.height;

                ctx.strokeStyle = "lime";
                ctx.lineWidth = 4;
                ctx.strokeRect(
                    scaledXMin,
                    scaledYMin,
                    scaledXMax - scaledXMin,
                    scaledYMax - scaledYMin
                );

                ctx.fillStyle = "lime";
                ctx.font = "16px Arial";
                ctx.fillText(label, scaledXMin + 4, scaledYMin - 8);
            }
        };
    }, [image, detections, imgDimensions]);

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <h1>Car Detection</h1>
            <form onSubmit={handleUpload}>
                <input type="file" accept="image/*" onChange={handleImageChange} required />
                <button type="submit" disabled={loading}>
                    {loading ? "Uploading..." : "Upload Image"}
                </button>
            </form>

            {/* Display uploaded image with bounding box */}
            {image && detections.length > 0 && (
                <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <h3>Original Image with Detection:</h3>
                    <canvas
                        ref={canvasRef}
                        style={{ maxWidth: "100%", border: "1px solid black", marginTop: "10px" }}
                    />
                </div>
            )}

            {/* Display cropped vehicle image */}
            {croppedImage && (
                <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <h3>Cropped Vehicle:</h3>
                    <img
                        src={croppedImage}
                        alt="Cropped Vehicle"
                        style={{ height: `${imgDimensions.height}px`, width: "auto", marginTop: "10px", border: "1px solid black" }}
                    />
                </div>
            )}

             {/* Display message  */}
            {message && <p style={{ textAlign: "center", marginTop: "10px" }}>{message}</p>}
        </div>
    );
}
