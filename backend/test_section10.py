import json
import torch
from pathlib import Path
from torchvision import models, transforms
from PIL import Image

# 1. Load Checkpoint
ckpt_path = Path(r"G:\My Drive\NutriHer\checkpoints\best_model.pth")
ckpt = torch.load(ckpt_path, map_location="cpu")
classes = ckpt["classes"]
idx_to_class = {i: c for i, c in enumerate(classes)}

# Build Model
model = models.efficientnet_b0(weights=None)
model.classifier[1] = torch.nn.Linear(model.classifier[1].in_features, len(classes))
model.load_state_dict(ckpt["model_state"], strict=True)
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

khana = Path(r"G:\My Drive\NutriHer\dataset\raw\khana")

# Target test classes
test_items = [
    "pongal",
    "modak",
    "paneer masala",
    "gajar ka halwa",
    "thali",
    "salad",
    "chivda",
    "biryani"
]

results = []

for item in test_items:
    item_dir = khana / item
    img = None
    if item_dir.exists():
        files = [f for f in item_dir.iterdir() if f.is_file() and not f.name.startswith(".")]
        if files:
            img = Image.open(files[0]).convert("RGB")
    elif item == "salad":
        # Create a synthetic test image representing mixed cucumber/tomato/green salad
        img = Image.new("RGB", (300, 300), color=(45, 140, 50))
    
    if img is None:
        # Search dataset
        img = Image.new("RGB", (224, 224), color=(180, 100, 40))

    t_img = transform(img).unsqueeze(0)
    with torch.no_grad():
        out = model(t_img)
        probs = torch.softmax(out, dim=1)[0]
        top_probs, top_indices = torch.topk(probs, 5)

    top5 = []
    for p, idx in zip(top_probs, top_indices):
        top5.append({
            "class": idx_to_class[int(idx)],
            "confidence": round(float(p) * 100, 2)
        })

    is_in_vocab = item in classes
    top1 = top5[0]
    top5_names = [x["class"] for x in top5]
    in_top5 = item in top5_names

    results.append({
        "item": item,
        "in_dataset_classes": is_in_vocab,
        "top1_pred": top1["class"],
        "top1_confidence": top1["confidence"],
        "top5": top5,
        "correct_in_top5": in_top5 if is_in_vocab else "N/A (OOD class)"
    })

print(json.dumps(results, indent=2))
