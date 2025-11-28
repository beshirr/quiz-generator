import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { cn } from "../utils/cn";

export function MCQ({challenge, showExplanation = false}) {
    const [selectedOption, setSelectedOption] = useState(null)
    const [shouldShowExplanation, setShouldShowExplanation] = useState(showExplanation)

    const options = typeof challenge.options === "string"
        ? JSON.parse(challenge.options)
        : challenge.options

    const handleOptionSelect = (index) => {
        if (selectedOption !== null) return;
        setSelectedOption(index)
        setShouldShowExplanation(true)
    }

    const getOptionStyles = (index) => {
        if (selectedOption === null) return "hover:bg-bg-tertiary hover:border-accent-primary/50 cursor-pointer";

        if (index === challenge.correct_answer_id) {
            return "bg-green-500/10 border-green-500/50 text-green-400";
        }
        if (selectedOption === index && index !== challenge.correct_answer_id) {
            return "bg-red-500/10 border-red-500/50 text-red-400";
        }

        return "opacity-50 cursor-not-allowed";
    }

    const getIcon = (index) => {
        if (selectedOption === null) return null;
        if (index === challenge.correct_answer_id) return <CheckCircle className="w-5 h-5 text-green-400" />;
        if (selectedOption === index && index !== challenge.correct_answer_id) return <XCircle className="w-5 h-5 text-red-400" />;
        return null;
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-6"
        >
            <div className="flex items-center justify-between">
                <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium border",
                    challenge.difficulty === 'easy' && "bg-green-500/10 border-green-500/20 text-green-400",
                    challenge.difficulty === 'medium' && "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
                    challenge.difficulty === 'hard' && "bg-red-500/10 border-red-500/20 text-red-400"
                )}>
                    {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                </span>
            </div>

            <h3 className="text-xl font-semibold text-text-primary leading-relaxed">
                {challenge.title}
            </h3>

            <div className="grid gap-3">
                {options.map((option, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleOptionSelect(index)}
                        className={cn(
                            "relative p-4 rounded-xl border border-glass-border transition-all duration-300 flex items-center justify-between group",
                            getOptionStyles(index)
                        )}
                    >
                        <span className="font-medium">{option}</span>
                        {getIcon(index)}
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {shouldShowExplanation && selectedOption !== null && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 rounded-xl bg-accent-primary/10 border border-accent-primary/20 space-y-2">
                            <div className="flex items-center gap-2 text-accent-primary font-medium">
                                <AlertCircle size={18} />
                                <span>Explanation</span>
                            </div>
                            <p className="text-text-secondary text-sm leading-relaxed">
                                {challenge.explanation}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}