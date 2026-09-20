"""
Tamper-Evident Audit Logging Service
Uses Supabase Service-Role key exclusively to record immutable system events.
"""
import os
import json
from typing import Optional, Dict, Any
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

_supabase_client: Optional[Client] = None

def get_supabase_admin() -> Optional[Client]:
    global _supabase_client
    if _supabase_client is None:
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        if url and key and not url.startswith("https://your-project"):
            try:
                _supabase_client = create_client(url, key)
            except Exception as e:
                print(f"[!] Warning: Failed to initialize Supabase Admin Client: {e}")
    return _supabase_client

def log_audit_event(
    action: str,
    entity_type: str,
    entity_id: Optional[str] = None,
    user_id: Optional[str] = None,
    role: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Inserts a tamper-evident audit log entry.
    """
    event = {
        "action": action,
        "entity_type": entity_type,
        "entity_id": entity_id,
        "user_id": user_id,
        "role": role,
        "metadata": metadata or {}
    }
    
    admin_client = get_supabase_admin()
    if admin_client:
        try:
            res = admin_client.table("audit_logs").insert(event).execute()
            print(f"[Audit] Recorded '{action}' on {entity_type} {entity_id}")
            return {"status": "success", "data": res.data}
        except Exception as e:
            print(f"[!] Audit write error: {e}")
            return {"status": "error", "error": str(e), "event": event}
    
    # In-memory logging fallback if cloud Supabase is in offline mode
    print(f"[Audit Local Log] Action: {action} | Entity: {entity_type}:{entity_id} | User: {user_id} ({role}) | Metadata: {json.dumps(metadata)}")
    return {"status": "logged_locally", "event": event}
