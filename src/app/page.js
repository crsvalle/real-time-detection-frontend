"use client";

import useDetection from "@/app/detect/hooks/use-detection";
import UploadForm from "@/app/detect/components/upload-form";
import ImagePreview from "@/app/detect/components/image-preview";
import DetectionCanvas from "@/app/detect/components/detection-canvas";
import DetectionResults from "@/components/detection-results";
import CroppedResult from "@/app/detect/components/cropped-result";
import DetectionHistory from "@/components/detection-history";
import VehicleInfoPanel from "@/app/detect/components/vehicle-info-panel";

export default function ImageUpload() {
  const {
    file,
    imgUrl,
    detections,
    croppedImage,
    vehicleInfo,
    selectedId,
    message,
    loading,
    analyzing,
    history,
    setHistory,
    handleFiles,
    handleImageChange,
    handleUpload,
    sendSelectedCar,
    reset,
  } = useDetection();

  const selected = detections.find((d) => d.id === selectedId) ?? null;

  return (
    <>
      <style>{CSS}</style>
      <main className="iu-main">

        {!imgUrl ? (
          <UploadForm
            handleFiles={handleFiles}
            handleImageChange={handleImageChange}
            handleUpload={handleUpload}
            onReset={reset}
            loading={loading}
            analyzing={analyzing}
            hasImage={false}
            hasDetections={false}
          />
        ) : (
          <div className="iu-workspace">

            {/* Left column: image + actions */}
            <div className="iu-left">
              <ImagePreview imgUrl={imgUrl} detections={detections} />

              <DetectionCanvas
                imgUrl={imgUrl}
                detections={detections}
                selectedId={selectedId}
                analyzing={analyzing}
                onSelectVehicle={sendSelectedCar}
              />

              <UploadForm
                handleFiles={handleFiles}
                handleImageChange={handleImageChange}
                handleUpload={handleUpload}
                onReset={reset}
                loading={loading}
                analyzing={analyzing}
                hasImage={true}
                hasDetections={detections.length > 0}
              />

              {message && (
                <p className={`iu-message ${message.toLowerCase().includes("error") ? "iu-message--error" : ""}`}>
                  {message}
                </p>
              )}
            </div>

            {/* Right column: detections + cropped preview + identification */}
            <aside className="iu-right">
              <DetectionResults
                detections={detections}
                selectedId={selectedId}
                analyzing={analyzing}
                onSelectVehicle={sendSelectedCar}
              />
              <CroppedResult
                croppedImage={croppedImage}
                selectedDetection={selected}
              />
              <VehicleInfoPanel
                result={vehicleInfo}
                loading={analyzing}
                error={!vehicleInfo && !analyzing && selectedId !== null ? message : null}
                onClose={() => {}}
              />
            </aside>
          </div>
        )}

        <DetectionHistory history={history} setHistory={setHistory} />
      </main>
    </>
  );
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Geist+Mono:wght@400;500&display=swap');

  :root {
    --ci-bg: #0c0c0e;
    --ci-surface: #111114;
    --ci-border: rgba(255,255,255,0.07);
    --ci-text: #e8e8ec;
    --ci-muted: rgba(232,232,236,0.38);
    --ci-primary: #e8ff47;
    --ci-primary-dim: rgba(232,255,71,0.12);
    --conf-high: #4fffb0;
    --conf-mid: #ffd166;
    --conf-low: #ff6b6b;
  }

  .iu-main {
    min-height: calc(100vh - 64px);
    background: var(--ci-bg);
    color: var(--ci-text);
    font-family: 'Syne', sans-serif;
    max-width: 1100px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem 4rem;
  }

  .iu-workspace {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 1.5rem;
    align-items: start;
  }

  @media (max-width: 860px) {
    .iu-workspace { grid-template-columns: 1fr; }
  }

  .iu-left {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  .iu-right {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .iu-message {
    font-family: 'Geist Mono', monospace;
    font-size: 0.72rem;
    color: var(--ci-muted);
    letter-spacing: 0.04em;
    padding: 0.4rem 0;
  }

  .iu-message--error { color: var(--conf-low); }
`;