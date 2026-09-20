# Onion Quality Assessment & Grading System (SIH Onion)

An AI-powered agricultural grading and traceability platform designed for transparent, AGMARK/FSSAI-aligned onion grading, defect analysis, and tamper-evident audit trails.

---

## 🏛 Project Architecture

- **`web/`**: Next.js App Router (TypeScript, Tailwind CSS, Lucide Icons, Supabase Auth & Storage SDK).
- **`service/`**: Python 3.11 FastAPI backend (Ultralytics YOLO defect detection, pure-Python AGMARK rule engine, Supabase Service-Role database access & tamper-evident audit logging).
- **`supabase/`**: PostgreSQL migrations with full Row-Level Security (RLS) policies and security-definer helper functions.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v18+ (Tested on v24+)
- **Python** 3.11+ (Tested on 3.11 - 3.14)
- **Supabase Account / CLI** (for PostgreSQL, Auth, and Storage)

---

### 2. Environment Configuration

#### Web Frontend (`web/.env.local`)
Create `web/.env.local` based on `web/.env.example`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
NEXT_PUBLIC_FASTAPI_URL=http://localhost:8000
```

#### Service Backend (`service/.env`)
Create `service/.env` based on `service/.env.example`:
```env
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
YOLO_MODEL_PATH=service/models/best.pt
PORT=8000
```

---

### 3. Running the Scaffolds

#### Start the FastAPI Backend:
```bash
cd service
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Backend API docs available at: `http://localhost:8000/docs`

#### Start the Next.js Frontend:
```bash
cd web
npm install
npm run dev
```
Frontend web app available at: `http://localhost:3000`

---

## 📦 Milestones & Roadmap
- [x] **M0**: Repo & environment scaffolding
- [x] **M1**: Database schema + Row-Level Security (RLS)
- [ ] **M2**: Auth & role-based routing (`/farmer/*`, `/grader/*`, `/buyer/*`, `/admin/*`)
- [ ] **M3**: Image capture & Supabase Storage upload
- [ ] **M4**: YOLO26/11 Defect training pipeline
- [ ] **M5**: AI Inference service (`POST /infer`)
- [ ] **M6**: AGMARK/FSSAI Rule engine & visual report (`POST /grade`, `/farmer/lots/[id]/report`)
- [ ] **M7**: Minimal E-Mandi Marketplace stretch feature (`/marketplace`)
- [ ] **M8**: Tamper-evident Audit Trail & `seed.py` demo generator
