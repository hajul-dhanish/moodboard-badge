export default async function handler(req, res) {
    const { username } = req.query;

    if (!username) {
        return res.status(400).send("Missing ?username parameter");
    }

    // --- Fetch GitHub activity ---
    const resp = await fetch(`https://api.github.com/users/${username}/events`);
    if (!resp.ok) {
        return res.status(resp.status).send(`GitHub API error: ${resp.statusText}`);
    }
    const events = await resp.json();

    // --- Compute metrics ---
    let commitCount = 0;
    let issueCount = 0;
    let prCount = 0;
    let fixCommits = 0;
    let featCommits = 0;
    let deleteLines = 0;
    let addLines = 0;
    let revertCommits = 0;
    let testCommits = 0;
    let docCommits = 0;
    let commentEvents = 0;
    let reviewEvents = 0;
    let repoCreateEvents = 0;
    let stars = 0;
    let forks = 0;
    const commitDays = new Set();
    const now = new Date();

    for (const e of events) {
        if (e.type === "PushEvent") {
            const commits = e.payload.commits || [];
            commitCount += commits.length;
            for (const c of commits) {
                const msg = c.message.toLowerCase();
                if (msg.includes("fix")) fixCommits++;
                if (msg.includes("feat")) featCommits++;
                if (msg.includes("revert")) revertCommits++;
                if (msg.includes("test")) testCommits++;
                if (msg.includes("doc") || msg.includes("readme")) docCommits++;
                if (msg.includes("delete")) deleteLines++;
                if (msg.includes("add") || msg.includes("create")) addLines++;
            }
            commitDays.add(new Date(e.created_at).toLocaleString("en-US", { weekday: "short" }));
        }
        if (e.type === "IssuesEvent") issueCount++;
        if (e.type === "PullRequestEvent") prCount++;
        if (e.type === "IssueCommentEvent") commentEvents++;
        if (e.type === "PullRequestReviewEvent") reviewEvents++;
        if (e.type === "CreateEvent") repoCreateEvents++;
        if (e.type === "WatchEvent") stars++;
        if (e.type === "ForkEvent") forks++;
    }

    const lastCommitDate = events.find(e => e.type === "PushEvent")?.created_at;
    const inactiveDays = lastCommitDate
        ? Math.floor((now - new Date(lastCommitDate)) / (1000 * 60 * 60 * 24))
        : 99;

    // --- Mood detection logic ---
    let mood = { emoji: "🤖", label: "Neutral Dev", color: "777777" };

    if (commitCount > 40 && inactiveDays < 1)
        mood = { emoji: "⚡", label: "In The Zone", color: "FF6F00" };
    else if (fixCommits > 5 && issueCount > 5)
        mood = { emoji: "🧩", label: "Debugging Life", color: "E67E22" };
    else if (featCommits > 8)
        mood = { emoji: "🚀", label: "Shipping Dreams", color: "00C853" };
    else if (prCount > 5)
        mood = { emoji: "🤝", label: "Collab Mode", color: "2ECC71" };
    else if (docCommits > 4)
        mood = { emoji: "📚", label: "Knowledge Curator", color: "3498DB" };
    else if (commentEvents > 10)
        mood = { emoji: "🗣️", label: "Feedback Loop", color: "F39C12" };
    else if (deleteLines > addLines)
        mood = { emoji: "🧹", label: "Refactor Monk", color: "9B59B6" };
    else if (inactiveDays > 5)
        mood = { emoji: "💤", label: "Cooldown Mode", color: "7F8C8D" };
    else if (stars > 10 || forks > 5)
        mood = { emoji: "✨", label: "Trending Wizard", color: "FFD700" };
    else if (inactiveDays < 2 && commitCount > 10)
        mood = { emoji: "🌱", label: "Phoenix Rising", color: "1ABC9C" };
    else if (commitDays.has("Sat") || commitDays.has("Sun"))
        mood = { emoji: "🌙", label: "Night Owl Dev", color: "8E44AD" };
    else if (commitDays.has("Mon") || commitDays.has("Tue"))
        mood = { emoji: "☀️", label: "Early Bird Coder", color: "F1C40F" };
    else if (issueCount > 5 && prCount > 5)
        mood = { emoji: "🧠", label: "Juggling Tasks", color: "16A085" };
    else if (featCommits > 0 && fixCommits > 0 && addLines > 500)
        mood = { emoji: "🔥", label: "Code Inferno", color: "E74C3C" };
    else if (repoCreateEvents > 2)
        mood = { emoji: "🎨", label: "Experiment Mode", color: "00BCD4" };
    else if (reviewEvents > prCount)
        mood = { emoji: "🧑‍🏫", label: "Mentor Energy", color: "8BC34A" };
    else if (inactiveDays > 3 && commitCount < 3)
        mood = { emoji: "🌫️", label: "Burnout Warning", color: "AAB7B8" };
    else if (commitCount > 5 && inactiveDays <= 3)
        mood = { emoji: "💎", label: "Flow State", color: "2E86C1" };
    else if (revertCommits > 2)
        mood = { emoji: "⏪", label: "Time Traveler", color: "C0392B" };
    else if (issueCount > 10 && fixCommits > 3)
        mood = { emoji: "🔧", label: "Bug Slayer", color: "27AE60" };
    else if (docCommits > 2)
        mood = { emoji: "🖋️", label: "Storyteller Mode", color: "D35400" };
    else if (featCommits + fixCommits > 5 && testCommits > 5)
        mood = { emoji: "🧪", label: "Testing Titan", color: "5DADE2" };
    else if (issueCount > 0 && events.some(e => e.payload?.issue?.title?.toLowerCase().includes("idea")))
        mood = { emoji: "💡", label: "Vision Architect", color: "F5B041" };
    else if (events.some(e => e.payload?.commits?.some(c => /[\u{1F300}-\u{1FAFF}]/u.test(c.message))))
        mood = { emoji: "🎭", label: "Expressive Coder", color: "FF00FF" };
    else if (commentEvents > 5 && prCount > 2)
        mood = { emoji: "💬", label: "Discussion Driven", color: "58D68D" };

    // --- Render SVG ---
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="220" height="30" role="img" aria-label="${mood.label}">
      <rect width="220" height="30" fill="#${mood.color}" rx="5"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        font-family="Segoe UI, sans-serif" font-size="14" fill="white">
        ${mood.emoji} ${mood.label}
      </text>
    </svg>
  `;

    // --- Cache & Send ---
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "s-maxage=3600");
    res.status(200).send(svg);
}
