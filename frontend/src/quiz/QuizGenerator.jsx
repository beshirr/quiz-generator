import { useState, useEffect } from "react";
import { MCQ } from "./MCQ.jsx"
import { useApi } from "../utils/api.js";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "../utils/cn";

export function QuizGenerator() {
    const [challenge, setChallenge] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [difficulty, setDifficulty] = useState("easy");
    const [quota, setQuota] = useState(null);
    const { makeRequest } = useApi();

    useEffect( () => {
        fetchQuota();
    }, [])

    const fetchQuota = async () => {
        try {
            const data = await makeRequest("quota")
            setQuota(data);
        } catch(e) {
            console.log(e);
        }
    }

    const generateQuiz = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await makeRequest("generate", {
                method: "POST", 
                body: JSON.stringify({difficulty})
            })
            setChallenge(data);
            fetchQuota();
        } catch (e) {
            setError(e.message || "Failed to generate quiz");
        } finally {
            setIsLoading(false);
        }
    }

    const getNextResetTime = () => {
        if (!quota?.last_reset_data) return null
        const resetDate = new Date(quota.last_reset_data)
        resetDate.setHours(resetDate.getHours() + 24)
        return resetDate
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/70 text-glow">
                    AI Quiz Generator
                </h1>
                <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                    Generate unique quizzes instantly powered by advanced AI. Test your knowledge across various topics and difficulties.
                </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Quota Card */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 rounded-2xl space-y-4"
                >
                    <div className="flex items-center gap-3 text-accent-primary">
                        <div className="p-2 rounded-lg bg-accent-primary/10">
                            <Sparkles size={24} />
                        </div>
                        <h3 className="font-semibold text-lg text-white">Daily Quota</h3>
                    </div>
                    <div className="space-y-1">
                        <div className="text-3xl font-bold text-white">
                            {quota?.quota_remaining || 0}
                            <span className="text-sm font-normal text-text-tertiary ml-2">left</span>
                        </div>
                        {quota?.quota_remaining === 0 && (
                            <div className="flex items-center gap-2 text-xs text-text-tertiary">
                                <Clock size={12} />
                                <span>Reset: {getNextResetTime()?.toLocaleTimeString()}</span>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Generator Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="md:col-span-2 glass-card p-6 rounded-2xl space-y-6"
                >
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-text-secondary">
                            Select Difficulty
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {['easy', 'medium', 'hard'].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setDifficulty(level)}
                                    disabled={isLoading}
                                    className={cn(
                                        "px-4 py-3 rounded-xl border transition-all duration-300 capitalize font-medium",
                                        difficulty === level 
                                            ? "bg-accent-primary/20 border-accent-primary text-white shadow-[0_0_15px_rgba(38,78,80,0.3)]" 
                                            : "bg-bg-tertiary/50 border-glass-border text-text-secondary hover:bg-bg-tertiary hover:text-white"
                                    )}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={generateQuiz}
                        disabled={isLoading || quota?.quota_remaining === 0}
                        className={cn(
                            "w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2",
                            isLoading || quota?.quota_remaining === 0
                                ? "bg-bg-tertiary text-text-tertiary cursor-not-allowed"
                                : "bg-accent-primary text-white hover:bg-accent-primary/80 shadow-glow hover:scale-[1.02]"
                        )}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" />
                                <span>Generating Quiz...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles />
                                <span>Generate Quiz</span>
                            </>
                        )}
                    </button>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400"
                        >
                            <AlertTriangle size={20} />
                            <p>{error}</p>
                        </motion.div>
                    )}
                </motion.div>
            </div>

            {/* Quiz Display */}
            <AnimatePresence mode="wait">
                {challenge && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        className="glass-panel p-8 rounded-2xl border border-glass-border"
                    >
                        <MCQ challenge={challenge}/>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

