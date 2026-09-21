export type UserRole = 'farmer' | 'grader' | 'buyer' | 'admin';

export type LotStatus = 'captured' | 'detected' | 'graded' | 'listed' | 'sold';

export type DefectClass = 'healthy' | 'damaged' | 'rotten' | 'sprouted' | 'undersized';

export type GradeLabel = 'A' | 'B' | 'URS';

export type ListingStatus = 'active' | 'sold' | 'cancelled';

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  center_id: string | null;
  created_at: string;
}

export interface Lot {
  id: string;
  farmer_id: string;
  center_id: string | null;
  location_text: string | null;
  status: LotStatus;
  created_at: string;
  farmer?: Profile;
  images?: ImageRecord[];
  grade?: GradeRecord;
  listings?: ListingRecord[];
}

export interface ImageRecord {
  id: string;
  lot_id: string;
  storage_path: string;
  annotated_storage_path: string | null;
  uploaded_by: string | null;
  created_at: string;
}

export interface BoundingBox {
  x: number; // Normalized 0-1
  y: number;
  width: number;
  height: number;
}

export interface Detection {
  id: string;
  image_id: string;
  class: DefectClass;
  confidence: number;
  bbox: BoundingBox;
  created_at: string;
}

export interface GradeRecord {
  id: string;
  lot_id: string;
  grade_label: GradeLabel;
  pct_healthy: number;
  pct_damaged: number;
  pct_rotten: number;
  pct_sprouted: number;
  pct_undersized: number;
  rule_version: string;
  overridden_by: string | null;
  notes: string | null;
  created_at: string;
}

export interface ListingRecord {
  id: string;
  lot_id: string;
  farmer_id: string;
  quantity_kg: number;
  base_price_per_kg: number;
  status: ListingStatus;
  created_at: string;
  lot?: Lot;
  farmer?: Profile;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  role: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  user?: Profile;
}
