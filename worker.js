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
  "public, max-age=300, s-maxage=1800, stale-while-revalidate=86400";

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
    `<g><title>peak day: ${series[peakIdx].count} contributions on ${niceDate(series[peakIdx].date)}</title><circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="3.4" fill="${th.accent}">` +
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

/* ---------------- banner ---------------- */

const SANS = "'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";

function renderBanner(themeName) {
  const dark = themeName !== "light";
  const W = 900;
  const H = 170;
  const ink = dark ? "#f6f7fb" : "#0b1220";
  const sub = dark ? "rgba(230,237,243,.55)" : "rgba(11,18,32,.62)";
  const dot = dark ? "rgba(255,255,255,.05)" : "rgba(11,18,32,.05)";
  const orbO = dark ? 0.16 : 0.1;
  const nameStops = dark
    ? ["#ffffff", "#eafff4", "#9ff0c8"]
    : ["#0b1220", "#0f3d2e", "#065f46"];

  const style = `
    .name{font-family:${SANS};font-size:54px;font-weight:800;letter-spacing:10px}
    .tag{font-family:${MON_FONT};font-size:15px;letter-spacing:5px}
  `;
  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
<linearGradient id="ng" x1="0" y1="0" x2="1" y2="0">
<stop offset="0%" stop-color="${nameStops[0]}"/>
<stop offset="55%" stop-color="${nameStops[1]}"/>
<stop offset="100%" stop-color="${nameStops[2]}"/>
</linearGradient>
<linearGradient id="ul" x1="0" y1="0" x2="1" y2="0">
<stop offset="0%" stop-color="#34d399"/>
<stop offset="50%" stop-color="#22d3ee"/>
<stop offset="100%" stop-color="#a78bfa"/>
</linearGradient>
<linearGradient id="shine" x1="0" y1="0" x2="1" y2="0">
<stop offset="0%" stop-color="#fff" stop-opacity="0"/>
<stop offset="50%" stop-color="#fff" stop-opacity=".05"/>
<stop offset="100%" stop-color="#fff" stop-opacity="0"/>
</linearGradient>
<pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
<circle cx="2" cy="2" r="1.2" fill="${dot}"/>
</pattern>
<filter id="blur" x="-80%" y="-80%" width="260%" height="260%">
<feGaussianBlur stdDeviation="26"/>
</filter>
</defs>`,
    `<rect width="${W}" height="${H}" fill="none"/>`,
    `<g filter="url(#blur)" opacity="${orbO}">
<ellipse cx="120" cy="30" rx="110" ry="46" fill="#34d399"/>
<ellipse cx="790" cy="40" rx="100" ry="42" fill="#22d3ee"/>
<ellipse cx="480" cy="160" rx="130" ry="44" fill="#a78bfa"/>
</g>`,
    `<rect width="${W}" height="${H}" fill="url(#dots)"/>`,
    `<rect x="140" y="150" width="620" height="1" fill="${dark ? "rgba(255,255,255,.10)" : "rgba(11,18,32,.10)"}"/>`,
    `<text class="name" x="${W / 2 + 5}" y="82" text-anchor="middle" fill="url(#ng)">AARAV GOEL</text>`,
    `<text class="tag" x="${W / 2}" y="116" text-anchor="middle" fill="${sub}">FULL-STACK DEVELOPER &#183; AI BUILDER &#183; CREATIVE EDITOR</text>`,
    `<rect x="${W / 2 - 120}" y="136" width="240" height="3" rx="1.5" fill="url(#ul)"/>`,
    `<rect width="150" height="${H}" fill="url(#shine)" transform="translate(-200 0)">
<animateTransform attributeName="transform" type="translate" values="-200 0;${W + 200} 0" dur="7s" begin="2s" repeatCount="indefinite"/>
</rect>`,
    `</svg>`,
  ];
  return parts.join("");
}

/* ---------------- stats strip ---------------- */

