# 🎭 Moodboard Badge

> *"Your code speaks. This badge listens."*  
> An AI-powered GitHub badge that changes its **mood** based on your real-time coding activity.  
> It reads your commits, issues, PRs, and more — then displays your current developer vibe as a live SVG.

---

## 🌈 Live Demo

🔗 **[moodboard-badge.vercel.app](https://moodboard-badge.vercel.app/api/mood?username=hajul-dhanish)**  
Paste your own username at the end to see your unique mood:

```md
![Dev Mood](https://moodboard-badge.vercel.app/api/mood?username=YOUR_GITHUB_USERNAME)
```

---

## 🧠 What It Does

This project fetches your **recent GitHub activity** and uses heuristics to determine your current *mood* as a developer.  
The badge then updates automatically based on your coding behavior.

| Situation | Mood ||
|------------|------|-------|
| You’re shipping lots of features | 🚀 Shipping Dreams |
| Fixing bugs like a champ | 🧩 Debugging Life |
| Refactoring and cleaning up | 🧹 Refactor Monk |
| Writing documentation | 📚 Knowledge Curator |
| Taking a break | 💤 Cooldown Mode |
| Getting stars & forks | ✨ Trending Wizard |
| Pushing daily | ⚡ In The Zone |
| Reviewing PRs | 🧑‍🏫 Mentor Energy |
| Late-night commits | 🌙 Night Owl Dev |
| And 15+ more dynamic moods… | 🎭 ... |

---

## ⚙️ How It Works

1. **Fetches public GitHub events** via  
   `https://api.github.com/users/{username}/events`
2. **Analyzes activity patterns** — commits, PRs, issues, etc.
3. **Maps to a mood** based on 25 unique behavior rules
4. **Renders an SVG badge** that updates live when viewed

---

## 💻 Tech Stack

- 🟢 **Node.js** (serverless API)
- ☁️ **Vercel Functions** (deployment)
- 🔍 **GitHub REST API**
- 🎨 **Dynamic SVG Rendering**
- 🧩 **Modern ESM Modules**

---
## 🧩 Example README Usage

You can embed this in your GitHub profile’s README like this:

```md
### 💫 Current Dev Mood
![Dev Mood](https://moodboard-badge.vercel.app/api/mood?username=hajul-dhanish)
```

This SVG will automatically update as your GitHub activity evolves.

---

## 🔮 Roadmap

- [ ] Add `?theme=` support (`dark`, `neon`, `github`)
- [ ] Add emoji-based animations
- [ ] Add personalized mood explanations
- [ ] Display last mood change timestamp
- [ ] Optional caching via Supabase / Redis

---

## 🤝 Contributing

Pull requests welcome!  
Want to add a new mood or tweak the logic?  
Just drop a PR with a new case under `/api/mood.js`.

---

## 🪩 License

MIT — open-source, remix it however you like.  
Just don’t forget to vibe-credit the original.
