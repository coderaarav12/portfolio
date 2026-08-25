// Aarav Goel — portfolio worker
// Serves static site assets + self-hosted GitHub contribution widgets.
//   /github/calendar.svg : itsjustmatrix-style contribution calendar heatmap
//   /github/graph.svg    : matching animated activity graph
// Data comes straight from GitHub (GraphQL when GITHUB_TOKEN secret is set,
// otherwise public push events) — no third-party widget services.

const USERNAME = "coderaarav12";
const TZ = "Asia/Kolkata";

import snapshot from "./data/github-snapshot.json" with { type: "json" };

const CELL = 11;
const GAP = 3;
const STEP = CELL + GAP;
const TOP = 21;
const GRID_H = STEP * 7 - GAP;
const FOOTER_GAP = 26;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MON_FONT = "'JetBrains Mono','Cascadia Code','SF Mono',Consolas,Menlo,monospace";

const THEMES = {
  dark: {
    empty: "#1f242b",
    ramp: ["#525252", "#8c8c8c", "#a7a7a7", "#ebebeb"],
    ink: "#e6edf3",
    muted: "#8b949e",
    accent: "#34d399",
    today: "#34d399",
    grid: "rgba(255,255,255,0.06)",
  },
  light: {
    empty: "#ece3d2",
    ramp: ["#d9c5a4", "#bea176", "#98764f", "#6e5138", "#2b2118"].slice(0, 4),
    ink: "#2b2118",
    muted: "#8a7a66",
    accent: "#98764f",
    today: "#98764f",
    grid: "rgba(43,33,24,0.08)",
  },
  emerald: {
    empty: "#152019",
    ramp: ["#1e5c41", "#2f9d63", "#4ade80", "#a7f3d0"],
    ink: "#d1fae5",
    muted: "#7ca88f",
    accent: "#34d399",
    today: "#34d399",
    grid: "rgba(110,231,183,0.10)",
  },
};

const memCache = new Map(); // key -> { t, data }
const MEM_TTL = 30 * 60 * 1000;
const CACHE_CONTROL =
  "public, max-age=1800, s-maxage=21600, stale-while-revalidate=86400";

/* ---------------- date helpers ---------------- */

function utcDay(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

function dayKey(ms) {
  return new Date(ms).toISOString().slice(0, 10);
}

function niceDate(dateStr) {
  const ms = utcDay(dateStr);
  const d = new Date(ms);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

function sundayOnOrBefore(ms) {
  const d = new Date(ms);
  return ms - d.getUTCDay() * 86400000;
}

/* ---------------- data ---------------- */

async function fetchGraphQL(token) {
  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection(timeZone: "${TZ}") {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }`;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "portfolio-worker",
    },
    body: JSON.stringify({ query, variables: { login: USERNAME } }),
  });
  if (!res.ok) throw new Error(`graphql ${res.status}`);
  const json = await res.json();
  const cal = json?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!cal?.weeks?.length) throw new Error("graphql empty");
  const counts = new Map();
  let total = 0;
  for (const week of cal.weeks)
    for (const day of week.contributionDays) {
      counts.set(day.date.slice(0, 10), day.contributionCount);
      total += day.contributionCount;
    }
  const firstSunday = sundayOnOrBefore(utcDay(cal.weeks[0].contributionDays[0].date));
  const end = utcDay(dayKey(Date.now()));
  const days = [];
  for (let t = firstSunday; t <= end + 6 * 86400000; t += 86400000) {
    const k = dayKey(t);
    days.push({ date: k, count: counts.get(k) ?? null });
  }
  while (days.length && days[days.length - 1].count === null) days.pop();
  return { source: "graphql", days, total };
}

async function fetchPushEvents() {
  const pages = [1, 2, 3].map((p) =>
    fetch(
      `https://api.github.com/users/${USERNAME}/events/public?per_page=100&page=${p}`,
      {
        headers: { Accept: "application/vnd.github+json", "User-Agent": "portfolio-worker" },
      }
    ).then((r) => (r.ok ? r.json() : []))
  );
  const settled = await Promise.allSettled(pages);
  const counts = new Map();
  let any = false;
  for (const s of settled) {
    if (s.status !== "fulfilled" || !Array.isArray(s.value)) continue;
    for (const ev of s.value) {
      if (ev.type !== "PushEvent") continue;
      any = true;
      const n =
        (Array.isArray(ev.payload?.commits) && ev.payload.commits.length) ||
        ev.payload?.size ||
        1;
      const k = ev.created_at.slice(0, 10);
      counts.set(k, (counts.get(k) || 0) + n);
    }
  }
  if (!any) throw new Error("no events");
  const start = sundayOnOrBefore(utcDay(dayKey(Date.now() - 89 * 86400000)));
  const end = utcDay(dayKey(Date.now()));
  const days = [];
  let total = 0;
  for (let t = start; t <= end; t += 86400000) {
    const k = dayKey(t);
    const c = counts.get(k) || 0;
    total += c;
    days.push({ date: k, count: c });
  }
  return { source: "events", days, total };
}

