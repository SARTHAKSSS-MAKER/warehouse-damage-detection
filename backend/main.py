from fastapi import FastAPI, UploadFile, File

app = FastAPI()


@app.get("/")
def home():
    return {
        "message": "WarehouseAI Backend is running!"
    }


@app.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    return {
        "message": "Video uploaded successfully!",
        "filename": file.filename
    }