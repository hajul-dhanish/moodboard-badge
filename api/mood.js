export default function handler(req, res) {
    const moods = [
        { emoji: "🔥", label: "On Fire", color: "FF5733" },
        { emoji: "💻", label: "In The Zone", color: "00A8E8" },
        { emoji: "☕", label: "Caffeinated", color: "6f42c1" },
        { emoji: "🧠", label: "Deep Thinking", color: "FFB400" },
        { emoji: "🎧", label: "Lo-Fi Coding", color: "2ECC71" },
    ];

    const random = moods[Math.floor(Math.random() * moods.length)];

    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="180" height="30" role="img" aria-label="Dev Mood: ${random.label}">
      <rect width="180" height="30" fill="#${random.color}" rx="5"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="14" fill="white">
        ${random.emoji} ${random.label}
      </text>
    </svg>
  `;

    res.setHeader("Content-Type", "image/svg+xml");
    res.status(200).send(svg);
}
