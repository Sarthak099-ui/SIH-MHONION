"""
YOLO Training Pipeline for Onion Defect Classification
Supports YOLO26n / YOLO11n fine-tuning with augmentation for produce defect detection.
"""
import os
import sys
import argparse

def train_onion_model(
    data_yaml: str = "dataset.yaml",
    model_name: str = "yolo11n.pt",
    epochs: int = 100,
    imgsz: int = 640,
    batch: int = 16,
    output_dir: str = "../models"
):
    print(f"[*] Initializing YOLO Fine-Tuning Pipeline for Onion Quality...")
    print(f"[*] Base Weights: {model_name} | Epochs: {epochs} | ImgSz: {imgsz}")
    
    try:
        from ultralytics import YOLO
        model = YOLO(model_name)
        
        # Train with augmentation tailored for produce & defect recognition
        results = model.train(
            data=data_yaml,
            epochs=epochs,
            imgsz=imgsz,
            batch=batch,
            patience=20,  # Early stopping
            degrees=15.0,  # Rotation augmentation
            fliplr=0.5,    # Horizontal flip
            flipud=0.5,    # Vertical flip
            mosaic=1.0,    # Mosaic augmentation
            mixup=0.1,
            project=output_dir,
            name="onion_defects",
            exist_ok=True
        )
        print("[+] Training complete! Best weights saved to service/models/best.pt")
        return results
    except ImportError:
        print("[!] Ultralytics not installed or running in mock training mode.")
        os.makedirs(output_dir, exist_ok=True)
        sample_path = os.path.join(output_dir, "best.pt.example")
        with open(sample_path, "w") as f:
            f.write("# Ultralytics YOLO26/11 weights checkpoint placeholder\n")
        print(f"[+] Created weights reference at {sample_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train YOLO Onion Quality Model")
    parser.add_argument("--epochs", type=int, default=100)
    parser.add_argument("--imgsz", type=int, default=640)
    parser.add_argument("--model", type=str, default="yolo11n.pt")
    args = parser.parse_args()
    
    train_onion_model(model_name=args.model, epochs=args.epochs, imgsz=args.imgsz)
