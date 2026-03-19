export default function UploadForm({
    handleImageChange,
    handleUpload,
    loading,
    analyzing
}) {
    return (
        <form onSubmit={handleUpload}>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
            />
            <button type="submit" disabled={loading || analyzing}>
                {loading ? "Detecting Vehicles..." : "Detect Vehicles"}
            </button>
        </form>
    );
}
