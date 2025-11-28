import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link, Outlet, Navigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, History, Menu, X, LogIn } from "lucide-react";
import { useState } from "react";
import { cn } from "../utils/cn";

const SidebarItem = ({ to, icon: Icon, label, active, collapsed }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 group relative overflow-hidden",
      active 
        ? "bg-accent-primary/20 text-accent-primary shadow-[0_0_15px_rgba(38,78,80,0.3)]" 
        : "text-text-secondary hover:text-text-primary hover:bg-white/5"
    )}
  >
    <Icon size={20} className={cn("transition-transform duration-300", active && "scale-110")} />
    <AnimatePresence mode="wait">
      {!collapsed && (
        <motion.span
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          exit={{ opacity: 0, width: 0 }}
          className="font-medium whitespace-nowrap"
        >
          {label}
        </motion.span>
      )}
    </AnimatePresence>
    {active && (
      <motion.div
        layoutId="active-nav"
        className="absolute inset-0 bg-accent-primary/10 border-l-2 border-accent-primary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
    )}
  </Link>
);

export function Layout() {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    
    return (
        <div className="flex min-h-screen bg-bg-primary text-text-primary overflow-hidden selection:bg-accent-primary/30">
            {/* Background Glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-primary/20 rounded-full blur-[120px] opacity-30" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent-secondary/20 rounded-full blur-[120px] opacity-30" />
            </div>

            <SignedIn>
                <motion.aside 
                    initial={{ width: 240 }}
                    animate={{ width: collapsed ? 80 : 240 }}
                    className="relative z-20 flex flex-col h-screen glass-panel border-r border-glass-border"
                >
                    <div className="p-4 flex items-center justify-between">
                        <AnimatePresence mode="wait">
                            {!collapsed && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shadow-glow">
                                        <span className="font-bold text-white">Q</span>
                                    </div>
                                    <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                                        QuizGen
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <button 
                            onClick={() => setCollapsed(!collapsed)}
                            className="p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-white transition-colors"
                        >
                            {collapsed ? <Menu size={20} /> : <X size={20} />}
                        </button>
                    </div>

                    <nav className="flex-1 px-2 py-4 space-y-2">
                        <SidebarItem 
                            to="/" 
                            icon={LayoutDashboard} 
                            label="Generator" 
                            active={location.pathname === '/'} 
                            collapsed={collapsed}
                        />
                        <SidebarItem 
                            to="/history" 
                            icon={History} 
                            label="History" 
                            active={location.pathname === '/history'} 
                            collapsed={collapsed}
                        />
                    </nav>

                    <div className="p-4 border-t border-glass-border">
                        <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "")}>
                            <UserButton 
                                appearance={{
                                    elements: {
                                        avatarBox: "w-9 h-9 ring-2 ring-glass-border hover:ring-accent-primary transition-all duration-300",
                                        userButtonPopoverCard: "bg-bg-secondary border border-glass-border shadow-glass",
                                        userButtonTrigger: "focus:shadow-none"
                                    }
                                }}
                            />
                            {!collapsed && (
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-text-primary">Account</span>
                                    <span className="text-xs text-text-tertiary">Manage settings</span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.aside>
            </SignedIn>

            <main className="flex-1 relative z-10 overflow-y-auto h-screen scrollbar-hide">
                <div className="container mx-auto p-6 max-w-7xl">
                    <SignedIn>
                        <Outlet />
                    </SignedIn>
                    <SignedOut>
                        <div className="flex items-center justify-center h-full min-h-[80vh]">
                            <div className="glass-panel p-8 rounded-2xl max-w-md w-full text-center space-y-6">
                                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shadow-glow mb-6">
                                    <span className="font-bold text-3xl text-white">Q</span>
                                </div>
                                <h1 className="text-3xl font-bold text-white">Welcome to QuizGen</h1>
                                <p className="text-text-secondary">
                                    Create AI-powered quizzes in seconds. Join thousands of students and teachers enhancing their learning experience.
                                </p>
                                <Link 
                                    to="/sign-in" 
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-primary hover:bg-accent-primary/80 text-white font-medium transition-all duration-300 shadow-glow hover:scale-105"
                                >
                                    <LogIn size={20} />
                                    <span>Sign In to Continue</span>
                                </Link>
                            </div>
                        </div>
                    </SignedOut>
                </div>
            </main>
        </div>
    );
}

