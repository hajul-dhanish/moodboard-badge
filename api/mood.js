import { getMood } from "../lib/moodEngine.js";

/**
 * Dynamic GitHub mood analyzer API
 * Example: /api/mood?username=hajul-dhanish
 */
export default async function handler(req, res) {
    try {
        const username = req.query.username;

        if (!username) {
            return res
                .status(400)
                .json({ error: "Missing ?username parameter in the query" });
        }

        // --- 1️⃣ Fetch user's public events from GitHub API
        const eventsRes = await fetch(`https://api.github.com/users/${username}/events/public`, {
            headers: { "User-Agent": "moodboard-badge" },
        });

        if (!eventsRes.ok) {
            throw new Error(`GitHub API error: ${eventsRes.status}`);
        }

        const events = await eventsRes.json();

        // --- 2️⃣ Extract commit-related activity
        const pushEvents = events.filter((e) => e.type === "PushEvent");
        const issueEvents = events.filter((e) => e.type.includes("Issue"));
        const prEvents = events.filter((e) => e.type.includes("PullRequest"));

        const commitMessages = pushEvents.flatMap((e) =>
            e.payload.commits?.map((c) => c.message) || []
        );

        // --- 3️⃣ Build activity summary
        const stats = {
            totalCommits: commitMessages.length,
            recentCommits: pushEvents.length,
            issuesOpened: events.filter((e) => e.type === "IssuesEvent" && e.payload.action === "opened").length,
            issuesClosed: events.filter((e) => e.type === "IssuesEvent" && e.payload.action === "closed").length,
            prOpened: events.filter((e) => e.type === "PullRequestEvent" && e.payload.action === "opened").length,
            prMerged: events.filter((e) => e.type === "PullRequestEvent" && e.payload.action === "closed").length,
            commitMessages,
        };

        // --- 4️⃣ Get mood dynamically from your smart engine
        const mood = getMood(stats);

        // --- 5️⃣ Return as clean JSON
        return res.status(200).json({
            username,
            mood: mood.mood,
            emoji: mood.emoji,
            color: mood.color,
            score: mood.score,
            stats,
        });
    } catch (error) {
        console.error("Error generating mood:", error);
        return res.status(500).json({ error: "Failed to generate mood", details: error.message });
    }
}
