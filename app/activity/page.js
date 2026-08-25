"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import snapshotData from "../../data/github-snapshot.json";
import "./activity.css";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CELL = 11;
const GAP = 3;
const STEP = CELL + GAP;
const TOP = 21;

function utcDay(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

function dayKey(ms) {
  return new Date(ms).toISOString().slice(0, 10);
}

function niceDate(dateStr) {
  const d = new Date(utcDay(dateStr));
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

function shortDate(dateStr) {
  const d = new Date(utcDay(dateStr));
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

function computeLevels(days) {
  const nz = days.filter((d) => d.count > 0).map((d) => d.count).sort((a, b) => a - b);
  if (!nz.length) return days.map(() => 0);
  const q = (p) => nz[Math.min(nz.length - 1, Math.floor(nz.length * p))];
  const t1 = q(0.25);
  const t2 = q(0.5);
  const t3 = q(0.75);
  return days.map((d) => {
    if (!d.count) return 0;
    if (d.count <= t1) return 1;
    if (d.count <= t2) return 2;
    if (d.count <= t3) return 3;
    return 4;
  });
}

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

function toDays(json) {
  const days = Array.isArray(json?.days) ? json.days.filter((d) => d && d.date) : [];
  return {
    status: days.length ? "ready" : "error",
    days,
    total: json?.total ?? days.reduce((s, d) => s + (d.count || 0), 0),
    source: json?.source || "",
  };
}

export default function ActivityPage() {
  const [state, setState] = useState(() => toDays(snapshotData));
  const [hover, setHover] = useState(null); // {x, y, count, date, kind, idx}
  const [focusIdx, setFocusIdx] = useState(null);
  const tooltipRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    let alive = true;
    fetch("/github/data")
      .then((r) => {
        if (!r.ok) throw new Error("failed");
        return r.json();
      })
      .then((j) => {
        if (alive) setState(toDays(j));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const levels = useMemo(() => computeLevels(state.days), [state.days]);
  const filled = useMemo(
    () => state.days.map((d, i) => ({ ...d, level: levels[i] ?? 0 })),
    [state.days, levels]
  );
  const { weeks, kept } = useMemo(() => monthLabels(filled), [filled]);
  const todayKey = dayKey(Date.now());

  const stats = useMemo(() => {
    if (!filled.length) return null;
    const valid = filled.filter((d) => d.count !== null);
    const total = valid.reduce((s, d) => s + (d.count || 0), 0);
    let best = valid[0];
    let streak = 0;
    let bestStreak = 0;
    for (const d of valid) {
      if (d.count > 0) {
        streak += 1;
        bestStreak = Math.max(bestStreak, streak);
      } else {
        streak = 0;
      }
      if (d.count > best.count) best = d;
    }
    return {
      total,
      avg: total / valid.length,
      best,
      bestStreak,
      activeDays: valid.filter((d) => d.count > 0).length,
    };
  }, [filled]);

  const graph = useMemo(() => {
    const series = filled.filter((d) => d.count !== null);
    if (series.length < 2) return null;
    const W = 840;
    const H = 260;
    const padL = 40;
    const padR = 16;
    const padT = 18;
    const padB = 34;
    const iw = W - padL - padR;
    const ih = H - padT - padB;
    const maxV = Math.max(4, ...series.map((d) => d.count));
    const step = Math.pow(10, Math.floor(Math.log10(maxV))) / 2;
    const topV = Math.ceil(maxV / step) * step;
    const pts = series.map((d, i) => [
      padL + (i / (series.length - 1)) * iw,
      padT + ih - (d.count / topV) * ih,
    ]);
    let peakIdx = 0;
    series.forEach((d, i) => {
      if (d.count > series[peakIdx].count) peakIdx = i;
    });
    return { series, pts, W, H, padL, padR, padT, padB, iw, ih, topV, peakIdx, line: smoothPath(pts) };
  }, [filled]);

  const moveTip = useCallback((clientX, clientY) => {
    const tip = tooltipRef.current;
    if (!tip) return;
    const x = clientX;
    const y = clientY;
    requestAnimationFrame(() => {
      const r = tip.offsetWidth;
      const left = Math.max(8, Math.min(window.innerWidth - r - 8, x - r / 2));
      tip.style.left = `${left}px`;
      tip.style.top = `${y}px`;
    });
  }, []);

  const onCellEnter = useCallback(
    (e, day, idx) => {
      setHover({ count: day.count, date: day.date, kind: "cell", idx });
      moveTip(e.clientX, e.clientY);
    },
    [moveTip]
  );

  const onGraphMove = useCallback(
    (e) => {
      if (!graph) return;
      const svg = gridRef.current?.querySelector(".graph-svg");
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const scale = rect.width / graph.W;
      const gx = (e.clientX - rect.left) / scale;
      let bestI = 0;
      let bestD = Infinity;
      graph.pts.forEach((p, i) => {
        const d = Math.abs(p[0] - gx);
        if (d < bestD) {
          bestD = d;
          bestI = i;
        }
      });
      const p = graph.pts[bestI];
      const day = graph.series[bestI];
      setHover({ count: day.count, date: day.date, kind: "graph", px: p[0], py: p[1], idx: bestI });
      moveTip(e.clientX, e.clientY - 14);
    },
    [graph, moveTip]
  );

  const onGraphLeave = useCallback(() => setHover(null), []);

  const onKeyDown = useCallback(
    (e) => {
      if (!filled.length) return;
      const last = filled.length - 1;
      let next = focusIdx === null ? last : focusIdx;
      switch (e.key) {
        case "ArrowLeft":
          next -= 1;
          break;
        case "ArrowRight":
          next += 1;
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = last;
          break;
        default:
          return;
      }
      e.preventDefault();
      next = Math.max(0, Math.min(last, next));
      setFocusIdx(next);
      const el = gridRef.current?.querySelector(`[data-idx="${next}"]`);
      if (el) {
        const r = el.getBoundingClientRect();
        setHover({ count: filled[next].count, date: filled[next].date, kind: "cell" });
        moveTip(r.left + r.width / 2, r.top);
      }
    },
    [filled, focusIdx, moveTip]
  );

  return (
    <main className="act-scene">
      <div className="bg-orb orb-a" aria-hidden="true" />
      <div className="bg-orb orb-b" aria-hidden="true" />
      <div className="bg-orb orb-c" aria-hidden="true" />
      <div className="bg-grid" aria-hidden="true" />

      <header className="act-head">
        <a className="act-back" href="/">
          ← back
        </a>
        <p className="act-eyebrow">GITHUB ACTIVITY</p>
        <h1>
          Push <span>calendar</span>
        </h1>
        <p className="act-sub">
          Every cell is a day of real pushes — hover anything. Live on{" "}
          <a href="https://github.com/coderaarav12" target="_blank" rel="noreferrer">
            github.com/coderaarav12
          </a>
        </p>
      </header>

      {state.status === "error" ? (
        <div className="act-status">
          couldn&apos;t load contributions —{" "}
          <a href="https://github.com/coderaarav12" target="_blank" rel="noreferrer">
            view on GitHub
          </a>
        </div>
      ) : (
        <>
          {stats ? (
            <section className="act-stats">
              <div className="stat">
                <strong>{stats.total.toLocaleString("en-US")}</strong>
                <span>contributions</span>
              </div>
              <div className="stat">
                <strong>{stats.avg.toFixed(1)}</strong>
                <span>avg / day</span>
              </div>
              <div className="stat">
                <strong>{stats.best.count}</strong>
                <span>best day · {shortDate(stats.best.date)}</span>
              </div>
              <div className="stat">
                <strong>{stats.bestStreak}</strong>
                <span>longest streak</span>
              </div>
              <div className="stat">
                <strong>{stats.activeDays}</strong>
                <span>active days</span>
              </div>
            </section>
          ) : null}

          <section
            className="cal-card"
            ref={gridRef}
            tabIndex={0}
            role="application"
            aria-label="Contribution calendar. Use arrow keys to browse days."
            onKeyDown={onKeyDown}
            onMouseLeave={() => setHover(null)}
          >
            <div className="cal-scroll">
              <svg
                className="cal-svg"
                width={weeks.length * STEP - GAP}
                height={TOP + STEP * 7 - GAP}
                viewBox={`0 0 ${weeks.length * STEP - GAP} ${TOP + STEP * 7 - GAP}`}
                aria-hidden="true"
              >
                {kept.map((m) => (
                  <text key={`${m.label}-${m.wi}`} className="cal-month" x={m.wi * STEP} y={13}>
                    {m.label}
                  </text>
                ))}
                {weeks.map((w, wi) =>
                  w.map((d, di) => {
                    if (d.count === null) return null;
                    const idx = wi * 7 + di;
                    return (
                      <g key={d.date} data-idx={idx}>
                        <rect
                          className={`cal-cell${focusIdx === idx ? " is-focus" : ""}${
                            hover && hover.kind === "cell" && hover.idx === idx ? " is-hot" : ""
                          }`}
                          x={wi * STEP}
                          y={TOP + di * STEP}
                          width={CELL}
                          height={CELL}
                          rx={2.5}
                          fill={d.level === 0 ? "var(--cell-empty)" : `var(--cell-l${d.level})`}
                          stroke={d.date === todayKey ? "var(--accent)" : undefined}
                          strokeWidth={d.date === todayKey ? 1 : undefined}
                        />
                        <rect
                          className="cal-hit"
                          x={wi * STEP - GAP / 2}
                          y={TOP + di * STEP - GAP / 2}
                          width={CELL + GAP}
                          height={CELL + GAP}
                          fill="transparent"
                          onMouseEnter={(e) => onCellEnter(e, d, idx)}
                          onMouseMove={(e) => moveTip(e.clientX, e.clientY)}
                        />
                      </g>
                    );
                  })
                )}
              </svg>
            </div>
            <div className="cal-foot">
              <span>
                <b>{(stats?.total ?? 0).toLocaleString("en-US")}</b> contributions in the last year
              </span>
              <span className="cal-legend">
                Less
                {[0, 1, 2, 3, 4].map((l) => (
                  <i key={l} className={`lg lg-${l}`} />
                ))}
                More
              </span>
            </div>
          </section>

          {graph ? (
            <section className="graph-card" onMouseLeave={onGraphLeave}>
              <div className="graph-head">
                <span>
                  <b>{(stats?.total ?? 0).toLocaleString("en-US")}</b> contributions
                </span>
                <span className="graph-hint">hover the line</span>
              </div>
              <svg
                className="graph-svg"
                viewBox={`0 0 ${graph.W} ${graph.H}`}
                onMouseMove={onGraphMove}
              >
                <defs>
                  <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity=".24" />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0, 1, 2, 3, 4].map((i) => {
                  const y = graph.padT + graph.ih - (i / 4) * graph.ih;
                  return (
                    <g key={i}>
                      <line
                        x1={graph.padL}
                        y1={y}
                        x2={graph.W - graph.padR}
                        y2={y}
                        stroke="var(--grid)"
                      />
                      <text x={graph.padL - 8} y={y + 3.5} textAnchor="end" className="ax">
                        {Math.round((graph.topV / 4) * i)}
                      </text>
                    </g>
                  );
                })}
                {(() => {
                  const ticks = [];
                  let lastX = -999;
                  graph.series.forEach((d, i) => {
                    const dt = new Date(utcDay(d.date));
                    if (dt.getUTCDate() <= 7) {
                      const x = graph.pts[i][0];
                      if (x - lastX > 56) {
                        lastX = x;
                        ticks.push(
                          <text key={d.date} x={x} y={graph.H - 10} textAnchor="middle" className="ax">
                            {MONTHS[dt.getUTCMonth()]}
                          </text>
                        );
                      }
                    }
                  });
                  return ticks;
                })()}
                <path d={`${graph.line}L${graph.pts[graph.pts.length - 1][0]},${graph.padT + graph.ih}L${graph.pts[0][0]},${graph.padT + graph.ih}Z`} fill="url(#ag)" />
                <path d={graph.line} className="graph-line" />
                {hover && hover.kind === "graph" ? (
                  <g className="graph-guide">
                    <line x1={hover.px} y1={graph.padT} x2={hover.px} y2={graph.padT + graph.ih} />
                    <circle cx={hover.px} cy={hover.py} r={4.5} />
                  </g>
                ) : null}
                <circle
                  className="graph-peak-dot"
                  cx={graph.pts[graph.peakIdx][0]}
                  cy={graph.pts[graph.peakIdx][1]}
                  r={3.4}
                />
                <circle className="graph-end-dot" cx={graph.pts[graph.pts.length - 1][0]} cy={graph.pts[graph.pts.length - 1][1]} r={3.4} />
              </svg>
            </section>
          ) : null}
        </>
      )}

      <footer className="act-foot">
        <a href="/">portfolio</a> · <a href="https://github.com/coderaarav12" target="_blank" rel="noreferrer">github</a>
      </footer>

      <div
        ref={tooltipRef}
        className={`act-tip${hover ? " is-on" : ""}`}
        role="tooltip"
        aria-hidden={!hover}
      >
        {hover ? (
          <>
            <b>
              {hover.count} contribution{hover.count === 1 ? "" : "s"}
            </b>
            <span>{niceDate(hover.date)}</span>
          </>
        ) : null}
      </div>
    </main>
  );
}
