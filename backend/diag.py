import json
import torch
from pathlib import Path
from torchvision import models, transforms
from PIL import Image

# 1. Load Checkpoint
ckpt_path = Path(r"G:\My Drive\NutriHer\checkpoints\best_model.pth")
ckpt = torch.load(ckpt_path, map_location="cpu")
classes = ckpt.get("classes", [])
idx_to_class = {i: c for i, c in enumerate(classes)}

# Compare with classes.json
classes_json_path = Path(r"G:\My Drive\NutriHer\training\classes.json")
with open(classes_json_path, "r", encoding="utf-8") as f:
    json_classes = json.load(f)

ordering_matches = (classes == list(json_classes.keys())) or all(json_classes.get(c) == i for i, c in enumerate(classes))

# 2. Build Model
model = models.efficientnet_b0(weights=None)
model.classifier[1] = torch.nn.Linear(model.classifier[1].in_features, len(classes))
load_res = model.load_state_dict(ckpt["model_state"], strict=True)
model.eval()

# 3. Preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# 4. Collect 20 images across synced classes
khana_root = Path(r"G:\My Drive\NutriHer\dataset\raw\khana")
synced_classes = [
    "pongal", "modak", "amritsari kulcha", "gajar ka halwa",
    "paneer masala", "thali", "neer dosa", "pepperoni pizza", "dabeli"
]

test_images = []
for label in synced_classes:
    class_dir = khana_root / label
    if class_dir.exists():
        files = [f for f in class_dir.iterdir() if f.is_file() and not f.name.startswith(".")]
        # Pick 2-3 images per class
        for f in files[:3]:
            test_images.append((f, label))
            if len(test_images) == 20:
                break
    if len(test_images) == 20:
        break

results = []
correct_count = 0
chivda_count = 0

for img_path, ground_truth in test_images:
    try:
        img = Image.open(img_path).convert("RGB")
        t_img = transform(img).unsqueeze(0)
        with torch.no_grad():
            out = model(t_img)
            probs = torch.softmax(out, dim=1)[0]
            top_prob, top_idx = torch.topk(probs, 1)
            pred_class = idx_to_class[int(top_idx[0])]
            confidence = float(top_prob[0]) * 100

        is_correct = (pred_class.strip().lower() == ground_truth.strip().lower())
        if is_correct:
            correct_count += 1
        if pred_class.strip().lower() == "chivda":
            chivda_count += 1

        results.append({
            "image": img_path.name,
            "ground_truth": ground_truth,
            "predicted": pred_class,
            "confidence": f"{confidence:.2f}%",
            "match": "PASS" if is_correct else "FAIL"
        })
    except Exception as e:
        print(f"Error reading {img_path}: {e}")

print("================ DIAGNOSTIC REPORT ================")
print(f"Checkpoint Recorded Val Accuracy: {ckpt.get('val_acc'):.2f}%")
print(f"classes.json matches trained class ordering: {ordering_matches}")
print(f"PyTorch strict loading: {load_res}")
print("\n--- SAMPLE PREDICTIONS (20 KNOWN VALIDATION IMAGES) ---")
for r in results:
    print(f"[{r['match']}] Truth: {r['ground_truth']:<18} --> Predicted: {r['predicted']:<18} (Confidence: {r['confidence']})")

accuracy = (correct_count / len(results)) * 100 if results else 0
print("\n--- SUMMARY METRICS ---")
print(f"Total validation samples tested: {len(results)}")
print(f"Validation accuracy on sampled images: {correct_count}/{len(results)} ({accuracy:.1f}%)")
print(f"Predicted as Chivda: {chivda_count}/{len(results)}")
