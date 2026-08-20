CarVision — Frontend
Next.js frontend for a vehicle detection and identification app. Upload a photo, YOLOv8 (via the backend) finds every vehicle in it, click the one you want, and a ResNet50 classifier trained on the Stanford Cars dataset identifies its make, model, and year.
Status: Photo-upload detection UI is complete and wired to the backend API. Live/real-time camera detection has not been started yet — this repo currently handles single-image uploads only.
Stack
Next.js 16 (App Router, Turbopack dev server)
React 19
Tailwind CSS 3
lucide-react for icons
axios (available, not yet used in the detection flow — fetch is used instead)
Getting started
bash
npm install
npm run dev
Runs at http://localhost:3000 by default.
Environment variables
Create a .env.local file:
bash
NEXT_PUBLIC_BACKEND_API=http://localhost:8000
This should point at the FastAPI backend from real-time-detection-backend. All detection requests are sent to ${NEXT_PUBLIC_BACKEND_API}/detect_car and ${NEXT_PUBLIC_BACKEND_API}/analyze_selected_car.
Project structure
src/
├── app/
│   ├── layout.js                     # Root layout, wraps every page in <Navbar />
│   ├── page.js                       # Home page — the main detection workspace
│   ├── globals.css
│   ├── about/
│   │   └── page.js
│   └── detect/
│       ├── hooks/
│       │   └── use-detection.js      # All detection state + API calls live here
│       └── components/
│           ├── upload-form.js        # Drop zone + detect/change/clear actions
│           ├── image-preview.js      # Renders the uploaded image
│           ├── detection-canvas.js   # Draws bounding boxes, handles click-to-select
│           ├── cropped-result.js     # Shows the cropped image sent for identification
│           └── vehicle-info-panel.js # Brand / model / year / confidence / alternatives
└── components/
    ├── navbar.js                     # Sticky nav, active-link highlighting
    ├── detection-results.js          # List of detected vehicles (click to identify)
    └── detection-history.js          # Last 10 detections, persisted to localStorage
How the detection flow works
Upload — user drags/drops or picks an image in UploadForm. Client-side validation rejects non-images and anything over 8 MB.
Detect — handleUpload() in use-detection.js POSTs the file to POST /detect_car. The backend runs YOLOv8 and returns every detected vehicle (car/truck/bus/motorcycle) as { class, confidence, box }.
Select — detected boxes are drawn on DetectionCanvas and listed in DetectionResults. Clicking one calls sendSelectedCar(detection).
Identify — sendSelectedCar() POSTs the original file plus the selected box to POST /analyze_selected_car. The backend crops the image to that box and runs it through the ResNet50 classifier, returning brand, model, year, a confidence bucket (high/medium/low), a cropped preview image, and top alternative guesses.
Display — results render in VehicleInfoPanel and CroppedResult; the detection is also saved to DetectionHistory (localStorage, capped at 10 entries).
Known gaps / next steps
No live camera detection yet. Current flow is single-image upload → detect → identify. Real-time (webcam/video stream) detection is a separate, unstarted milestone — it will need a frame-capture loop (getUserMedia + canvas) and a throttled streaming request pattern, since YOLOv8 + ResNet50 inference isn't cheap enough to run on every frame.
Backend dependency: this UI is only as good as the backend's /analyze_selected_car response. As of the last backend commit, that endpoint's model-loading step is broken (missing car_classes.json and a checkpoint filename mismatch) — see the backend repo's README for details.
detectionHistory is stored in localStorage only; it's per-browser and not synced anywhere.
