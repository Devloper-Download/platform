import { Link } from "react-router-dom"
import { Database, Shield, WifiOff, Zap } from "lucide-react"

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Hero Section */}
            <section className="flex-1 flex flex-col items-center justify-center text-center p-8 md:p-16 bg-gradient-to-b from-background to-secondary/20">
                <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        v1.0 Now Available
                    </div>

                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Privacy-first SQLite Database Viewer in Your Browser. <br />
                        <span className="text-foreground font-medium">Offline-capable. No servers. No tracking.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                        <Link
                            to="/db-viewer"
                            className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all hover:scale-105 font-medium shadow-lg shadow-primary/25 w-full sm:w-auto"
                        >
                            <Database className="w-5 h-5" />
                            Open DB Viewer
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-16 px-4 bg-card/30 border-t border-border">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 text-blue-500">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">100% Local & Private</h3>
                            <p className="text-muted-foreground">
                                Your data never leaves your browser. We process everything locally using WASM. No tracking, no API calls.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
                            <div className="w-12 h-12 bg-violet-500/10 rounded-lg flex items-center justify-center mb-4 text-violet-500">
                                <WifiOff className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Works Offline</h3>
                            <p className="text-muted-foreground">
                                Install as a PWA and use it without an internet connection. Perfect for working on the go or in secure environments.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
                            <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4 text-amber-500">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Instant Performance</h3>
                            <p className="text-muted-foreground">
                                Built with Vite, React, and WASM for near-native performance. Handle large SQLite files smoothly.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
