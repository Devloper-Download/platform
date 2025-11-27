import { Trash2, Moon, Sun, Monitor, Github } from "lucide-react"
import { useTheme } from "../lib/theme"
import { deleteDB } from "idb"

export default function SettingsPage() {
    const { theme, setTheme } = useTheme()

    const handleClearData = async () => {
        if (confirm("Are you sure you want to delete all local data? This includes saved diagrams and settings. This action cannot be undone.")) {
            try {
                await deleteDB("localfirst-dev-studio")
                localStorage.clear()
                window.location.reload()
            } catch (err) {
                alert("Failed to clear data: " + (err as Error).message)
            }
        }
    }

    return (
        <div className="container mx-auto max-w-2xl p-8">
            <h1 className="text-3xl font-bold mb-8">Settings</h1>

            <div className="space-y-8">
                {/* Appearance */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold border-b border-border pb-2">Appearance</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <button
                            onClick={() => setTheme("light")}
                            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${theme === "light" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                                }`}
                        >
                            <Sun className="w-6 h-6" />
                            <span className="font-medium">Light</span>
                        </button>
                        <button
                            onClick={() => setTheme("dark")}
                            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${theme === "dark" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                                }`}
                        >
                            <Moon className="w-6 h-6" />
                            <span className="font-medium">Dark</span>
                        </button>
                        <button
                            onClick={() => setTheme("system")}
                            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${theme === "system" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                                }`}
                        >
                            <Monitor className="w-6 h-6" />
                            <span className="font-medium">System</span>
                        </button>
                    </div>
                </section>

                {/* Data Management */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold border-b border-border pb-2">Data Management</h2>
                    <div className="p-4 rounded-lg border border-destructive/20 bg-destructive/5 space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-destructive/10 rounded-full text-destructive">
                                <Trash2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-medium text-destructive">Clear All Local Data</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    This will remove all saved diagrams, settings, and cached data from your browser.
                                    This action is irreversible.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClearData}
                            className="w-full py-2 px-4 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors font-medium"
                        >
                            Delete All Data
                        </button>
                    </div>
                </section>

                {/* About */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold border-b border-border pb-2">About</h2>
                    <div className="text-sm text-muted-foreground space-y-2">
                        <p>
                            <strong>LocalFirst Dev Studio</strong> v1.0.0
                        </p>
                        <p>
                            Built with React, Vite, Tailwind CSS, sql.js, and React Flow using Antigravity.
                        </p>
                        <p>
                            <a href="https://github.com/Devloper-Download" className="inline-flex items-center gap-2 text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                                <Github className="w-5 h-5" />
                            </a>
                        </p>
                    </div>
                </section>
            </div>
        </div>
    )
}
