import os
import uuid
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from grading.rules import calculate_defect_percentages, evaluate_grade
from models.detector import detector
from audit import log_audit_event, get_supabase_admin

load_dotenv()

app = FastAPI(
    title="MH ONION Quality Assessment & Grading API",
    description="Automated AI onion defect detection, AGMARK/FSSAI rule-based grading, and tamper-evident audit trail for Maharashtra APMC Mandis.",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store for local testing / offline prototyping
IN_MEMORY_LOTS: Dict[str, Any] = {}
IN_MEMORY_DETECTIONS: Dict[str, List[Any]] = {}
IN_MEMORY_GRADES: Dict[str, Any] = {}
IN_MEMORY_AUDIT_LOGS: List[Dict[str, Any]] = []

# --- Request / Response Models ---
class GradeRequest(BaseModel):
    lot_id: str
    counts: Optional[Dict[str, int]] = None
    user_id: Optional[str] = None
    role: Optional[str] = "farmer"

class GradeOverrideRequest(BaseModel):
    lot_id: str
    grade_label: str  # 'A', 'B', 'URS'
    grader_id: str
    notes: str

class AuditEventRequest(BaseModel):
    action: str
    entity_type: str
    entity_id: Optional[str] = None
    user_id: Optional[str] = None
    role: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

@app.get("/")
def root():
    return {
        "service": "MH ONION AI Quality Assessment & Grading API",
        "version": "1.0.0",
        "status": "online",
        "agmark_rules": "v1.0"
    }

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/infer")
async def run_inference(
    file: UploadFile = File(...),
    lot_id: Optional[str] = Form(None),
    image_id: Optional[str] = Form(None),
    user_id: Optional[str] = Form(None),
    role: Optional[str] = Form("farmer")
):
    """
    Milestone 5: Runs YOLO Defect Detection on uploaded onion image.
    Records detections in database via service-role key and updates lot status.
    """
    content = await file.read()
    detections, counts = detector.detect(content, file.filename)
    
    assigned_lot_id = lot_id or str(uuid.uuid4())
    assigned_image_id = image_id or str(uuid.uuid4())
    
    # Write to Supabase using service-role key
    supabase_admin = get_supabase_admin()
    if supabase_admin and lot_id:
        try:
            # Insert each detection
            detection_rows = [
                {
                    "image_id": assigned_image_id,
                    "class": d["class"],
                    "confidence": d["confidence"],
                    "bbox": d["bbox"]
                }
                for d in detections
            ]
            supabase_admin.table("detections").insert(detection_rows).execute()
            
            # Update lot status to 'detected'
            supabase_admin.table("lots").update({"status": "detected"}).eq("id", assigned_lot_id).execute()
        except Exception as e:
            print(f"[!] Supabase service-role insert error: {e}")

    # Local in-memory caching
    IN_MEMORY_DETECTIONS[assigned_lot_id] = detections
    if assigned_lot_id not in IN_MEMORY_LOTS:
        IN_MEMORY_LOTS[assigned_lot_id] = {
            "id": assigned_lot_id,
            "status": "detected",
            "counts": counts
        }
    else:
        IN_MEMORY_LOTS[assigned_lot_id]["status"] = "detected"
        IN_MEMORY_LOTS[assigned_lot_id]["counts"] = counts

    # Record tamper-evident audit event
    audit_res = log_audit_event(
        action="detection_run",
        entity_type="lot",
        entity_id=assigned_lot_id,
        user_id=user_id,
        role=role,
        metadata={
            "filename": file.filename,
            "total_detected": sum(counts.values()),
            "counts": counts
        }
    )
    IN_MEMORY_AUDIT_LOGS.insert(0, {
        "action": "detection_run",
        "entity_type": "lot",
        "entity_id": assigned_lot_id,
        "user_id": user_id,
        "role": role,
        "metadata": {"counts": counts, "filename": file.filename},
        "created_at": "Just now"
    })

    return {
        "status": "success",
        "lot_id": assigned_lot_id,
        "image_id": assigned_image_id,
        "detections": detections,
        "counts": counts,
        "total_onions": sum(counts.values())
    }

@app.post("/grade")
def calculate_grade(payload: GradeRequest):
    """
    Milestone 6: Evaluates Defect Percentages against AGMARK/FSSAI Rule Engine.
    Writes grade row to database and updates lot status to 'graded'.
    """
    lot_id = payload.lot_id
    
    # Retrieve counts from payload or in-memory / DB
    counts = payload.counts
    if not counts and lot_id in IN_MEMORY_LOTS:
        counts = IN_MEMORY_LOTS[lot_id].get("counts", {})
    
    if not counts:
        counts = {"healthy": 12, "damaged": 1, "rotten": 0, "sprouted": 0, "undersized": 1}

    # Pure-Python Rule Engine Evaluation
    pcts = calculate_defect_percentages(counts)
    grade_label, reasons = evaluate_grade(pcts)

    grade_record = {
        "lot_id": lot_id,
        "grade_label": grade_label,
        "pct_healthy": pcts["pct_healthy"],
        "pct_damaged": pcts["pct_damaged"],
        "pct_rotten": pcts["pct_rotten"],
        "pct_sprouted": pcts["pct_sprouted"],
        "pct_undersized": pcts["pct_undersized"],
        "rule_version": "v1.0-AGMARK",
        "notes": reasons
    }

    # Write to Supabase using service-role key
    supabase_admin = get_supabase_admin()
    if supabase_admin:
        try:
            supabase_admin.table("grades").upsert(grade_record).execute()
            supabase_admin.table("lots").update({"status": "graded"}).eq("id", lot_id).execute()
        except Exception as e:
            print(f"[!] Supabase grade write error: {e}")

    # Update in-memory state
    IN_MEMORY_GRADES[lot_id] = grade_record
    if lot_id in IN_MEMORY_LOTS:
        IN_MEMORY_LOTS[lot_id]["status"] = "graded"
        IN_MEMORY_LOTS[lot_id]["grade"] = grade_record

    # Log audit event
    log_audit_event(
        action="grade_generated",
        entity_type="lot",
        entity_id=lot_id,
        user_id=payload.user_id,
        role=payload.role,
        metadata={
            "grade_label": grade_label,
            "percentages": pcts,
            "reasons": reasons
        }
    )
    IN_MEMORY_AUDIT_LOGS.insert(0, {
        "action": "grade_generated",
        "entity_type": "lot",
        "entity_id": lot_id,
        "user_id": payload.user_id,
        "role": payload.role,
        "metadata": {"grade": grade_label, "reasons": reasons},
        "created_at": "Just now"
    })

    return {
        "status": "success",
        "lot_id": lot_id,
        "grade_label": grade_label,
        "percentages": pcts,
        "reasons": reasons,
        "rule_version": "v1.0-AGMARK"
    }

@app.post("/override-grade")
def override_grade(payload: GradeOverrideRequest):
    """
    Grader manual calibration / override with tamper-evident audit record.
    """
    lot_id = payload.lot_id
    supabase_admin = get_supabase_admin()
    
    update_data = {
        "grade_label": payload.grade_label,
        "overridden_by": payload.grader_id,
        "notes": f"MANUAL OVERRIDE: {payload.notes}"
    }

    if supabase_admin:
        try:
            supabase_admin.table("grades").update(update_data).eq("lot_id", lot_id).execute()
        except Exception as e:
            print(f"[!] Supabase grade override error: {e}")

    if lot_id in IN_MEMORY_GRADES:
        IN_MEMORY_GRADES[lot_id].update(update_data)

    log_audit_event(
        action="grade_overridden",
        entity_type="lot",
        entity_id=lot_id,
        user_id=payload.grader_id,
        role="grader",
        metadata={
            "new_grade": payload.grade_label,
            "notes": payload.notes
        }
    )
    IN_MEMORY_AUDIT_LOGS.insert(0, {
        "action": "grade_overridden",
        "entity_type": "lot",
        "entity_id": lot_id,
        "user_id": payload.grader_id,
        "role": "grader",
        "metadata": {"new_grade": payload.grade_label, "notes": payload.notes},
        "created_at": "Just now"
    })

    return {
        "status": "success",
        "lot_id": lot_id,
        "updated_grade": payload.grade_label,
        "notes": payload.notes
    }

@app.post("/audit")
def create_audit_event(payload: AuditEventRequest):
    res = log_audit_event(
        action=payload.action,
        entity_type=payload.entity_type,
        entity_id=payload.entity_id,
        user_id=payload.user_id,
        role=payload.role,
        metadata=payload.metadata
    )
    return res

@app.get("/audit-logs")
def get_audit_logs():
    supabase_admin = get_supabase_admin()
    if supabase_admin:
        try:
            res = supabase_admin.table("audit_logs").select("*").order("created_at", desc=True).limit(50).execute()
            if res.data:
                return {"status": "success", "logs": res.data}
        except Exception as e:
            print(f"[!] Error fetching audit logs: {e}")

    return {"status": "success", "logs": IN_MEMORY_AUDIT_LOGS}
