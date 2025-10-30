import Sentiment from "sentiment";

const sentiment = new Sentiment();

/**
 * AI-like mood engine — computes dev "mood" from GitHub activity
 * without if-else logic.
 */
export function getMood(stats) {
    const weights = {
        activity: 0.4,
        sentiment: 0.3,
        focus: 0.3,
    };

    // --- ACTIVITY SCORE (Commit + Issue Energy)
    const activityScore =
        Math.min(stats.recentCommits / 10, 1) * 0.6 +
        Math.min(stats.issuesClosed / 5, 1) * 0.4;

    // --- SENTIMENT SCORE (Commit message tone)
    const sentiments = stats.commitMessages.map((msg) => sentiment.analyze(msg).score);
    const avgSentiment =
        sentiments.length > 0 ? sentiments.reduce((a, b) => a + b) / sentiments.length : 0;
    const sentimentScore = Math.min(Math.max((avgSentiment + 5) / 10, 0), 1); // normalize 0–1

    // --- FOCUS SCORE (Bug-fixing vs feature work)
    const fixCount = stats.commitMessages.filter((msg) =>
        msg.toLowerCase().includes("fix")
    ).length;
    const focusScore = stats.recentCommits
        ? Math.min(fixCount / stats.recentCommits, 1)
        : 0;

    // --- OVERALL MOOD INDEX
    const moodIndex =
        weights.activity * activityScore +
        weights.sentiment * sentimentScore +
        weights.focus * focusScore;

    // --- MOOD PROFILES (Data-driven)
    const moodProfiles = [
        { min: 0.0, max: 0.1, mood: "Exhausted", emoji: "😴", color: "#6b7280" },
        { min: 0.1, max: 0.2, mood: "Overloaded", emoji: "💥", color: "#ef4444" },
        { min: 0.2, max: 0.3, mood: "Debugging Mode", emoji: "🪲", color: "#b91c1c" },
        { min: 0.3, max: 0.4, mood: "In The Zone", emoji: "🎧", color: "#4b5563" },
        { min: 0.4, max: 0.45, mood: "Calm & Focused", emoji: "🍃", color: "#22c55e" },
        { min: 0.45, max: 0.5, mood: "Thoughtful", emoji: "🤔", color: "#a78bfa" },
        { min: 0.5, max: 0.55, mood: "Balanced", emoji: "⚖️", color: "#14b8a6" },
        { min: 0.55, max: 0.6, mood: "Curious", emoji: "🔍", color: "#3b82f6" },
        { min: 0.6, max: 0.65, mood: "Collaborative", emoji: "🤝", color: "#f59e0b" },
        { min: 0.65, max: 0.7, mood: "Productive", emoji: "🚀", color: "#2563eb" },
        { min: 0.7, max: 0.75, mood: "Creative Flow", emoji: "🌈", color: "#8b5cf6" },
        { min: 0.75, max: 0.8, mood: "Innovative", emoji: "🧠", color: "#6366f1" },
        { min: 0.8, max: 0.85, mood: "Inspired", emoji: "🔥", color: "#f97316" },
        { min: 0.85, max: 0.9, mood: "Peaceful", emoji: "🌙", color: "#0ea5e9" },
        { min: 0.9, max: 0.95, mood: "Legendary", emoji: "🏆", color: "#eab308" },
        { min: 0.95, max: 1.0, mood: "Transcendent", emoji: "🪐", color: "#a855f7" },
    ];

    const matched =
        moodProfiles.find((m) => moodIndex >= m.min && moodIndex < m.max) ||
        { mood: "Undefined", emoji: "❓", color: "#9ca3af" };

    return { ...matched, score: moodIndex.toFixed(2) };
}
