export default function CroppedResult({ croppedImage }) {
    if (!croppedImage) return null;

    return (
        <div style={{ marginTop: "20px" }}>
            <h3>Selected Vehicle:</h3>
            <img
                src={croppedImage}
                alt="Cropped Vehicle"
                style={{ maxWidth: "600px", border: "1px solid black" }}
            />
        </div>
    );
}
