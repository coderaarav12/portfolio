// Builds data/github-snapshot.json — a full year of daily commit counts for
// USERNAME across their public non-fork repos. Runs in GitHub Actions (uses
// the workflow's GITHUB_TOKEN, no setup required) and locally (unauthenticated).
// The worker bundles this snapshot and overlays recent public push events.

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const USERNAME = "coderaarav12";
const YEAR_DAYS = 366;

const token = process.env.GITHUB_TOKEN;
const HEADERS = {
  Accept: "application/vnd.github+json",
  "User-Agent": "portfolio-snapshot",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

async function gh(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function ghList(url, maxPages = 30) {
  const out = [];
  for (let page = 1; page <= maxPages; page++) {
    const sep = url.includes("?") ? "&" : "?";
    const items = await gh(`${url}${sep}per_page=100&page=${page}`);
    if (!Array.isArray(items) || items.length === 0) break;
    out.push(...items);
    if (items.length < 100) break;
  }
  return out;
}

const repos = await ghList(`https://api.github.com/users/${USERNAME}/repos`);
const targets = repos.filter((r) => !r.fork).map((r) => r.name);
console.log(`repos scanned: ${targets.length} (non-fork)`);

const profile = await gh(`https://api.github.com/users/${USERNAME}`);
const stars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
const userStats = {
  repos: profile.public_repos ?? targets.length,
  followers: profile.followers ?? 0,
  stars,
};
console.log(`profile: ${userStats.repos} repos, ${userStats.followers} followers, ${userStats.stars} stars`);

const since = new Date(Date.now() - YEAR_DAYS * 86400000).toISOString();
const counts = new Map();

for (const repo of targets) {
  try {
    const commits = await ghList(
      `https://api.github.com/repos/${USERNAME}/${repo}/commits?author=${USERNAME}&since=${since}`
    );
    for (const c of commits) {
      const d = c?.commit?.author?.date?.slice(0, 10);
      if (!d) continue;
      counts.set(d, (counts.get(d) || 0) + 1);
    }
    console.log(`${repo}: ${commits.length} commits`);
  } catch (e) {
    console.warn(`skip ${repo}: ${e.message}`);
  }
}

const todayUtc = new Date().toISOString().slice(0, 10);
const todayMs = Date.UTC(...todayUtc.split("-").map((v, i) => (i === 1 ? v - 1 : +v)));
const startMs = todayMs - (YEAR_DAYS - 1) * 86400000;
const startSunday = startMs - new Date(startMs).getUTCDay() * 86400000;

const days = [];
let total = 0;
for (let t = startSunday; t <= todayMs; t += 86400000) {
  const key = new Date(t).toISOString().slice(0, 10);
  const n = counts.get(key) || 0;
  total += n;
  days.push({ date: key, count: n });
}

const out = {
  generated_at: new Date().toISOString(),
  source: "commits-snapshot",
  user: USERNAME,
  user_stats: userStats,
  total,
  days,
};

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "data");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "github-snapshot.json"), JSON.stringify(out));
console.log(`snapshot written: ${days.length} days, total ${total} commits`);
