import { useState, useEffect, use } from "react";
import { MCQ } from "./MCQ.jsx"
import { useApi } from "../utils/api.js";


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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="glass-card">
                <h2 style={{ marginBottom: '1rem', color: 'var(--accent-secondary)' }}>New Quiz</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Create a new quiz by selecting a topic and difficulty level. 
                    Our AI will generate unique questions for you.
                </p>

                <div className="quota-display">
            <p>Challenges remaining today: {quota?.quota_remaining || 0}</p>
            {quota?.quota_remaining === 0 && (
                <p>Next reset: {getNextResetTime()?.toLocaleString()}</p>
            )}
            </div>
            <div className="difficulty-selector">
                <label htmlFor="difficulty">Select Difficulty</label>
                <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    disabled={isLoading}
                >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </div>

            <button
                onClick={generateQuiz}
                disabled={isLoading || quota?.quota_remaining === 0}
            >
                {isLoading ? "Generating..." : "Start Generating"}
            </button>

            {error && <div className="error-message">
                <p>{error}</p>
            </div>}

            {challenge && <MCQ challenge={challenge}/>}

            </div>
        </div>
    );
}
