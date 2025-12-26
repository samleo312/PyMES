import { useMemo, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PenLine, X, Plus, Factory, Trash } from "lucide-react"

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

const demoParents = [
  { id: 1, name: "Pittsburgh", children: ["Press 1", "Press 2", "Press 3"] },
  { id: 2, name: "Dallas", children: ["Palletizer 1", "Palletizer 2"] },
  { id: 3, name: "Detroit", children: ["Blender 1"] },
  { id: 4, name: "Buffalo", children: ["Chopper 1", "Chopper 2"] },
]

function makeAsset(childName, parentId) {
  return {
    id: "", 
    name: childName,
    is_active: true,
    created_at: "",
    asset_type: "",
    can_record_downtime: false,
    can_run_production: false,
    parent_id: parentId,
  }
}

export default function AssetsPage() {
  const parents = useMemo(() => demoParents, [])
  const [isEditing, setIsEditing] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState(null)

  // Draft copy so typing edits fields without needing backend yet
  const [assetDraft, setAssetDraft] = useState(null)

  useEffect(() => {
    setAssetDraft(selectedAsset ? { ...selectedAsset } : null)
  }, [selectedAsset])

  const updateDraft = (key, value) => {
    setAssetDraft((prev) => ({ ...(prev ?? {}), [key]: value }))
  }

  const handleDeleteAsset = () => {
    if (!assetDraft) return
    console.log("delete asset", assetDraft)
    // TODO: call delete API here (assetDraft.id)

    setSelectedAsset(null)
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* MAIN AREA: tree + slide-out palette */}
      <div className="flex flex-1 min-h-0">
        {/* Tree area */}
        <div className="flex-1 min-h-0 flex flex-col">
          <Accordion
            type="multiple"
            className="w-full space-y-2 flex-1 overflow-auto"
          >
            {parents.map((p) => (
              <AccordionItem
                key={p.id}
                value={`parent-${p.id}`}
                className="rounded card"
              >
                <AccordionTrigger
                  className="px-3 w-full flex items-center justify-between"
                  onClick={() => {
                    if (!isEditing) return
                    setSelectedAsset(makeAsset(p.name, p.id))
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
                        key={child}
                        className="p-2 cursor-pointer row row-hover"
                        onClick={() => {
                          if (!isEditing) return
                          setSelectedAsset(makeAsset(child, p.id))
                        }}
                      >
                        {child}
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
                    // Optional: start a blank asset
                    setSelectedAsset({
                      id: "",
                      name: "",
                      is_active: true,
                      created_at: "",
                      asset_type: "",
                      can_record_downtime: false,
                      can_run_production: false,
                      parent_id: "",
                    })
                  }}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              )}

              <Button
                onClick={() =>
                  setIsEditing((v) => {
                    const next = !v
                    // Optional UX: leaving edit mode clears selection
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
                  <Select defaultValue="">
                    <SelectTrigger id="asset-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent 
                    className="border shadow-md"
                    style={{
                      background: "hsl(var(--panel))",
                      color: "hsl(var(--foreground))",
                    }}>
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
                    onChange={(e) =>
                      updateDraft("can_record_downtime", e.target.checked)
                    }
                  />
                  <span className="text-sm">Can Record Downtime</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!assetDraft?.can_run_production}
                    onChange={(e) =>
                      updateDraft("can_run_production", e.target.checked)
                    }
                  />
                  <span className="text-sm">Can Run Production</span>
                </div>

                {/* Bottom actions */}
                <div className="mt-auto pt-3 flex justify-center">
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
