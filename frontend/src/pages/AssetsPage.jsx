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
  )
}
