// src/layouts/AppShell.tsx
import { Outlet, NavLink, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Boxes, ListTree, ClipboardList, Settings } from "lucide-react"

function TopRightTitle() {
  const { pathname } = useLocation()
  if (pathname.startsWith("/orders")) return "Orders"
  return "Assets"
}

export default function AppShell() {
  return (
    <div className="dark h-screen flex flex-col">
      {/* HEADER */}
      <header
        className="h-14 flex items-center justify-between px-4 border-b"
        style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--panel))" }}
      >
        <div className="flex items-center gap-2">
          <Boxes className="h-5 w-5" />
          <div className="font-semibold">PyMES</div>
        </div>

        <div className="text-sm muted">
          <TopRightTitle />
        </div>
      </header>

      {/* BODY */}
      <div className="flex flex-1 min-h-0">
        {/* NAV */}
        <nav
          className="w-56 p-3 flex flex-col gap-2 border-r"
          style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--panel))" }}
        >
          <div className="text-xs font-semibold muted px-2">Navigation</div>

          <Button asChild variant="ghost" className="justify-start gap-2 hover:ring-2 hover:ring-white">
            <NavLink to="/assets">
              <ListTree className="h-4 w-4" />
              Asset Tree
            </NavLink>
          </Button>

          <Button asChild variant="ghost" className="justify-start gap-2 hover:ring-2 hover:ring-white">
            <NavLink to="/orders">
              <ClipboardList className="h-4 w-4" />
              Orders
            </NavLink>
          </Button>

          <Separator className="my-2" />

          <Button asChild variant="ghost" className="justify-start gap-2 mt-auto hover:ring-2 hover:ring-white">
            <NavLink to="/settings">
              <Settings className="h-4 w-4" />
              Settings
            </NavLink>
          </Button>
        </nav>

        <main className="flex-1 min-h-0 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
