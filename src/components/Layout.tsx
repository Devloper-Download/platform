import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Database, Settings, Moon, Sun, Menu, X } from "lucide-react"
import { useTheme } from "../lib/theme"
import { cn } from "../lib/utils"

export default function Layout({ children }: { children: React.ReactNode }) {
    const { theme, setTheme } = useTheme()
    const location = useLocation()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const navItems = [
        { href: "/", label: "DB Viewer", icon: Database },
        { href: "/settings", label: "Settings", icon: Settings },
    ]

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    return (
        <div className="h-full bg-background text-foreground flex flex-col transition-colors duration-300">
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">


                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = location.pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium",
                                        isActive
                                            ? "bg-secondary text-secondary-foreground shadow-sm"
                                            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            )
                        })}
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="ml-2 p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={toggleMenu}
                            className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-border bg-card p-4 absolute w-full z-50 shadow-lg animate-in slide-in-from-top-2">
                        <nav className="flex flex-col gap-2">
                            {navItems.map((item) => {
                                const Icon = item.icon
                                const isActive = location.pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        to={item.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 text-base font-medium",
                                            isActive
                                                ? "bg-secondary text-secondary-foreground shadow-sm"
                                                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                                        )}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {item.label}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>
                )}
            </header>

            <main className="flex-1 flex flex-col relative overflow-hidden">
                {children}
            </main>

            <footer className="border-t border-border py-4 text-center text-sm text-muted-foreground bg-card/30">
                <p>
                    Built with 💖 using <a href="https://antigravity.google" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Antigravity</a>
                </p>
            </footer>
        </div>
    )
}