function emptyYear() {
  const start = sundayOnOrBefore(utcDay(dayKey(Date.now() - 364 * 86400000)));
  const end = utcDay(dayKey(Date.now()));
  const days = [];
  for (let t = start; t <= end; t += 86400000)
    days.push({ date: dayKey(t), count: 0 });
  return { source: "empty", days, total: 0 };
}

export async function getData(env) {
  const cached = memCache.get("gh");
  if (cached && Date.now() - cached.t < MEM_TTL) return cached.data;
  let data = null;
  if (env?.GITHUB_TOKEN) {
    try {
      data = await fetchGraphQL(env.GITHUB_TOKEN);
    } catch (_) {}
  }
  if (!data && snapshot?.days?.length) {
    data = normalizeSnapshot(snapshot);
  }
  if (data) {
    // overlay the freshest public push activity on top of the snapshot
    try {
      const events = await fetchPushEvents();
      data = overlayRecent(data, events, 7);
    } catch (_) {}
  }
  if (!data) {
    try {
      data = await fetchPushEvents();
    } catch (_) {}
  }
  if (!data) data = cached?.data || emptyYear();
  memCache.set("gh", { t: Date.now(), data });
  return data;
}

function normalizeSnapshot(snap) {
  const end = utcDay(dayKey(Date.now()));
  const byDate = new Map(snap.days.map((d) => [d.date, d.count]));
  const first = snap.days[0].date;
  const start = sundayOnOrBefore(utcDay(first));
  const days = [];
  let total = 0;
  for (let t = start; t <= end; t += 86400000) {
    const k = dayKey(t);
    const c = byDate.get(k) ?? 0;
    total += c;
    days.push({ date: k, count: c });
  }
  return { source: "snapshot", days, total };
}

function overlayRecent(base, events, windowDays) {
  const byDate = new Map(events.days.map((d) => [d.date, d.count]));
  const days = base.days.map((d, i) => {
    if (i < base.days.length - windowDays) return d;
    const ev = byDate.get(d.date) || 0;
    return ev > d.count ? { ...d, count: ev } : d;
  });
  const total = days.reduce((s, d) => s + (d.count || 0), 0);
  return { ...base, days, total };
}

/* ---------------- shared rendering ---------------- */

function computeLevels(days) {
  const nz = days.filter((d) => d.count > 0).map((d) => d.count).sort((a, b) => a - b);
  if (!nz.length) return days.map(() => 0);
  const q = (p) => nz[Math.min(nz.length - 1, Math.floor(nz.length * p))];
  const t1 = q(0.25), t2 = q(0.5), t3 = q(0.75);
  return days.map((d) => {
    if (d.count === null || d.count === 0) return 0;
    if (d.count <= t1) return 1;
    if (d.count <= t2) return 2;
    if (d.count <= t3) return 3;
    return 4;
  });
}

