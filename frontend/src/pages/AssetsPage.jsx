import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Boxes, ListTree, ClipboardList, Settings } from "lucide-react"

// TEMP demo data — replace with API later
const demoParents = [
  { id: 1, name: "Press", children: ["Press 103", "Press 104", "Press 105"] },
  { id: 2, name: "Lam", children: ["Lam 124", "Lam 125"] },
  { id: 3, name: "Slit", children: ["SRC 139"] },
  { id: 4, name: "Bag", children: ["Elba 1", "Elba 2"] },
]

export default function AssetsPage() {
  const [selectedNode, setSelectedNode] = useState("Plant 1")
  const parents = useMemo(() => demoParents, [])

  return (
    <div className="dark h-screen flex flex-col">
      {/* HEADER */}
      <header className="h-14 flex items-center justify-between px-4 border-b"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--panel))" }}>
        <div className="flex items-center gap-2">
          <Boxes className="h-5 w-5" />
          <div className="font-semibold">PyMES</div>
        </div>

        <div className="text-sm muted">
          Assets<span style={{ color: "hsl(var(--foreground))" }} className="font-medium">
          </span>
        </div>
      </header>

      {/* BODY: left nav + main */}
      <div className="flex flex-1 min-h-0">
        {/* STATIC NAV BAR */}
        <nav className="w-56 p-3 flex flex-col gap-2 border-r"
             style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--panel))" }}>
          <div className="text-xs font-semibold muted px-2">
            Navigation
          </div>

          <Button variant="ghost" className="justify-start gap-2 hover:ring-2 hover:ring-white">
            <ListTree className="h-4 w-4" />
            Asset Tree
          </Button>

          <Button variant="ghost" className="justify-start gap-2 hover:ring-2 hover:ring-white">
            <ClipboardList className="h-4 w-4" />
            Orders
          </Button>

          <Separator className="my-2" />

          <Button variant="ghost" className="justify-start gap-2 mt-auto hover:ring-2 hover:ring-white">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </nav>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-h-0 overflow-auto p-4">
          <Accordion type="multiple" className="w-full space-y-2">
            {parents.map((p) => (
              <AccordionItem
                key={p.id}
                value={`parent-${p.id}`}
                className="rounded card"
              >
                <AccordionTrigger className="px-3">
                  {p.name}
                </AccordionTrigger>

                <AccordionContent className="px-3 pb-3">
                  <div className="space-y-2">
                    {p.children.map((child) => (
                      <div
                        key={child}
                        className="p-2 cursor-pointer row row-hover"
                        onClick={() => console.log("select child", child)}
                      >
                        {child}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </main>
      </div>
    </div>
  )
}
