import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./lib/theme"
import Layout from "./components/Layout"
import DbViewerPage from "./features/db-viewer/DbViewerPage"
// import SystemDesignPage from "./features/system-design/SystemDesignPage"
import SettingsPage from "./pages/SettingsPage"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<DbViewerPage />} />
            {/* <Route path="/system-design" element={<SystemDesignPage />} /> */}
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
