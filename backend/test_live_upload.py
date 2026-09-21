import urllib.request
import json
import uuid
from pathlib import Path

def upload_image(url, filepath):
    boundary = uuid.uuid4().hex
    filename = Path(filepath).name
    with open(filepath, "rb") as f:
        file_bytes = f.read()

    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="image"; filename="{filename}"\r\n'
        f"Content-Type: image/jpeg\r\n\r\n"
    ).encode("utf-8") + file_bytes + f"\r\n--{boundary}--\r\n".encode("utf-8")

    req = urllib.request.Request(
        url,
        data=body,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
        method="POST"
    )
    res = urllib.request.urlopen(req)
    return json.loads(res.read().decode("utf-8"))

khana = Path(r"G:\My Drive\NutriHer\dataset\raw\khana")
test_cases = [
    ("pongal", khana / "pongal"),
    ("modak", khana / "modak"),
    ("paneer masala", khana / "paneer masala"),
    ("gajar ka halwa", khana / "gajar ka halwa"),
    ("thali", khana / "thali"),
    ("pepperoni pizza", khana / "pepperoni pizza"),
]

print("================ LIVE HTTP POST /predict TEST ================")
for label, folder in test_cases:
    if folder.exists():
        files = [f for f in folder.iterdir() if f.is_file() and not f.name.startswith(".")]
        if files:
            result = upload_image("http://127.0.0.1:8000/predict", files[0])
            pred_label = result["food"].replace("_", " ")
            match = "PASS" if pred_label == label else "FAIL"
            print(f"[{match}] Uploaded Image ({label:<16}) --> Live API: {result['food_name']} ({result['confidence']}%)")
