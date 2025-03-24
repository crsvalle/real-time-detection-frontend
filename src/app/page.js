"use client"; 

import { useState } from "react";
const  API = process.env.NEXT_PUBLIC_BACKEND_API
console.log(API)

const Home = () => {
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
      const response = await fetch(`${API}/api/detect_car`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data)
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
      {message && <p>{message}</p>}
    </div>
  );
};

export default Home;
