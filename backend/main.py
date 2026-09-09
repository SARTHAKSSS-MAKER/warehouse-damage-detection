import os
import uuid
import cv2

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="WarehouseAI",
    description="Warehouse Package Damage Detection API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"

ALLOWED_EXTENSIONS = {
    ".mp4",
    ".mov",
    ".avi",
    ".webm"
}

MAX_FILE_SIZE = 500 * 1024 * 1024

os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def home():
    return {
        "message": "WarehouseAI Backend is running!",
        "status": "online"
    }

@app.post("/upload")
async def upload_video(file: UploadFile = File(...)):

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Please select a video file."
        )

    extension = os.path.splitext(file.filename)[1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only MP4, MOV, AVI and WebM videos are allowed."
        )

    unique_filename = f"{uuid.uuid4()}{extension}"

    file_path = os.path.join(
        UPLOAD_DIR,
        unique_filename
    )

    file_size = 0

    try:
        with open(file_path, "wb") as buffer:
            while True:
                chunk = await file.read(1024 * 1024)

                if not chunk:
                    break

                file_size += len(chunk)

                if file_size > MAX_FILE_SIZE:
                    buffer.close()

                    if os.path.exists(file_path):
                        os.remove(file_path)

                    raise HTTPException(
                        status_code=413,
                        detail="Video is too large. Maximum size is 500 MB."
                    )

                buffer.write(chunk)

    except HTTPException:
        raise

    except Exception as error:
        if os.path.exists(file_path):
            os.remove(file_path)

        raise HTTPException(
            status_code=500,
            detail=f"Could not save video: {str(error)}"
        )

    finally:
        await file.close()

    video = cv2.VideoCapture(file_path)

    if not video.isOpened():
        if os.path.exists(file_path):
            os.remove(file_path)

        raise HTTPException(
            status_code=400,
            detail="Could not open the uploaded video."
        )

    frame_count = int(
        video.get(cv2.CAP_PROP_FRAME_COUNT)
    )

    fps = video.get(
        cv2.CAP_PROP_FPS
    )

    width = int(
        video.get(cv2.CAP_PROP_FRAME_WIDTH)
    )

    height = int(
        video.get(cv2.CAP_PROP_FRAME_HEIGHT)
    )

    if fps > 0:
        duration_seconds = frame_count / fps
    else:
        duration_seconds = 0

    success, first_frame = video.read()

    video.release()

    if not success:
        if os.path.exists(file_path):
            os.remove(file_path)

        raise HTTPException(
            status_code=400,
            detail="The uploaded video contains no readable frames."
        )

    return {
        "message": "Video uploaded and analyzed successfully!",
        "original_filename": file.filename,
        "filename": unique_filename,
        "size_mb": round(
            file_size / (1024 * 1024),
            2
        ),
        "video": {
            "frame_count": frame_count,
            "fps": round(fps, 2),
            "width": width,
            "height": height,
            "duration_seconds": round(
                duration_seconds,
                2
            )
        },
        "opencv": {
            "opened": True,
            "first_frame_read": True
        },
        "status": "ready_for_detection"
    }