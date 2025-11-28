import { useState, useEffect } from "react"
import { MCQ } from "../quiz/MCQ.jsx";
import { useApi } from "../utils/api.js";
import { motion } from "framer-motion";
import { History, Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "../utils/cn";

export function HistoryPanel() {
    const [history, setHistory] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const {makeRequest} = useApi()

    useEffect(() => {
        fetchHistory()
    }, [])

    const fetchHistory = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const data = await makeRequest("history")
            setHistory(data.challenges)
        } catch (e) {
            setError("Failed to load history")
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <Loader2 className="w-10 h-10 text-accent-primary animate-spin" />
                <p className="text-text-secondary animate-pulse">Loading history...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <div className="p-4 rounded-full bg-red-500/10 text-red-400">
                    <AlertTriangle size={32} />
                </div>
                <p className="text-red-400 font-medium">{error}</p>
                <button 
                    onClick={fetchHistory}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary transition-colors"
                >
                    <RefreshCw size={16} />
                    <span>Retry</span>
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
            >
                <div className="p-3 rounded-xl bg-accent-primary/10 text-accent-primary">
                    <History size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Quiz History</h1>
                    <p className="text-text-secondary">Review your past challenges and explanations</p>
                </div>
            </motion.div>

            {history.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 glass-panel rounded-2xl"
                >
                    <p className="text-text-tertiary text-lg">No challenge history found</p>
                </motion.div>
            ) : (
                <div className="space-y-6">
                    {history.map((challenge, index) => (
                        <motion.div
                            key={challenge.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-panel p-6 rounded-2xl border border-glass-border hover:border-accent-primary/30 transition-colors"
                        >
                            <MCQ
                                challenge={challenge}
                                showExplanation
                            />
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}