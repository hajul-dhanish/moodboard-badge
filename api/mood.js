export default function handler(req, res) {
  const moods = [
    { text: "Code Zen 🌙", color: "#00ffaa" },
    { text: "Debugging Reality 💡", color: "#6a5acd" },
    { text: "Lo-fi Night Flow ☕", color: "#ffb6c1" },
    { text: "Coffee Overclock ⚡", color: "#ff9900" },
    { text: "Cloud Sync Vibes 🌩️", color: "#00bfff" },
    { text: "Terminal Trance 🔮", color: "#ff69b4" },
  ];

  const mood = moods[Math.floor(Math.random() * moods.length)];

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="220" height="40">
      <rect width="220" height="40" rx="10" fill="${mood.color}" />
      <text x="110" y="25" font-size="14" text-anchor="middle" fill="#fff" font-family="monospace">${mood.text}</text>
    </svg>
  `;

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "no-cache");
  res.status(200).send(svg);
}
