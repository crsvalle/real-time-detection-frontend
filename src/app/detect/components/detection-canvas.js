"use client";

import { useEffect, useRef } from "react";

export default function DetectionCanvas({
    previewImage,
    detections,
    onClick,
    analyzing
}) {
    const canvasRef = useRef(null);
    const maxCanvasWidth = 600;

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

    if (!detections.length) return null;

    return (
        <div style={{ marginTop: "20px" }}>
            <h3>Click a Vehicle:</h3>
            <canvas
                ref={canvasRef}
                onClick={onClick}
                style={{
                    border: "1px solid black",
                    cursor: analyzing ? "wait" : "pointer",
                }}
            />
        </div>
    );
}
