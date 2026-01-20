import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import Otp from "./pages/Otp"
import Dashboard from "./pages/Dashboard"
import Logs from "./pages/Logs"
import Settings from "./pages/Settings"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  )
}



