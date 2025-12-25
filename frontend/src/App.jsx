import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import AppShell from "./layouts/AppShell"
import AssetsPage from "./pages/AssetsPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/assets" replace />} />
          <Route path="assets" element={<AssetsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
