"use client";

import { useState } from "react";
const API = process.env.NEXT_PUBLIC_BACKEND_API;

export default function ImageUpload() {
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
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
                console.log(data);
                setMessage(`Detection Result: ${data.detections[0].class || "No car detected"}`);
            } else {
                setMessage(`Error: ${response.statusText}`);
            }
        } catch (error) {
            setMessage(`Error uploading image: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Car Detection</h1>
            <form onSubmit={handleUpload}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Uploading..." : "Upload Image"}
                </button>
            </form>

            {image && (
                <div style={{ marginTop: "20px",alignItems: "center", display:"flex",flexDirection: "column" }}>
                    <h3>Uploaded Image:</h3>
                    <img 
                        src={URL.createObjectURL(image)} 
                        alt="Uploaded Image" 
                        style={{ width: "300px", height: "auto", marginTop: "10px" }} 
                    />
                </div>
            )}

            {message && <p>{message}</p>}
        </div>
    );
}
