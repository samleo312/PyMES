import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import AssetsPage from "./pages/AssetsPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/assets" replace />} />
        <Route path="/assets" element={<AssetsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