function renderStats() {
  const us = snapshot?.user_stats || {};
  const segs = [
    { icon: "repo", value: us.repos ?? 0, label: "REPOS", accent: "#34d399" },
    { icon: "star", value: us.stars ?? 0, label: "STARS", accent: "#f59e0b" },
    { icon: "person", value: us.followers ?? 0, label: "FOLLOWERS", accent: "#4f9cf9" },
    { icon: "bolt", value: snapshot?.total ?? 0, label: "PUSHES \u00B7 1Y", accent: "#a78bfa" },
  ];
  const H = 46;
  const padX = 20;
  const widths = segs.map(
    (s) => 22 + 7 + String(s.value).length * 8.2 + 7 + s.label.length * 6.9 + 20
  );
  const W = Math.ceil(widths.reduce((a, b) => a + b, 0) + padX * 2 - 20 + (segs.length - 1));
  const style = `
    text{font-family:${MON_FONT}}
    .sv{fill:#f0f3f6;font-size:13.5px;font-weight:700}
    .sl{fill:rgba(230,237,243,.5);font-size:9px;letter-spacing:1.5px}
  `;
  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<style>${style}</style>
<defs>
<linearGradient id="sbg" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="#1c232c"/>
<stop offset="100%" stop-color="#12161d"/>
</linearGradient>
<linearGradient id="sshine" x1="0" y1="0" x2="1" y2="0">
<stop offset="0%" stop-color="#fff" stop-opacity="0"/>
<stop offset="50%" stop-color="#fff" stop-opacity=".08"/>
<stop offset="100%" stop-color="#fff" stop-opacity="0"/>
</linearGradient>
<clipPath id="scp"><rect width="${W}" height="${H}" rx="${H / 2}"/></clipPath>
</defs>`,
    `<g clip-path="url(#scp)">
<rect width="${W}" height="${H}" fill="url(#sbg)"/>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="${H / 2}" fill="none" stroke="rgba(255,255,255,.12)"/>
<rect width="130" height="${H}" fill="url(#sshine)" transform="translate(-160 0)">
<animateTransform attributeName="transform" type="translate" values="-160 0;${W + 160} 0" dur="6s" begin="1.5s" repeatCount="indefinite"/>
</rect>
</g>`,
  ];
  let x = padX;
  segs.forEach((s, i) => {
    const cy = H / 2;
    parts.push(`<circle cx="${x + 11}" cy="${cy}" r="11" fill="${s.accent}" opacity=".14"/>`);
    parts.push(
      `<g transform="translate(${x + 11 - 6} ${cy - 6}) scale(${12 / 24})"><path d="${ICONS[s.icon]}" fill="${s.accent}"/></g>`
    );
    const tx = x + 22 + 7;
    parts.push(`<text class="sv" x="${tx}" y="${cy + 4.5}">${Number(s.value).toLocaleString("en-US")}</text>`);
    parts.push(`<text class="sl" x="${tx + String(s.value).length * 8.2 + 7}" y="${cy + 4}">${s.label.replace("\u00B7", "&#183;")}</text>`);
    x += widths[i];
    if (i < segs.length - 1) {
      parts.push(`<line x1="${x}" y1="12" x2="${x}" y2="${H - 12}" stroke="rgba(255,255,255,.10)"/>`);
      x += 1;
    }
  });
  parts.push(`</svg>`);
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

/* ---------------- badges ---------------- */

const ICONS = {
  github:
    "M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.47 5.92.43.37.81 1.1.81 2.22 0 1.61-.01 2.9-.01 3.3 0 .32.22.7.83.58A12.02 12.02 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z",
  globe: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.99 7.99 0 0 1 5.08 16zm2.95-8H5.08a7.99 7.99 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z",
  linkedin:
    "M20.45 20.45h-3.56v-5.57c0-1.32-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z",
  mail: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
  repo: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z",
  star: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
  person: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
  bolt: "M7 2v11h3v9l7-12h-4l4-8z",
};

const BADGES = {
  github: { label: "GITHUB", value: "coderaarav12", icon: "github", accent: "#ffffff" },
  portfolio: { label: "PORTFOLIO", value: "goelaarav.dpdns.org", icon: "globe", accent: "#34d399" },
  linkedin: { label: "LINKEDIN", value: "in/aaravgoel12", icon: "linkedin", accent: "#4f9cf9" },
  email: { label: "EMAIL", value: "goelaarav290@gmail.com", icon: "mail", accent: "#f59e0b" },
};

function renderBadge(name) {
  const b = BADGES[name];
  if (!b) return null;
  const H = 40;
  const chipR = 13;
  const chipX = 6 + chipR;
  const textX = chipX + chipR + 10;
  const labelW = b.label.length * 7.2;
  const valueW = b.value.length * 8.2;
  const W = Math.ceil(textX + Math.max(labelW, valueW) + 18);
  const style = `
    text{font-family:${MON_FONT}}
    .bl{fill:rgba(230,237,243,.52);font-size:9px;letter-spacing:2px}
    .bv{fill:#f0f3f6;font-size:13.5px;font-weight:700}
  `;
  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<style>${style}</style>
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="#1c232c"/>
<stop offset="100%" stop-color="#12161d"/>
</linearGradient>
<linearGradient id="shine" x1="0" y1="0" x2="1" y2="0">
<stop offset="0%" stop-color="#fff" stop-opacity="0"/>
<stop offset="50%" stop-color="#fff" stop-opacity=".10"/>
<stop offset="100%" stop-color="#fff" stop-opacity="0"/>
</linearGradient>
<clipPath id="cp"><rect width="${W}" height="${H}" rx="${H / 2}"/></clipPath>
<filter id="ds" x="-20%" y="-40%" width="140%" height="200%">
<feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity=".35"/>
</filter>
</defs>`,
    `<g filter="url(#ds)">
<g clip-path="url(#cp)">
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="${H / 2}" fill="none" stroke="rgba(255,255,255,.12)"/>
<rect width="${W}" height="${H}" fill="url(#shine)" transform="translate(-120 0)">
<animateTransform attributeName="transform" type="translate" values="-120 0;${W + 120} 0" dur="4.5s" begin="1.2s" repeatCount="indefinite"/>
</rect>
</g>
</g>`,
    `<circle cx="${chipX}" cy="${H / 2}" r="${chipR}" fill="${b.accent}" opacity=".14"/>
<circle cx="${chipX}" cy="${H / 2}" r="${chipR}" fill="none" stroke="${b.accent}" stroke-opacity=".45"/>`,
    `<g transform="translate(${chipX - 7} ${H / 2 - 7}) scale(${14 / 24})"><path d="${ICONS[b.icon]}" fill="${b.accent}"/></g>`,
    `<text class="bl" x="${textX}" y="16">${b.label}</text>
<text class="bv" x="${textX}" y="31">${b.value}</text>`,
    `</svg>`,
  ];
  return parts.join("");
}

