"use client";

import { useState, useRef, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_BACKEND_API;

export default function ImageUpload() {
    const [image, setImage] = useState(null);
    const [detections, setDetections] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const canvasRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setDetections([]); // Reset detections on new image
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
        setMessage("");

        try {
            const response = await fetch(`${API}/detect_car`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setDetections(data.detections || []);
                setMessage("Detection Complete.");
            } else {
                setMessage(`Error: ${response.statusText}`);
            }
        } catch (error) {
            setMessage(`Error uploading image: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!image || detections.length === 0) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = URL.createObjectURL(image);

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);

            detections.forEach(({ class: label, box }) => {
                if (!box || typeof box !== "object") return; 
                
                const { x_min, y_min, x_max, y_max } = box; 
            
                ctx.strokeStyle = "red";
                ctx.lineWidth = 3;
                ctx.strokeRect(x_min, y_min, x_max - x_min, y_max - y_min);
            
                ctx.fillStyle = "red";
                ctx.fillText(label, x_min, y_min - 5);
            });
            
        };
    }, [image, detections]);

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <h1>Car Detection</h1>
            <form onSubmit={handleUpload} >
                <input type="file" accept="image/*" onChange={handleImageChange} required />
                <button type="submit" disabled={loading}>
                    {loading ? "Uploading..." : "Upload Image"}
                </button>
            </form>
    
            {image && (
                <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <h3>Uploaded Image:</h3>
                    <canvas ref={canvasRef} style={{ maxWidth: "100%", border: "1px solid black", marginTop: "10px" }} />
                </div>
            )}
    
            {message && <p style={{ textAlign: "center", marginTop: "10px" }}>{message}</p>}
        </div>
    );
    
}
