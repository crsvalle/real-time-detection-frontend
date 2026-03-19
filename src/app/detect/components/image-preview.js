export default function ImagePreview({ previewImage, detections }) {
    if (!previewImage || detections.length > 0) return null;

    return (
        <div style={{ marginTop: "20px" }}>
            <h3>Preview:</h3>
            <img
                src={previewImage}
                alt="Preview"
                style={{ maxWidth: "600px", border: "1px solid black" }}
            />
        </div>
    );
}