function svgOpen(w, h, style) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" font-family="${MON_FONT}">
<style>${style}</style>`;
}

const REDUCED_MOTION = `@media (prefers-reduced-motion: reduce){*{animation:none!important}}`;

/* ---------------- calendar ---------------- */

function monthLabels(days) {
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  const cands = [];
  let prevM = -1;
  weeks.forEach((w, wi) => {
    const first = w.find((d) => d.count !== null);
    if (!first) return;
    const m = new Date(utcDay(first.date)).getUTCMonth();
    if (m !== prevM) {
      cands.push({ wi, label: MONTHS[m] });
      prevM = m;
    }
  });
  const kept = [];
  for (const c of cands) {
    if (!kept.length || c.wi - kept[kept.length - 1].wi >= 3) kept.push(c);
  }
  if (kept.length > 1 && weeks.length - kept[kept.length - 1].wi < 3) kept.pop();
  return { weeks, kept };
}

function renderCalendar(data, themeName) {
  const th = THEMES[themeName] || THEMES.dark;
  const levels = computeLevels(data.days);
  const filled = data.days.map((d, i) => ({ ...d, level: levels[i] }));
  const { weeks, kept } = monthLabels(filled);
  const W = weeks.length * STEP - GAP;
  const gridTop = TOP;
  const narrow = W < 360;
  const H = gridTop + GRID_H + FOOTER_GAP + (narrow ? 19 : 0);
  const total = data.total ?? filled.reduce((s, d) => s + Math.max(d.count || 0, 0), 0);
  const todayKey = dayKey(Date.now());
  const spanDays = Math.round(
    (utcDay(filled[filled.length - 1].date) - utcDay(filled[0].date)) / 86400000
  );
  const period =
    data.source === "graphql"
      ? "in the last year"
      : `in the last ${spanDays} days`;

  const style = `
    text{font-family:${MON_FONT}}
    .ml{fill:${th.muted};font-size:10px}
    .ft{fill:${th.muted};font-size:12px}
    .fv{fill:${th.ink};font-weight:700;font-size:12px}
    .c{transform-box:fill-box;transform-origin:center;animation:cellIn .42s cubic-bezier(.16,1,.3,1) backwards}
    @keyframes cellIn{from{opacity:0;transform:scale(.25)}to{opacity:1;transform:scale(1)}}
    ${REDUCED_MOTION}`;

  const parts = [svgOpen(W, H, style)];
  parts.push(`<rect width="${W}" height="${H}" fill="none"/>`);

  // month labels
  for (const m of kept)
    parts.push(
      `<text class="ml" x="${m.wi * STEP}" y="13">${m.label}</text>`
    );

  // cells
  weeks.forEach((w, wi) => {
    const delay = Math.min(wi * 16, 1300);
    w.forEach((d, di) => {
      if (d.count === null) return;
      const fill = d.level === 0 ? th.empty : th.ramp[d.level - 1];
      const isToday = d.date === todayKey;
      const stroke = isToday ? ` stroke="${th.today}" stroke-width="1"` : "";
      const title = `${d.count} contribution${d.count === 1 ? "" : "s"} on ${niceDate(d.date)}`;
      parts.push(
        `<g class="c" style="animation-delay:${delay}ms"><title>${title}</title>` +
          `<rect x="${wi * STEP}" y="${gridTop + di * STEP}" width="${CELL}" height="${CELL}" rx="2.5" fill="${fill}"${stroke}/></g>`
      );
    });
  });

  // footer: total left, legend right (anchored so it can never overflow);
  // narrow calendars stack the legend on a second row
  const fy = gridTop + GRID_H + 17;
  const ly = narrow ? fy + 18 : fy;
  parts.push(
    `<text class="ft" x="0" y="${fy}"><tspan class="fv">${total.toLocaleString("en-US")}</tspan> contributions${narrow ? "" : ` ${period}`}</text>`
  );
  let legendEnd = W;
  parts.push(`<text class="ft" x="${legendEnd}" y="${ly}" text-anchor="end">More</text>`);
  legendEnd -= 31 + GAP;
  const swatchesX = [];
  for (let i = 0; i < 5; i++) {
    swatchesX.unshift(legendEnd - CELL);
    legendEnd -= STEP;
  }
  parts.push(`<text class="ft" x="${legendEnd}" y="${ly}" text-anchor="end">Less</text>`);
  const legendSw = [th.empty, ...th.ramp];
  legendSw.forEach((f, i) =>
    parts.push(
      `<rect x="${swatchesX[i]}" y="${ly - 10}" width="${CELL}" height="${CELL}" rx="2" fill="${f}"/>`
    )
  );

  parts.push("</svg>");
  return parts.join("");
}

/* ---------------- graph ---------------- */

function smoothPath(pts) {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

function renderGraph(data, themeName) {
  const th = THEMES[themeName] || THEMES.dark;
  const W = 840, H = 280;
  const padL = 44, padR = 18, padT = 22, padB = 42;
  const iw = W - padL - padR, ih = H - padT - padB;

  const series = data.days.filter((d) => d.count !== null);
  const maxV = Math.max(4, ...series.map((d) => d.count));
  const step = Math.pow(10, Math.floor(Math.log10(maxV))) / 2;
  const topV = Math.ceil(maxV / step) * step;

  const pts = series.map((d, i) => [
    padL + (i / Math.max(series.length - 1, 1)) * iw,
    padT + ih - (d.count / topV) * ih,
  ]);

  const line = smoothPath(pts);
  const area = `${line}L${pts[pts.length - 1][0].toFixed(1)},${padT + ih}L${pts[0][0].toFixed(1)},${padT + ih}Z`;

  let peakIdx = 0;
  series.forEach((d, i) => { if (d.count > series[peakIdx].count) peakIdx = i; });
  const [px, py] = pts[peakIdx];
  const total = data.total ?? series.reduce((s, d) => s + d.count, 0);
  const avg = total / Math.max(series.length, 1);

  // y gridlines + labels
  const ticks = [];
  const nTicks = 4;
  for (let i = 0; i <= nTicks; i++) {
    const v = (topV / nTicks) * i;
    const y = padT + ih - (v / topV) * ih;
    ticks.push(
      `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${W - padR}" y2="${y.toFixed(1)}" stroke="${th.grid}" stroke-width="1"/>` +
        `<text x="${padL - 8}" y="${(y + 3.5).toFixed(1)}" text-anchor="end" font-size="10" fill="${th.muted}">${Math.round(v)}</text>`
    );
  }

  // month x labels (every ~5 weeks)
  const xt = [];
  let lastX = -999;
  series.forEach((d, i) => {
    const dt = new Date(utcDay(d.date));
    if (dt.getUTCDate() <= 7) {
      const x = pts[i][0];
      if (x - lastX > 56) {
        lastX = x;
        xt.push(`<text x="${x.toFixed(1)}" y="${H - 14}" text-anchor="middle" font-size="10" fill="${th.muted}">${MONTHS[dt.getUTCMonth()]}</text>`);
      }
    }
  });

  const style = `
    text{font-family:${MON_FONT}}
    .t{fill:${th.ink};font-size:13px;font-weight:700}
    .s{fill:${th.muted};font-size:11px}
    .g{animation:gIn .9s ease-out backwards}
    @keyframes gIn{from{opacity:0}to{opacity:1}}
    ${REDUCED_MOTION}`;

  const parts = [svgOpen(W, H, style)];

  parts.push(
    `<defs>
<linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="${th.accent}" stop-opacity=".26"/>
<stop offset="100%" stop-color="${th.accent}" stop-opacity="0"/>
</linearGradient>
<filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
<feGaussianBlur stdDeviation="3.2" result="b"/>
<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
</defs>`
  );

  parts.push(`<text class="t" x="${padL}" y="14">${total.toLocaleString("en-US")} contributions &#183; avg ${avg.toFixed(1)}/day</text>`);

  parts.push(ticks.join(""));
  parts.push(xt.join(""));

  parts.push(`<g class="g">`);
  parts.push(`<path d="${area}" fill="url(#g1)"/>`);
  parts.push(`<path filter="url(#glow)" d="${line}" fill="none" stroke="${th.accent}" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>`);

  // peak marker
  parts.push(
    `<g><circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="3.4" fill="${th.accent}">` +
      `<animate attributeName="r" values="3.4;6;3.4" dur="2.4s" repeatCount="indefinite"/>` +
      `<animate attributeName="opacity" values="1;.35;1" dur="2.4s" repeatCount="indefinite"/></circle>` +
      `<text x="${Math.min(px + 9, W - padR).toFixed(1)}" y="${(py - 9).toFixed(1)}" font-size="11" font-weight="700" fill="${th.ink}">peak ${series[peakIdx].count}</text></g>`
  );

  // latest value dot
  const [ex, ey] = pts[pts.length - 1];
  parts.push(
    `<g><title>${series[series.length - 1].count} contributions on ${niceDate(series[series.length - 1].date)}</title>` +
      `<circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="3.4" fill="${th.ink}"/></g>`
  );
  parts.push(`</g>`);

  parts.push("</svg>");
  return parts.join("");
}

