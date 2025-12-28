import { apiFetch } from "./api";

export type Asset = {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
  asset_type: string;
  can_record_downtime: boolean;
  can_run_production: boolean;
  parent_id: number | null;
};

// For create/update payloads (don’t send server fields like created_at)
export type AssetInput = Omit<Asset, "id" | "created_at">;

export function listAssets() {
  return apiFetch<Asset[]>("/api/assets/");
}

export function createAsset(payload: AssetInput) {
  return apiFetch<Asset>("/api/assets/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAsset(id: number, payload: Partial<AssetInput>) {
  return apiFetch<Asset>(`/api/assets/${id}/`, {
    method: "PATCH", // PATCH is perfect for your “draft” pattern
    body: JSON.stringify(payload),
  });
}

export function deleteAsset(id: number) {
  return apiFetch<void>(`/api/assets/${id}/`, {
    method: "DELETE",
  });
}
