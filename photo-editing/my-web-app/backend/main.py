from fastapi import FastAPI, UploadFile, File, Form
import cv2
import numpy as np
import uvicorn
from starlette.responses import FileResponse

app = FastAPI()

def apply_brightness_contrast(image, brightness=0):
    return cv2.convertScaleAbs(image, alpha=1.2, beta=brightness)

def remove_background(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, mask = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY_INV)
    return cv2.bitwise_and(image, image, mask=mask)

@app.post("/edit")
async def edit_image(file: UploadFile = File(...), filter: str = Form(...)):
    contents = await file.read()
    np_array = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

    if filter == "brightness":
        result = apply_brightness_contrast(image, 50)
    elif filter == "contrast":
        result = apply_brightness_contrast(image, -50)
    elif filter == "remove_bg":
        result = remove_background(image)
    else:
        result = image

    output_path = "edited_image.jpg"
    cv2.imwrite(output_path, result)

    return FileResponse(output_path, media_type="image/jpeg")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