/* ---------------- worker ---------------- */

const JSON_HEADERS = {
  "content-type": "image/svg+xml; charset=utf-8",
  "cache-control": CACHE_CONTROL,
};

async function serveWidget(request, kind, env, ctx) {
  const url = new URL(request.url);
  const cacheKey = new Request(url.toString(), request);
  const hit = await caches.default.match(cacheKey);
  if (hit) return hit;

  const themeParam = url.searchParams.get("theme");
  const theme = THEMES[themeParam] ? themeParam : "dark";
  const data = await getData(env);
  const body = kind === "graph" ? renderGraph(data, theme) : renderCalendar(data, theme);
  const res = new Response(body, { headers: JSON_HEADERS });
  ctx.waitUntil(caches.default.put(cacheKey, res.clone()));
  return res;
}

export const __internals = { renderCalendar, renderGraph, computeLevels };

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const p = url.pathname.replace(/\/$/, "");

    if (p === "/app_tutorials") {
      return Response.redirect(
        "https://drive.google.com/drive/folders/1sqvi_gx5YjGuF1VCUn9n7HH1EY-EXN7_?usp=sharing",
        302
      );
    }

    if (p === "/github/calendar.svg" || p === "/github/calendar")
      return serveWidget(request, "calendar", env, ctx);

    if (p === "/github/graph.svg" || p === "/github/graph")
      return serveWidget(request, "graph", env, ctx);

    return env.ASSETS.fetch(request);
  },
};