async function serveBadge(request, name) {
  const body = renderBadge(name);
  if (!body) return new Response("not found", { status: 404 });
  return new Response(body, {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": CACHE_CONTROL,
    },
  });
}

function serveBanner(request) {
  const theme = new URL(request.url).searchParams.get("theme") || "dark";
  return new Response(renderBanner(theme), {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": CACHE_CONTROL,
    },
  });
}

function serveStats(request) {
  return new Response(renderStats(), {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": CACHE_CONTROL,
    },
  });
}

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

    if (p === "/github/data") return serveData(request, env, ctx);

    const badgeMatch = p.match(/^\/badge\/([a-z]+)(?:\.svg)?$/);
    if (badgeMatch) return serveBadge(request, badgeMatch[1]);

    if (p === "/banner.svg" || p === "/banner") return serveBanner(request);
    if (p === "/stats.svg" || p === "/stats") return serveStats(request);

    return env.ASSETS.fetch(request);
  },
};

async function serveData(request, env, ctx) {
  const url = new URL(request.url);
  const cacheKey = new Request(url.toString(), request);
  const hit = await caches.default.match(cacheKey);
  if (hit) return hit;

  const data = await getData(env);
  const payload = {
    user: USERNAME,
    source: data.source,
    total: data.total,
    generated_at: new Date().toISOString(),
    days: data.days,
  };
  const res = new Response(JSON.stringify(payload), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      "cache-control": CACHE_CONTROL,
    },
  });
  ctx.waitUntil(caches.default.put(cacheKey, res.clone()));
  return res;
}
