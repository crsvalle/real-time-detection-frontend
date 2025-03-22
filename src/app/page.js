import { useState } from "react";
import axios from "axios";

const API = process.env.BACKEND_API;

export default function Home() {
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);

    const handleFileChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append("file", image);

        const response = await axios.post(API, formData);
        setResult(response.data);
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Analyze</button>
            {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
        </div>
    );
}
