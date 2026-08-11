import os
from fastapi import FastAPI, UploadFile, File

app = FastAPI()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.get("/")
def home():
    return {
        "message": "WarehouseAI Backend is running!"
    }


@app.post("/upload")
async def upload_video(file: UploadFile = File(...)):

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    return {
        "message": "Video uploaded successfully!",
        "filename": file.filename
    }