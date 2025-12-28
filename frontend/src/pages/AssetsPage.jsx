import { useMemo, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PenLine, X, Plus, Factory, Trash, Save } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { listAssets, createAsset, updateAsset, deleteAsset } from "@/lib/assetsApi"

function newAsset(parent_id) {
  return {
    name: "",
    is_active: true,
    created_at: "",
    asset_type: "",
    can_record_downtime: false,
    can_run_production: false,
    parent_id: parent_id ?? null,
  }
}

export default function AssetsPage() {
  const [isEditing, setIsEditing] = useState(false)

  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [selectedAsset, setSelectedAsset] = useState(null)

  // Draft copy so typing edits fields without saving immediately
  const [assetDraft, setAssetDraft] = useState(null)

  // Load once
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await listAssets()
        if (!cancelled) setAssets(data)
      } catch (e) {
        if (!cancelled) setError(e?.message ?? "Failed to load assets")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  // Build tree view model from flat list
  const parents = useMemo(() => {
    const byParent = new Map()
    for (const a of assets) {
      if (a.parent_id != null) {
        const arr = byParent.get(a.parent_id) ?? []
        arr.push(a)
        byParent.set(a.parent_id, arr)
      }
    }

    const roots = assets.filter((a) => a.parent_id == null)
    return roots.map((p) => ({
      id: p.id,
      name: p.name,
      asset: p,
      children: (byParent.get(p.id) ?? []).sort((a, b) =>
        (a.name ?? "").localeCompare(b.name ?? "")
      ),
    }))
  }, [assets])

  useEffect(() => {
    setAssetDraft(selectedAsset ? { ...selectedAsset } : null)
  }, [selectedAsset])

  const updateDraft = (key, value) => {
    setAssetDraft((prev) => ({ ...(prev ?? {}), [key]: value }))
  }

  const upsertLocal = (saved) => {
    setAssets((prev) => {
      const idx = prev.findIndex((a) => a.id === saved.id)
      if (idx === -1) return [saved, ...prev]
      const copy = prev.slice()
      copy[idx] = saved
      return copy
    })
  }

  const handleSaveAsset = async () => {
    if (!assetDraft) return

    const payload = {
      name: assetDraft.name ?? "",
      is_active: !!assetDraft.is_active,
      asset_type: assetDraft.asset_type ?? "",
      can_record_downtime: !!assetDraft.can_record_downtime,
      can_run_production: !!assetDraft.can_run_production,
      parent_id:
        assetDraft.parent_id === "" || assetDraft.parent_id == null
          ? null
          : Number(assetDraft.parent_id),
    }

    try {
      setError(null)
      const hasId = typeof assetDraft.id === "number" && !Number.isNaN(assetDraft.id)

      const saved = hasId
        ? await updateAsset(assetDraft.id, payload)
        : await createAsset(payload)

      upsertLocal(saved)
      setSelectedAsset(saved)
    } catch (e) {
      console.error(e)
      setError(e?.message ?? "Save failed")
    }
  }

  const handleDeleteAsset = async () => {
    if (!assetDraft) return

    // Unsaved draft -> just clear it
    if (typeof assetDraft.id !== "number") {
      setSelectedAsset(null)
      return
    }

    try {
      setError(null)
      await deleteAsset(assetDraft.id)
      setAssets((prev) => prev.filter((a) => a.id !== assetDraft.id))
      setSelectedAsset(null)
    } catch (e) {
      console.error(e)
      setError(e?.message ?? "Delete failed")
    }
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex flex-1 min-h-0">
        {/* Tree area */}
        <div className="flex-1 min-h-0 flex flex-col">
          {loading && <div className="p-3 opacity-70">Loading assets…</div>}
          {error && <div className="p-3 text-sm text-red-400">{error}</div>}

          <Accordion type="multiple" className="w-full space-y-2 flex-1 overflow-auto">
            {parents.map((p) => (
              <AccordionItem key={p.id} value={`parent-${p.id}`} className="rounded card">
                <AccordionTrigger
                  className="px-3 w-full flex items-center justify-between"
                  onClick={() => {
                    if (!isEditing) return
                    setSelectedAsset(p.asset)
                  }}
                >
                  <span className="flex items-center gap-2">
                    <Factory className="flex-none" />
                    {p.name}
                  </span>
                </AccordionTrigger>

                <AccordionContent className="px-3 pb-3 grow">
                  <div className="space-y-2">
                    {p.children.map((child) => (
                      <div
                        key={child.id}
                        className="p-2 cursor-pointer row row-hover"
                        onClick={() => {
                          if (!isEditing) return
                          setSelectedAsset(child)
                        }}
                      >
                        {child.name}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Edit toggle button */}
          <div className="flex justify-end mt-2">
            <div className="flex flex-col content-between">
              {isEditing && (
                <Button
                  className="w-12 h-12 basis-12 cursor-pointer mb-1"
                  style={{
                    borderColor: "hsl(var(--border))",
                    background: "hsl(var(--panel))",
                  }}
                  variant="outline"
                  aria-label="Add asset"
                  onClick={() => {
                    setSelectedAsset(newAsset(null))
                  }}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              )}

              <Button
                onClick={() =>
                  setIsEditing((v) => {
                    const next = !v
                    if (!next) setSelectedAsset(null)
                    return next
                  })
                }
                className="w-12 h-12 basis-12 cursor-pointer"
                style={{
                  borderColor: "hsl(var(--border))",
                  background: "hsl(var(--panel))",
                }}
                variant="outline"
                aria-label="Toggle edit mode"
              >
                {!isEditing && <PenLine className="h-5 w-5" />}
                {isEditing && <X className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Slide-out palette */}
        {isEditing && (
          <div
            className="w-72 border-l p-3 flex flex-col gap-2 rounded card ml-3"
            style={{
              borderColor: "hsl(var(--border))",
              background: "hsl(var(--panel))",
            }}
          >
            {selectedAsset === null ? (
              <div className="rounded h-full">
                <div className="flex flex-col h-full border-2 justify-center items-center border-dashed border-white p-3 rounded">
                  Select an Asset to Edit
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-white p-3 rounded flex flex-col gap-3 h-full">
                <div className="text-sm opacity-80">Edit Asset</div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm opacity-80">name</label>
                  <input
                    className="h-10 rounded px-3 bg-transparent border"
                    value={assetDraft?.name ?? ""}
                    onChange={(e) => updateDraft("name", e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!assetDraft?.is_active}
                    onChange={(e) => updateDraft("is_active", e.target.checked)}
                  />
                  <span className="text-sm">Enabled</span>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm opacity-80">Asset Type</label>
                  <Select
                    value={assetDraft?.asset_type ?? ""}
                    onValueChange={(v) => updateDraft("asset_type", v)}
                  >
                    <SelectTrigger id="asset-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent
                      className="border shadow-md"
                      style={{
                        background: "hsl(var(--panel))",
                        color: "hsl(var(--foreground))",
                      }}
                    >
                      <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                      <SelectItem value="BUSINESS_UNIT">Business Unit</SelectItem>
                      <SelectItem value="SITE">Site</SelectItem>
                      <SelectItem value="LINE">Line</SelectItem>
                      <SelectItem value="CELL">Cell</SelectItem>
                      <SelectItem value="MACHINE">Machine</SelectItem>
                      <SelectItem value="GENERIC">Generic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!assetDraft?.can_record_downtime}
                    onChange={(e) => updateDraft("can_record_downtime", e.target.checked)}
                  />
                  <span className="text-sm">Can Record Downtime</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!assetDraft?.can_run_production}
                    onChange={(e) => updateDraft("can_run_production", e.target.checked)}
                  />
                  <span className="text-sm">Can Run Production</span>
                </div>

                <div className="mt-auto pt-3 flex flex-col gap-2">
                  <Button
                    onClick={handleSaveAsset}
                    className="text-white
                      ring-1 ring-transparent
                      hover:ring-white
                      hover:ring-2
                      gap-2
                      transition
                      cursor-pointer"
                    style={{
                      borderColor: "hsl(var(--border))",
                      background: "hsl(var(--panel))",
                    }}
                    variant="outline"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </Button>

                  <Button
                    onClick={handleDeleteAsset}
                    className="
                      bg-red-600 text-white
                      hover:bg-red-600
                      ring-1 ring-transparent
                      hover:ring-white
                      hover:ring-2
                      gap-2
                      transition
                      cursor-pointer
                    "
                  >
                    <Trash className="h-4 w-4" />
                    Delete Asset
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
