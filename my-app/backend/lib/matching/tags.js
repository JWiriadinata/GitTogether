// Canonical tag normalization for matching fields.
// Every write path (user skills/interests/roles, later project techStack/rolesNeeded)
// should run through normalizeTags so "JS", " js " and "JavaScript" all become "javascript".

const MAX_TAGS = 20;
const MAX_TAG_LENGTH = 40;

const ALIASES = {
  js: "javascript",
  javascript: "javascript",
  node: "nodejs",
  "node.js": "nodejs",
  nodejs: "nodejs",
  ts: "typescript",
  "react.js": "react",
  reactjs: "react",
  react: "react",
  "react native": "react-native",
  "next.js": "nextjs",
  next: "nextjs",
  vue: "vue",
  "vue.js": "vue",
  mongo: "mongodb",
  mongodb: "mongodb",
  postgres: "postgresql",
  psql: "postgresql",
  "c++": "cpp",
  "c#": "csharp",
  "ui/ux": "ui-designer",
  ui: "ui-designer",
  "ui designer": "ui-designer",
  "ux designer": "ui-designer",
  "front end": "frontend",
  "front-end": "frontend",
  "frontend dev": "frontend",
  "frontend developer": "frontend",
  frontend: "frontend",
  "back end": "backend",
  "back-end": "backend",
  "backend dev": "backend",
  "backend developer": "backend",
  backend: "backend",
  "full stack": "fullstack",
  "full-stack": "fullstack",
  ml: "machine-learning",
  "ai/ml": "machine-learning",
  "machine learning": "machine-learning",
  "web dev": "web-development",
  "web development": "web-development",
};

// Returns the canonical lowercase tag, or null for empty / non-string input.
function normalizeTag(raw) {
  if (typeof raw !== "string") return null;

  // Check aliases before stripping "/" so entries like "ui/ux" and "ai/ml" still match.
  const lower = raw.trim().toLowerCase().replace(/\s+/g, " ");
  if (!lower) return null;
  if (ALIASES[lower]) return ALIASES[lower];

  const key = lower.replace(/[_/]+/g, " ").replace(/\s+/g, " ").trim();
  if (!key) return null;
  return ALIASES[key] || key.replace(/ /g, "-");
}

// Normalizes, drops empties and de-duplicates while keeping the user's order.
function normalizeTags(arr) {
  const out = [];
  const seen = new Set();
  for (const item of Array.isArray(arr) ? arr : []) {
    const tag = normalizeTag(item);
    if (tag && !seen.has(tag)) {
      seen.add(tag);
      out.push(tag);
    }
  }
  return out;
}

module.exports = { ALIASES, MAX_TAGS, MAX_TAG_LENGTH, normalizeTag, normalizeTags };
