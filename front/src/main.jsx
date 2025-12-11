// front/src/main.jsx
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import './index.css'

import Header from "./layout/Header"
import Login from "./page/auth/login"
import Register from "./page/auth/register"
import Home from "./page/home" // ← page de redirection intelligente


import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

// Configuration React Query (tu peux ajuster plus tard)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Page d'accueil = redirection intelligente */}
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />

        {/* Dashboards protégés */}
        

        {/* 404 fallback (optionnel) */}
        <Route path="*" element={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-800">404</h1>
              <p className="text-xl text-gray-600 mt-4">Page non trouvée</p>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>

    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
)