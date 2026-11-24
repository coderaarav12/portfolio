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
    empty: "#161b22",
    ramp: ["#0e4429", "#006d32", "#26a641", "#39d353"],
    ink: "#e6edf3",
    muted: "#8b949e",
    accent: "#39d353",
    today: "#39d353",
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

/* ---------------- /stack icon strip ---------------- */
const STACK_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"722\" height=\"106\" viewBox=\"0 0 722 106\"><rect width=\"722\" height=\"106\" fill=\"#0d1117\" rx=\"12\"/><text x=\"131\" y=\"30\" text-anchor=\"middle\" font-family=\"'Segoe UI',system-ui,sans-serif\" font-size=\"11\" font-weight=\"600\" letter-spacing=\"0.08em\" fill=\"#8b949e\" opacity=\"0.9\">LANGUAGES</text><image x=\"20\" y=\"42\" width=\"48\" height=\"48\" href=\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAyNTYgMjU2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxzdmcgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIHZpZXdCb3g9IjAgMCAyNTYgMjU2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPiA8cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgcng9IjYwIiBmaWxsPSIjRjBEQjRGIi8+IDxwYXRoIGQ9Ik02Ny4zMTE3IDIxMy45MzJMODYuOTAyNyAyMDIuMDc2QzkwLjY4MjEgMjA4Ljc3NyA5NC4xMjAyIDIxNC40NDcgMTAyLjM2NyAyMTQuNDQ3QzExMC4yNzIgMjE0LjQ0NyAxMTUuMjU2IDIxMS4zNTUgMTE1LjI1NiAxOTkuMzI3VjExNy41MjlIMTM5LjMxNFYxOTkuNjY3QzEzOS4zMTQgMjI0LjU4NCAxMjQuNzA4IDIzNS45MjYgMTAzLjM5OCAyMzUuOTI2Qzg0LjE1MzMgMjM1LjkyNiA3Mi45ODE5IDIyNS45NTkgNjcuMzExMyAyMTMuOTMiIGZpbGw9IiMzMjMzMzAiLz4gPHBhdGggZD0iTTE1Mi4zODEgMjExLjM1NEwxNzEuOTY5IDIwMC4wMTNDMTc3LjEyNiAyMDguNDM0IDE4My44MjggMjE0LjYyIDE5NS42ODQgMjE0LjYyQzIwNS42NTMgMjE0LjYyIDIxMi4wMDkgMjA5LjYzNiAyMTIuMDA5IDIwMi43NjJDMjEyLjAwOSAxOTQuNTE0IDIwNS40NzkgMTkxLjU5MiAxOTQuNDgxIDE4Ni43ODJMMTg4LjQ2OCAxODQuMjAzQzE3MS4xMTEgMTc2LjgxNSAxNTkuNTk3IDE2Ny41MzUgMTU5LjU5NyAxNDcuOTQ1QzE1OS41OTcgMTI5LjkwMSAxNzMuMzQ1IDExNi4xNTMgMTk0LjgyNiAxMTYuMTUzQzIxMC4xMiAxMTYuMTUzIDIyMS4xMTggMTIxLjQ4MSAyMjkuMDIyIDEzNS40TDIxMC4yOTEgMTQ3LjQyOUMyMDYuMTY2IDE0MC4wNCAyMDEuNyAxMzcuMTE5IDE5NC44MjYgMTM3LjExOUMxODcuNzggMTM3LjExOSAxODMuMzEyIDE0MS41ODcgMTgzLjMxMiAxNDcuNDI5QzE4My4zMTIgMTU0LjY0NiAxODcuNzggMTU3LjU2OCAxOTguMDkgMTYyLjAzN0wyMDQuMTA0IDE2NC42MTRDMjI0LjU1MyAxNzMuMzc5IDIzNi4wNjcgMTgyLjMxMyAyMzYuMDY3IDIwMi40MThDMjM2LjA2NyAyMjQuMDcyIDIxOS4wNTUgMjM1LjkyOCAxOTYuMiAyMzUuOTI4QzE3My44NjEgMjM1LjkyOCAxNTkuNDI2IDIyNS4yNzQgMTUyLjM4MSAyMTEuMzU0IiBmaWxsPSIjMzIzMzMwIi8+IDwvc3ZnPjwvc3ZnPg==\"/><image x=\"78\" y=\"42\" width=\"48\" height=\"48\" href=\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAyNTYgMjU2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0ibm9uZSIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSIjMDA3QUNDIiByeD0iNjAiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNNTYuNjExMiAxMjguODQ5TDU2LjUyOTkgMTM5LjMzM0g3My4xOTAySDg5Ljg1MDVMODkuODUwNSAxODYuNjczVjIzNC4wMTJIMTAxLjYzNUgxMTMuNDE5VjE4Ni42NzNMMTEzLjQxOSAxMzkuMzMzSDEzMC4wNzlIMTQ2LjczOVYxMjkuMDUyQzE0Ni43MzkgMTIzLjM2MyAxNDYuNjE4IDExOC42MDkgMTQ2LjQ1NSAxMTguNDg3QzE0Ni4zMzMgMTE4LjMyNSAxMjYuMDU2IDExOC4yNDMgMTAxLjQ3MiAxMTguMjg0TDU2LjczMzEgMTE4LjQwNkw1Ni42MTEyIDEyOC44NDlaIi8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTIwNi41NjcgMTE4LjEwOEMyMTMuMDY4IDExOS43MzQgMjE4LjAyNiAxMjIuNjE5IDIyMi41NzcgMTI3LjMzMkMyMjQuOTM0IDEyOS44NTIgMjI4LjQyOCAxMzQuNDQ0IDIyOC43MTMgMTM1LjU0MUMyMjguNzk0IDEzNS44NjYgMjE3LjY2IDE0My4zNDMgMjEwLjkxNSAxNDcuNTI4QzIxMC42NzEgMTQ3LjY5MSAyMDkuNjk1IDE0Ni42MzQgMjA4LjU5OCAxNDUuMDA5QzIwNS4zMDcgMTQwLjIxNCAyMDEuODUzIDEzOC4xNDEgMTk2LjU3IDEzNy43NzZDMTg4LjgwOSAxMzcuMjQ3IDE4My44MTEgMTQxLjMxMSAxODMuODUyIDE0OC4wOTdDMTgzLjg1MiAxNTAuMDg4IDE4NC4xMzYgMTUxLjI2NiAxODQuOTQ5IDE1Mi44OTJDMTg2LjY1NSAxNTYuNDI3IDE4OS44MjUgMTU4LjU0IDE5OS43ODEgMTYyLjg0N0MyMTguMTA3IDE3MC43MzEgMjI1Ljk0OSAxNzUuOTMyIDIzMC44MjYgMTgzLjMyN0MyMzYuMjcxIDE5MS41NzYgMjM3LjQ5IDIwNC43NDIgMjMzLjc5MiAyMTQuNTM1QzIyOS43MjkgMjI1LjE4MSAyMTkuNjUxIDIzMi40MTQgMjA1LjQ2OSAyMzQuODEyQzIwMS4wODEgMjM1LjU4NCAxOTAuNjc4IDIzNS40NjIgMTg1Ljk2NSAyMzQuNjA5QzE3NS42ODQgMjMyLjc4IDE2NS45MzIgMjI3LjcwMSAxNTkuOTE4IDIyMS4wMzdDMTU3LjU2MSAyMTguNDM2IDE1Mi45NjkgMjExLjY1IDE1My4yNTQgMjExLjE2MkMxNTMuMzc1IDIxMSAxNTQuNDMyIDIxMC4zNSAxNTUuNjEgMjA5LjY1OUMxNTYuNzQ4IDIwOS4wMDkgMTYxLjA1NiAyMDYuNTMgMTY1LjExOSAyMDQuMTczTDE3Mi40NzQgMTk5LjkwNkwxNzQuMDE4IDIwMi4xODJDMTc2LjE3MiAyMDUuNDczIDE4MC44ODUgMjA5Ljk4NCAxODMuNzMgMjExLjQ4N0MxOTEuODk3IDIxNS43OTUgMjAzLjExMyAyMTUuMTg1IDIwOC42MzkgMjEwLjIyOEMyMTAuOTk2IDIwOC4wNzQgMjExLjk3MSAyMDUuODM5IDIxMS45NzEgMjAyLjU0OEMyMTEuOTcxIDE5OS41ODEgMjExLjYwNSAxOTguMjgxIDIxMC4wNjEgMTk2LjA0NkMyMDguMDcgMTkzLjIwMiAyMDQuMDA3IDE5MC44MDQgMTkyLjQ2NiAxODUuODA2QzE3OS4yNiAxODAuMTE3IDE3My41NzEgMTc2LjU4MiAxNjguMzcgMTcwLjk3NEMxNjUuMzYzIDE2Ny43MjQgMTYyLjUxOCAxNjIuNTIyIDE2MS4zNCAxNTguMTc0QzE2MC4zNjUgMTU0LjU1OCAxNjAuMTIxIDE0NS40OTYgMTYwLjg5MyAxNDEuODM5QzE2My42MTUgMTI5LjA4IDE3My4yNDYgMTIwLjE4MSAxODcuMTQzIDExNy41MzlDMTkxLjY1NCAxMTYuNjg2IDIwMi4xMzcgMTE3LjAxMSAyMDYuNTY3IDExOC4xMDhaIi8+PC9zdmc+PC9zdmc+\"/><image x=\"136\" y=\"42\" width=\"48\" height=\"48\" href=\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAyNTYgMjU2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0ibm9uZSIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSIjMjQyOTM4IiByeD0iNjAiLz48cGF0aCBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMl80NykiIGQ9Ik0xMjcuMjc5IDI5Qzc2LjUwNjYgMjkgNzkuNjc3MiA1MS4wMTggNzkuNjc3MiA1MS4wMThMNzkuNzMzOCA3My44Mjg0SDEyOC4xODVWODAuNjc3Mkg2MC40ODkzQzYwLjQ4OTMgODAuNjc3MiAyOCA3Ni45OTI2IDI4IDEyOC4yMjJDMjggMTc5LjQ1MiA1Ni4zNTczIDE3Ny42MzYgNTYuMzU3MyAxNzcuNjM2SDczLjI4MTJWMTUzLjg2M0M3My4yODEyIDE1My44NjMgNzIuMzY5IDEyNS41MDYgMTAxLjE4NiAxMjUuNTA2SDE0OS4yNEMxNDkuMjQgMTI1LjUwNiAxNzYuMjM5IDEyNS45NDIgMTc2LjIzOSA5OS40MTIzVjU1LjU0NjFDMTc2LjIzOSA1NS41NDYxIDE4MC4zMzggMjkgMTI3LjI3OSAyOVpNMTAwLjU2MyA0NC4zMzlDMTA1LjM4NCA0NC4zMzkgMTA5LjI4IDQ4LjIzNTEgMTA5LjI4IDUzLjA1NTZDMTA5LjI4IDU3Ljg3NjEgMTA1LjM4NCA2MS43NzIzIDEwMC41NjMgNjEuNzcyM0M5NS43NDI2IDYxLjc3MjMgOTEuODQ2NSA1Ny44NzYxIDkxLjg0NjUgNTMuMDU1NkM5MS44NDY1IDQ4LjIzNTEgOTUuNzQyNiA0NC4zMzkgMTAwLjU2MyA0NC4zMzlaIi8+PHBhdGggZmlsbD0idXJsKCNwYWludDFfbGluZWFyXzJfNDcpIiBkPSJNMTI4LjcyMSAyMjcuOTU4QzE3OS40OTMgMjI3Ljk1OCAxNzYuMzIzIDIwNS45NDEgMTc2LjMyMyAyMDUuOTQxTDE3Ni4yNjYgMTgzLjEzSDEyNy44MTVWMTc2LjI4MUgxOTUuNTExQzE5NS41MTEgMTc2LjI4MSAyMjggMTc5Ljk2NiAyMjggMTI4LjczNkMyMjggNzcuNTA2MiAxOTkuNjQzIDc5LjMyMyAxOTkuNjQzIDc5LjMyM0gxODIuNzE5VjEwMy4wOTZDMTgyLjcxOSAxMDMuMDk2IDE4My42MzEgMTMxLjQ1MyAxNTQuODE0IDEzMS40NTNIMTA2Ljc2QzEwNi43NiAxMzEuNDUzIDc5Ljc2MDcgMTMxLjAxNiA3OS43NjA3IDE1Ny41NDZWMjAxLjQxMkM3OS43NjA3IDIwMS40MTIgNzUuNjYxNSAyMjcuOTU4IDEyOC43MjEgMjI3Ljk1OFpNMTU1LjQzNyAyMTIuNjE5QzE1MC42MTYgMjEyLjYxOSAxNDYuNzIgMjA4LjcyMyAxNDYuNzIgMjAzLjkwM0MxNDYuNzIgMTk5LjA4MiAxNTAuNjE2IDE5NS4xODYgMTU1LjQzNyAxOTUuMTg2QzE2MC4yNTcgMTk1LjE4NiAxNjQuMTU0IDE5OS4wODIgMTY0LjE1NCAyMDMuOTAzQzE2NC4xNTQgMjA4LjcyMyAxNjAuMjU3IDIxMi42MTkgMTU1LjQzNyAyMTIuNjE5WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl8yXzQ3IiB4MT0iNDcuMjIiIHgyPSIxNDYuMzMzIiB5MT0iNDYuODk2IiB5Mj0iMTQ1LjAyIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iIzM4N0VCOCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzM2Njk5NCIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJwYWludDFfbGluZWFyXzJfNDciIHgxPSIxMDguMDU2IiB4Mj0iMjE0LjQ5MiIgeTE9IjEwOS45MDUiIHkyPSIyMTAuNTIyIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iI0ZGRTA1MiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0ZGQzMzMSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPjwvc3ZnPg==\"/><image x=\"194\" y=\"42\" width=\"48\" height=\"48\" href=\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAyNTYgMjU2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0ibm9uZSIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSIjMDA1OTlDIiByeD0iNjAiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTEwLjc1OSAyMTAuNTE3QzY1LjEyNTQgMjEwLjUxNyAyOCAxNzMuMzkyIDI4IDEyNy43NTlDMjggODIuMTI1NCA2NS4xMjU0IDQ1IDExMC43NTkgNDVDMTQwLjIwNCA0NSAxNjcuNjY3IDYwLjg0NTggMTgyLjQyNyA4Ni4zNTMzTDE0Ni42MTEgMTA3LjA3OUMxMzkuMjI0IDk0LjMxMTEgMTI1LjQ4NSA4Ni4zNzkzIDExMC43NTkgODYuMzc5M0M4Ny45NDE2IDg2LjM3OTMgNjkuMzc5MyAxMDQuOTQyIDY5LjM3OTMgMTI3Ljc1OUM2OS4zNzkzIDE1MC41NzUgODcuOTQxNiAxNjkuMTM4IDExMC43NTkgMTY5LjEzOEMxMjUuNDg2IDE2OS4xMzggMTM5LjIyNSAxNjEuMjA2IDE0Ni42MTMgMTQ4LjQzNkwxODIuNDI5IDE2OS4xNjFDMTY3LjY2OSAxOTQuNjcxIDE0MC4yMDYgMjEwLjUxNyAxMTAuNzU5IDIxMC41MTdaIi8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTE5My41MTcgMTIzLjE2MUgxODQuMzIxVjExMy45NjVIMTc1LjEyN1YxMjMuMTYxSDE2NS45MzFWMTMyLjM1NkgxNzUuMTI3VjE0MS41NTJIMTg0LjMyMVYxMzIuMzU2SDE5My41MTdWMTIzLjE2MVoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjI4IDEyMy4xNjFIMjE4LjgwNFYxMTMuOTY1SDIwOS42MVYxMjMuMTYxSDIwMC40MTRWMTMyLjM1NkgyMDkuNjFWMTQxLjU1MkgyMTguODA0VjEzMi4zNTZIMjI4VjEyMy4xNjFaIi8+PC9zdmc+PC9zdmc+\"/><text x=\"294\" y=\"30\" text-anchor=\"middle\" font-family=\"'Segoe UI',system-ui,sans-serif\" font-size=\"11\" font-weight=\"600\" letter-spacing=\"0.08em\" fill=\"#8b949e\" opacity=\"0.9\">FRAMEWORKS</text><image x=\"270\" y=\"42\" width=\"48\" height=\"48\" href=\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAyNTYgMjU2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0ibm9uZSIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSIjMjQyOTM4IiByeD0iNjAiLz48cGF0aCBmaWxsPSIjMDBEOEZGIiBkPSJNMTI4LjAwMSAxNDYuOTUxQzEzOC4zMDUgMTQ2Ljk1MSAxNDYuNjU3IDEzOC41OTggMTQ2LjY1NyAxMjguMjk1QzE0Ni42NTcgMTE3Ljk5MiAxMzguMzA1IDEwOS42MzkgMTI4LjAwMSAxMDkuNjM5QzExNy42OTggMTA5LjYzOSAxMDkuMzQ1IDExNy45OTIgMTA5LjM0NSAxMjguMjk1QzEwOS4zNDUgMTM4LjU5OCAxMTcuNjk4IDE0Ni45NTEgMTI4LjAwMSAxNDYuOTUxWiIvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlPSIjMDBEOEZGIiBzdHJva2Utd2lkdGg9IjguOTExIiBkPSJNMTI4LjAwMiA5MC4zNjMzQzE1My4wNSA5MC4zNjMzIDE3Ni4zMTkgOTMuOTU3NSAxOTMuODY0IDk5Ljk5NzZDMjE1LjAwMyAxMDcuMjc1IDIyOCAxMTguMzA2IDIyOCAxMjguMjk1QzIyOCAxMzguNzA0IDIxNC4yMjYgMTUwLjQyMyAxOTEuNTI1IDE1Ny45NDRDMTc0LjM2MyAxNjMuNjMgMTUxLjc3OSAxNjYuNTk4IDEyOC4wMDIgMTY2LjU5OEMxMDMuNjI0IDE2Ni41OTggODAuNTM4OSAxNjMuODEyIDYzLjE4MzQgMTU3Ljg4MUM0MS4yMjU1IDE1MC4zNzYgMjggMTM4LjUwNiAyOCAxMjguMjk1QzI4IDExOC4zODcgNDAuNDA5NiAxMDcuNDQxIDYxLjI1MTUgMTAwLjE3NUM3OC44NjE3IDk0LjAzNTMgMTAyLjcwNSA5MC4zNjMzIDEyNy45OTggOTAuMzYzM0gxMjguMDAyWiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMEQ4RkYiIHN0cm9rZS13aWR0aD0iOC45MTEiIGQ9Ik05NC45ODExIDEwOS40MzhDMTA3LjQ5NSA4Ny43NDAyIDEyMi4yMzIgNjkuMzc4MyAxMzYuMjMgNTcuMTk3MUMxNTMuMDk0IDQyLjUyMDYgMTY5LjE0NCAzNi43NzI4IDE3Ny43OTYgNDEuNzYyM0MxODYuODEzIDQ2Ljk2MjMgMTkwLjA4NCA2NC43NDk2IDE4NS4yNTkgODguMTcxMkMxODEuNjE0IDEwNS44NzkgMTcyLjkgMTI2LjkyNSAxNjEuMDIxIDE0Ny41MjNDMTQ4Ljg0MiAxNjguNjQxIDEzNC44OTcgMTg3LjI0NyAxMjEuMDkgMTk5LjMxNUMxMDMuNjE5IDIxNC41ODcgODYuNzI4NCAyMjAuMTE0IDc3Ljg4MzMgMjE1LjAxM0M2OS4zMDAzIDIxMC4wNjcgNjYuMDE4MSAxOTMuODQ2IDcwLjEzNTYgMTcyLjE2MUM3My42MTQ1IDE1My44MzggODIuMzQ1MSAxMzEuMzQ5IDk0Ljk3NyAxMDkuNDM4TDk0Ljk4MTEgMTA5LjQzOFoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlPSIjMDBEOEZGIiBzdHJva2Utd2lkdGg9IjguOTExIiBkPSJNOTUuMDEyMyAxNDcuNTc4QzgyLjQ2MzMgMTI1LjkwNCA3My45MTk0IDEwMy45NjIgNzAuMzUzMSA4NS43NTE3QzY2LjA2MDIgNjMuODEwOSA2OS4wOTU0IDQ3LjAzNTUgNzcuNzQwMSA0Mi4wMzE1Qzg2Ljc0ODUgMzYuODE2MyAxMDMuNzkyIDQyLjg2NiAxMjEuNjc0IDU4Ljc0MzdDMTM1LjE5NCA3MC43NDc5IDE0OS4wNzcgODguODA1MiAxNjAuOTkgMTA5LjM4M0MxNzMuMjA0IDEzMC40ODEgMTgyLjM1OCAxNTEuODU2IDE4NS45MTkgMTY5Ljg0NEMxOTAuNDI1IDE5Mi42MDggMTg2Ljc3OCAyMTAuMDAxIDE3Ny45NDEgMjE1LjExNkMxNjkuMzY3IDIyMC4wOCAxNTMuNjc2IDIxNC44MjUgMTM2Ljk0NSAyMDAuNDI3QzEyMi44MDkgMTg4LjI2MyAxMDcuNjg1IDE2OS40NjggOTUuMDEyMyAxNDcuNTc4WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PC9zdmc+PC9zdmc+\"/><text x=\"457\" y=\"30\" text-anchor=\"middle\" font-family=\"'Segoe UI',system-ui,sans-serif\" font-size=\"11\" font-weight=\"600\" letter-spacing=\"0.08em\" fill=\"#8b949e\" opacity=\"0.9\">CLOUD & DEVOPS</text><image x=\"346\" y=\"42\" width=\"48\" height=\"48\" href=\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAyNTYgMjU2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0ibm9uZSIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSIjMjQyOTM4IiByeD0iNjAiLz48ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfNF8yNzIpIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNNzkgMTcxLjc1SDIxMS4zNTZWMTM1LjEyNUwxODYuMjEyIDEyMC43MDZMMTgxLjg3NSAxMTguODMxTDc5IDExOS41MzdWMTcxLjc1WiIvPjxwYXRoIGZpbGw9IiNGMzgwMjAiIGQ9Ik0xNjUuNTc1IDE2Ni44ODdDMTY2LjgwNiAxNjIuNjY5IDE2Ni4zMzggMTU4LjggMTY0LjI4OCAxNTUuOTI1QzE2Mi40MTMgMTUzLjI4NyAxNTkuMjQ0IDE1MS43NjIgMTU1LjQzOCAxNTEuNTg3TDgzLjI4MTMgMTUwLjY1QzgyLjgxMjUgMTUwLjY1IDgyLjQwNjMgMTUwLjQxMiA4Mi4xNjg4IDE1MC4wNjJDODEuOTMxMyAxNDkuNzEyIDgxLjg3NSAxNDkuMjUgODEuOTkzOCAxNDguNzc1QzgyLjIzMTMgMTQ4LjA2OSA4Mi45MzEzIDE0Ny41NDQgODMuNjkzOCAxNDcuNDg3TDE1Ni40OTQgMTQ2LjU1QzE2NS4xMTkgMTQ2LjEzNyAxNzQuNDk0IDEzOS4xNjIgMTc3Ljc2OSAxMzAuNjEyTDE4MS45MzEgMTE5Ljc2OUMxODIuMTE1IDExOS4zMjMgMTgyLjE1OCAxMTguODMzIDE4Mi4wNTYgMTE4LjM2MkMxNzcuMzY5IDk3LjE0MzcgMTU4LjQzMSA4MS4zMTg3IDEzNS44MDYgODEuMzE4N0MxMTQuOTMxIDgxLjMxODcgOTcuMjQzOCA5NC44IDkwLjkwNjMgMTEzLjUwNkM4Ni44IDExMC40NTYgODEuNTMxMyAxMDguODE5IDc1Ljk1NjMgMTA5LjM0NEM2NS45MzEzIDExMC4zNDQgNTcuODMxMyAxMTguMzY5IDU2LjkwNjMgMTI4LjM5NEM1Ni42NjM0IDEzMC44ODcgNTYuODQwOCAxMzMuNDAzIDU3LjQzMTMgMTM1LjgzN0M0OS41NDQ3IDEzNi4wNTEgNDIuMDUzNyAxMzkuMzM3IDM2LjU1NTYgMTQ0Ljk5NUMzMS4wNTc0IDE1MC42NTMgMjcuOTg3NCAxNTguMjM2IDI4IDE2Ni4xMjVDMjggMTY3LjU4NyAyOC4xMjUgMTY5LjA2MiAyOC4yOTM4IDE3MC41MTlDMjguNDE4OCAxNzEuMjI1IDI5IDE3MS43NSAyOS43IDE3MS43NUgxNjIuODc1QzE2My4yNTggMTcxLjc0MyAxNjMuNjI5IDE3MS42MTQgMTYzLjkzNCAxNzEuMzgzQzE2NC4yNCAxNzEuMTUxIDE2NC40NjQgMTcwLjgyOSAxNjQuNTc1IDE3MC40NjJMMTY1LjU3NSAxNjYuODg3VjE2Ni44ODdaIi8+PHBhdGggZmlsbD0iI0ZBQUU0MCIgZD0iTTE4OC41NSAxMjAuNTE5TDE4Ni41NSAxMjAuNTgxQzE4Ni4wODEgMTIwLjU4MSAxODUuNjc1IDEyMC45MzEgMTg1LjQ4NyAxMjEuMzk0TDE4Mi42NzUgMTMxLjE4MUMxODEuNDQ0IDEzNS40IDE4MS45MTIgMTM5LjI2OSAxODMuOTYyIDE0Mi4xNDRDMTg1LjgzNyAxNDQuNzgxIDE4OS4wMDYgMTQ2LjMwNiAxOTIuODEyIDE0Ni40ODFMMjA4LjE2OSAxNDcuNDE5QzIwOC42MzcgMTQ3LjQxOSAyMDkuMDQ0IDE0Ny42NTYgMjA5LjI4MSAxNDguMDA2QzIwOS41MTkgMTQ4LjM1NiAyMDkuNTc1IDE0OC44ODEgMjA5LjQ1NiAxNDkuMjk0QzIwOS4yMTkgMTUwIDIwOC41MTkgMTUwLjUyNSAyMDcuNzU2IDE1MC41ODFMMTkxLjc1NiAxNTEuNTE5QzE4My4wODEgMTUxLjkzMSAxNzMuNzU2IDE1OC45MDYgMTcwLjQ4MSAxNjcuNDU2TDE2OS4zMDYgMTcwLjQ0NEMxNjkuMDY5IDE3MS4wMzEgMTY5LjQ4MSAxNzEuNjE5IDE3MC4xMTkgMTcxLjYxOUgyMjUuMUMyMjUuNDE4IDE3MS42MjMgMjI1LjcyOSAxNzEuNTIyIDIyNS45ODMgMTcxLjMzMUMyMjYuMjM4IDE3MS4xNCAyMjYuNDIyIDE3MC44NjkgMjI2LjUwNiAxNzAuNTYyQzIyNy40ODEgMTY3LjA5NiAyMjcuOTgzIDE2My41MTMgMjI4IDE1OS45MTJDMjI3Ljk3IDE0OS40NjUgMjIzLjgwMiAxMzkuNDU0IDIxNi40MDkgMTMyLjA3MkMyMDkuMDE1IDEyNC42OSAxOTguOTk4IDEyMC41MzggMTg4LjU1IDEyMC41MjUiLz48L2c+PGRlZnM+PGNsaXBQYXRoIGlkPSJjbGlwMF80XzI3MiI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmZmYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI4IDI4KSIvPjwvY2xpcFBhdGg+PC9kZWZzPjwvc3ZnPjwvc3ZnPg==\"/><image x=\"404\" y=\"42\" width=\"48\" height=\"48\" href=\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAyNTYgMjU2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxzdmcgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIHZpZXdCb3g9IjAgMCAyNTYgMjU2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPiA8cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgcng9IjYwIiBmaWxsPSIjMjQyOTM4Ii8+IDxwYXRoIGQ9Ik0xMjguMDAxIDMwQzcyLjc3OTEgMzAgMjggNzQuNzcwOCAyOCAxMzAuMDAxQzI4IDE3NC4xODQgNTYuNjUzMyAyMTEuNjY4IDk2LjM4NjcgMjI0Ljg5MUMxMDEuMzg0IDIyNS44MTcgMTAzLjIxOSAyMjIuNzIyIDEwMy4yMTkgMjIwLjA4MUMxMDMuMjE5IDIxNy42OTYgMTAzLjEyNiAyMDkuODE5IDEwMy4wODMgMjAxLjQ2M0M3NS4yNjMxIDIwNy41MTIgNjkuMzkyNyAxODkuNjY0IDY5LjM5MjcgMTg5LjY2NEM2NC44NDM3IDE3OC4xMDUgNTguMjg5NCAxNzUuMDMyIDU4LjI4OTQgMTc1LjAzMkM0OS4yMTYzIDE2OC44MjUgNTguOTczMyAxNjguOTUzIDU4Ljk3MzMgMTY4Ljk1M0M2OS4wMTUxIDE2OS42NTggNzQuMzAyNiAxNzkuMjU4IDc0LjMwMjYgMTc5LjI1OEM4My4yMjE3IDE5NC41NDYgOTcuNjk2NSAxOTAuMTI2IDEwMy40MDMgMTg3LjU3MUMxMDQuMzAxIDE4MS4xMDcgMTA2Ljg5MiAxNzYuNjk2IDEwOS43NTIgMTc0LjE5OUM4Ny41NDA1IDE3MS42NyA2NC4xOTEzIDE2My4wOTUgNjQuMTkxMyAxMjQuNzc4QzY0LjE5MTMgMTEzLjg2IDY4LjA5NzcgMTA0LjkzOSA3NC40OTQ3IDk3LjkzNjJDNzMuNDU2NCA5NS40MTc1IDcwLjAzMzUgODUuMjQ2NSA3NS40NjM1IDcxLjQ3MjJDNzUuNDYzNSA3MS40NzIyIDgzLjg2MDkgNjguNzg0NSAxMDIuOTcxIDgxLjcyMjZDMTEwLjk0OCA3OS41MDY5IDExOS41MDIgNzguMzk1OCAxMjguMDAxIDc4LjM1NzdDMTM2LjQ5OSA3OC4zOTU4IDE0NS4wNjEgNzkuNTA2OSAxNTMuMDUyIDgxLjcyMjZDMTcyLjEzOSA2OC43ODQ1IDE4MC41MjUgNzEuNDcyMiAxODAuNTI1IDcxLjQ3MjJDMTg1Ljk2OCA4NS4yNDY1IDE4Mi41NDQgOTUuNDE3NSAxODEuNTA1IDk3LjkzNjJDMTg3LjkxNyAxMDQuOTM5IDE5MS43OTcgMTEzLjg2IDE5MS43OTcgMTI0Ljc3OEMxOTEuNzk3IDE2My4xODcgMTY4LjQwMyAxNzEuNjQ0IDE0Ni4xMzUgMTc0LjExOUMxNDkuNzIyIDE3Ny4yMjMgMTUyLjkxOCAxODMuMzA4IDE1Mi45MTggMTkyLjYzOEMxNTIuOTE4IDIwNi4wMTggMTUyLjgwMiAyMTYuNzg3IDE1Mi44MDIgMjIwLjA4MUMxNTIuODAyIDIyMi43NDIgMTU0LjYwMiAyMjUuODYgMTU5LjY3MSAyMjQuODc4QzE5OS4zODMgMjExLjY0IDIyOCAxNzQuMTY5IDIyOCAxMzAuMDAxQzIyOCA3NC43NzA4IDE4My4yMjcgMzAgMTI4LjAwMSAzMFpNNjUuNDUzNiAxNzIuNDUzQzY1LjIzMzMgMTcyLjk1IDY0LjQ1MTcgMTczLjA5OSA2My43Mzk2IDE3Mi43NThDNjMuMDE0MyAxNzIuNDMyIDYyLjYwNjkgMTcxLjc1NCA2Mi44NDIxIDE3MS4yNTZDNjMuMDU3NCAxNzAuNzQ0IDYzLjg0MDYgMTcwLjYwMiA2NC41NjQzIDE3MC45NDVDNjUuMjkxMyAxNzEuMjcxIDY1LjcwNTMgMTcxLjk1NSA2NS40NTM2IDE3Mi40NTNaTTcwLjM3MjUgMTc2Ljg0MkM2OS44OTU2IDE3Ny4yODUgNjguOTYzMyAxNzcuMDc5IDY4LjMzMDcgMTc2LjM4QzY3LjY3NjYgMTc1LjY4MyA2Ny41NTQgMTc0Ljc1MSA2OC4wMzc2IDE3NC4zMDJDNjguNTI5NCAxNzMuODYgNjkuNDMzNiAxNzQuMDY3IDcwLjA4OTMgMTc0Ljc2NEM3MC43NDM0IDE3NS40NyA3MC44NzA5IDE3Ni4zOTUgNzAuMzcyNSAxNzYuODQyWk03My43NDcxIDE4Mi40NThDNzMuMTM0NCAxODIuODg0IDcyLjEzMjUgMTgyLjQ4NSA3MS41MTMyIDE4MS41OTVDNzAuOTAwNCAxODAuNzA2IDcwLjkwMDQgMTc5LjY0IDcxLjUyNjQgMTc5LjIxMkM3Mi4xNDc0IDE3OC43ODUgNzMuMTM0NCAxNzkuMTY5IDczLjc2MiAxODAuMDUyQzc0LjM3MyAxODAuOTU2IDc0LjM3MyAxODIuMDIzIDczLjc0NzEgMTgyLjQ1OFpNNzkuNDU0MiAxODguOTYyQzc4LjkwNjEgMTg5LjU2NiA3Ny43Mzg2IDE4OS40MDQgNzYuODg0MSAxODguNTc5Qzc2LjAwOTggMTg3Ljc3MyA3NS43NjYzIDE4Ni42MjkgNzYuMzE2MSAxODYuMDI0Qzc2Ljg3MDkgMTg1LjQxOCA3OC4wNDUgMTg1LjU4OSA3OC45MDYxIDE4Ni40MDdDNzkuNzczOCAxODcuMjExIDgwLjAzODcgMTg4LjM2NCA3OS40NTQyIDE4OC45NjJaTTg2LjgzMDEgMTkxLjE1N0M4Ni41ODgzIDE5MS45NDEgODUuNDYzOSAxOTIuMjk3IDg0LjMzMTIgMTkxLjk2NEM4My4yMDAyIDE5MS42MjEgODIuNDYgMTkwLjcwNCA4Mi42ODg1IDE4OS45MTJDODIuOTIzNyAxODkuMTI0IDg0LjA1MyAxODguNzUzIDg1LjE5NCAxODkuMTA5Qzg2LjMyMzQgMTg5LjQ1IDg3LjA2NTIgMTkwLjM2MSA4Ni44MzAxIDE5MS4xNTdaTTk1LjIyNDIgMTkyLjA4OUM5NS4yNTIzIDE5Mi45MTMgOTQuMjkxOSAxOTMuNTk3IDkzLjEwMjkgMTkzLjYxMkM5MS45MDczIDE5My42MzkgOTAuOTQwMiAxOTIuOTcxIDkwLjkyNjkgMTkyLjE2QzkwLjkyNjkgMTkxLjMyNyA5MS44NjU5IDE5MC42NSA5My4wNjE1IDE5MC42M0M5NC4yNTA1IDE5MC42MDcgOTUuMjI0MiAxOTEuMjY5IDk1LjIyNDIgMTkyLjA4OVpNMTAzLjQ3IDE5MS43NzNDMTAzLjYxMyAxOTIuNTc3IDEwMi43ODcgMTkzLjQwNCAxMDEuNjA2IDE5My42MjRDMTAwLjQ0NSAxOTMuODM2IDk5LjM3MDIgMTkzLjMzOSA5OS4yMjI5IDE5Mi41NDFDOTkuMDc4OCAxOTEuNzE2IDk5LjkyIDE5MC44OSAxMDEuMDc5IDE5MC42NzZDMTAyLjI2MiAxOTAuNDcxIDEwMy4zMiAxOTAuOTU1IDEwMy40NyAxOTEuNzczWiIgZmlsbD0id2hpdGUiLz4gPC9zdmc+PC9zdmc+\"/><image x=\"462\" y=\"42\" width=\"48\" height=\"48\" href=\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAyNTYgMjU2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0ibm9uZSIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSIjMjM5NkVEIiByeD0iNjAiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTQxLjE4NyAxMjIuMTIzSDE2MS45MDRWMTAzLjM3OUgxNDEuMTg3VjEyMi4xMjNaTTExNi41MjUgMTIyLjEyM0gxMzcuMjQxVjEwMy4zNzlIMTE2LjUyNVYxMjIuMTIzWk05Mi4zNTU0IDEyMi4xMjNIMTEzLjA3MlYxMDMuMzc5SDkyLjM1NTRWMTIyLjEyM1pNNjguMTg1OSAxMjIuMTIzSDg4LjQwOTNWMTAzLjM3OUg2OC4xODU5VjEyMi4xMjNaTTQzLjUyMzMgMTIyLjEyM0g2NC4yMzk5VjEwMy4zNzlINDMuNTIzM1YxMjIuMTIzWk02OC4xODU5IDk5LjQzMzNIODguNDA5M1Y4MC42ODk2SDY4LjE4NTlWOTkuNDMzM1pNOTIuMzU1NCA5OS40MzMzSDExMy4wNzJWODAuNjg5Nkg5Mi4zNTU0Vjk5LjQzMzNaTTExNi41MjUgOTkuNDMzM0gxMzcuMjQxVjgwLjY4OTZIMTE2LjUyNVY5OS40MzMzWk0xMTYuNTI1IDc2Ljc0MzZIMTM3LjI0MVY1OEgxMTYuNTI1Vjc2Ljc0MzZaTTIyOCAxMTMuNzM4QzIyOCAxMTMuNzM4IDIxOS4xMjEgMTA1LjM1MiAyMDAuODcxIDEwOC4zMTJDMTk4Ljg5OCA5NC4wMDc1IDE4My42MDcgODUuNjIyMiAxODMuNjA3IDg1LjYyMjJDMTgzLjYwNyA4NS42MjIyIDE2OS4zMDMgMTAyLjg4NiAxNzkuNjYxIDEyMi4xMjNDMTc2LjcwMiAxMjMuNjAzIDE3MS43NjkgMTI1LjU3NiAxNjQuMzcgMTI1LjU3NkgyOC43MjU3QzI2LjI1OTQgMTM0Ljk0OCAyNi4yNTk0IDE5Ny4wOTcgOTQuMzI4NCAxOTcuMDk3QzE0My4xNiAxOTcuMDk3IDE3OS42NjEgMTc0LjQwOCAxOTYuOTI1IDEzMi45NzRDMjIyLjU3NCAxMzQuOTQ4IDIyOCAxMTMuNzM4IDIyOCAxMTMuNzM4WiIvPjwvc3ZnPjwvc3ZnPg==\"/><image x=\"520\" y=\"42\" width=\"48\" height=\"48\" href=\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAyNTYgMjU2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxzdmcgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIHZpZXdCb3g9IjAgMCAyNTYgMjU2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPiA8cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgcng9IjYwIiBmaWxsPSIjMjQyOTM4Ii8+IDxwYXRoIGQ9Ik0xMjggMzRMMjIzIDE5OC44NTNIMzNMMTI4IDM0WiIgZmlsbD0id2hpdGUiLz4gPC9zdmc+PC9zdmc+\"/><text x=\"649\" y=\"30\" text-anchor=\"middle\" font-family=\"'Segoe UI',system-ui,sans-serif\" font-size=\"11\" font-weight=\"600\" letter-spacing=\"0.08em\" fill=\"#8b949e\" opacity=\"0.9\">CREATIVE & DEVELOPER TOOLS</text><image x=\"596\" y=\"42\" width=\"48\" height=\"48\" href=\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAyNTYgMjU2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0ibm9uZSIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSIjMDAwMDVCIiByeD0iNjAiLz48cGF0aCBmaWxsPSIjOTlGIiBkPSJNNTQgMTgyLjY4VjcyLjgxMzNDNTQgNzIuMDY2NyA1NC4zMiA3MS42NCA1NS4wNjY3IDcxLjY0QzU2Ljg4IDcxLjY0IDU4LjU4NjcgNzEuNjQgNjEuMDQgNzEuNTMzM0M2My42IDcxLjQyNjcgNjYuMjY2NyA3MS40MjY3IDY5LjE0NjcgNzEuMzJDNzIuMDI2NyA3MS4yMTMzIDc1LjEyIDcxLjIxMzMgNzguNDI2NyA3MS4xMDY3QzgxLjczMzMgNzEgODQuOTMzMyA3MSA4OC4xMzMzIDcxQzk2Ljg4IDcxIDEwNC4xMzMgNzIuMDY2NyAxMTAuMTA3IDc0LjMwNjdDMTE1LjQ0IDc2LjEyIDEyMC4zNDcgNzkuMTA2NyAxMjQuNCA4My4wNTMzQzEyNy44MTMgODYuNDY2NyAxMzAuNDggOTAuNjI2NyAxMzIuMTg3IDk1LjIxMzNDMTMzLjc4NyA5OS42OTMzIDEzNC42NCAxMDQuMjggMTM0LjY0IDEwOS4wOEMxMzQuNjQgMTE4LjI1MyAxMzIuNTA3IDEyNS44MjcgMTI4LjI0IDEzMS44QzEyMy45NzMgMTM3Ljc3MyAxMTggMTQyLjI1MyAxMTEuMDY3IDE0NC44MTNDMTAzLjgxMyAxNDcuNDggOTUuODEzMyAxNDguNDQgODcuMDY2NyAxNDguNDRDODQuNTA2NyAxNDguNDQgODIuOCAxNDguNDQgODEuNzMzMyAxNDguMzMzQzgwLjY2NjcgMTQ4LjIyNyA3OS4xNzMzIDE0OC4yMjcgNzcuMTQ2NyAxNDguMjI3VjE4Mi40NjdDNzcuMjUzMyAxODMuMjEzIDc2LjcyIDE4My44NTMgNzUuOTczMyAxODMuOTZINzUuNTQ2N0g1NS4yOEM1NC40MjY3IDE4My45NiA1NCAxODMuNTMzIDU0IDE4Mi41NzNWMTgyLjY4Wk03Ny4yNTMzIDkyLjMzMzNWMTI4LjE3M0M3OC43NDY3IDEyOC4yOCA4MC4xMzMzIDEyOC4zODcgODEuNDEzMyAxMjguMzg3SDg3LjA2NjdDOTEuMjI2NyAxMjguMzg3IDk1LjM4NjcgMTI3Ljc0NyA5OS4zMzMzIDEyNi40NjdDMTAyLjc0NyAxMjUuNTA3IDEwNS43MzMgMTIzLjQ4IDEwOC4wOCAxMjAuODEzQzExMC4zMiAxMTguMTQ3IDExMS4zODcgMTE0LjUyIDExMS4zODcgMTA5LjgyN0MxMTEuNDkzIDEwNi41MiAxMTAuNjQgMTAzLjIxMyAxMDguOTMzIDEwMC4zMzNDMTA3LjEyIDk3LjU2IDEwNC41NiA5NS40MjY3IDEwMS40NjcgOTQuMjUzM0M5Ny41MiA5Mi42NTMzIDkzLjI1MzMgOTIuMDEzMyA4OC44OCA5Mi4xMkM4Ni4xMDY3IDkyLjEyIDgzLjY1MzMgOTIuMTIgODEuNjI2NyA5Mi4yMjY3Qzc5LjQ5MzMgOTIuMTIgNzggOTIuMjI2NyA3Ny4yNTMzIDkyLjMzMzNWOTIuMzMzM1oiLz48cGF0aCBmaWxsPSIjOTlGIiBkPSJNMTUwIDk4LjYyNjdIMTY4LjY2N0MxNjkuNzM0IDk4LjYyNjcgMTcwLjU4NyA5OS4zNzMzIDE3MC45MDcgMTAwLjMzM0MxNzEuMjI3IDEwMS4xODcgMTcxLjQ0IDEwMi4wNCAxNzEuNTQ3IDEwM0MxNzEuNzYgMTA0LjA2NyAxNzEuOTc0IDEwNS4yNCAxNzIuMDggMTA2LjMwN0MxNzIuMTg3IDEwNy40OCAxNzIuMjk0IDEwOC43NiAxNzIuMjk0IDExMC4xNDdDMTc1LjQ5NCAxMDYuNDEzIDE3OS4zMzQgMTAzLjMyIDE4My43MDcgMTAwLjk3M0MxODguNjE0IDk4LjIgMTk0LjI2NyA5Ni44MTMzIDE5OS45MiA5Ni44MTMzQzIwMC42NjcgOTYuNzA2NyAyMDEuMzA3IDk3LjI0IDIwMS40MTQgOTcuOTg2N1Y5OC40MTMzVjExOS4yMTNDMjAxLjQxNCAxMjAuMDY3IDIwMC44OCAxMjAuMzg3IDE5OS43MDcgMTIwLjM4N0MxOTUuODY3IDEyMC4yOCAxOTEuOTIgMTIwLjYgMTg4LjE4NyAxMjEuNDUzQzE4NS4wOTQgMTIyLjA5MyAxODIuMTA3IDEyMy4wNTMgMTc5LjIyNyAxMjQuMzMzQzE3Ny4yIDEyNS4yOTMgMTc1LjI4IDEyNi41NzMgMTczLjc4NyAxMjguMjhWMTgyLjY4QzE3My43ODcgMTgzLjc0NyAxNzMuMzYgMTg0LjE3MyAxNzIuNCAxODQuMTczSDE1MS4zODdDMTUwLjUzNCAxODQuMjggMTQ5Ljc4NyAxODMuNzQ3IDE0OS42OCAxODIuODkzVjE4Mi40NjdWMTIzLjM3M0MxNDkuNjggMTIwLjgxMyAxNDkuNjggMTE4LjE0NyAxNDkuNTc0IDExNS4zNzNDMTQ5LjQ2NyAxMTIuNiAxNDkuNDY3IDEwOS44MjcgMTQ5LjM2IDEwNy4wNTNDMTQ5LjM2IDEwNC42IDE0OS4xNDcgMTAyLjI1MyAxNDguOTM0IDk5LjhDMTQ4LjgyNyA5OS4yNjY3IDE0OS4xNDcgOTguNzMzMyAxNDkuNjggOTguNjI2N0MxNDkuNjggOTguNTIgMTQ5Ljg5NCA5OC41MiAxNTAgOTguNjI2N1Y5OC42MjY3WiIvPjwvc3ZnPjwvc3ZnPg==\"/><image x=\"654\" y=\"42\" width=\"48\" height=\"48\" href=\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAyNTYgMjU2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0ibm9uZSIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSIjMDAwMDVCIiByeD0iNjAiLz48cGF0aCBmaWxsPSIjOTlGIiBkPSJNMTA1LjE1NyAxNTYuMTJINjUuNDc2OUw1Ny4zNzAyIDE4MS4yOTNDNTcuMTU2OSAxODIuMjUzIDU2LjMwMzUgMTgyLjg5MyA1NS4zNDM1IDE4Mi43ODdIMzUuMjkwMkMzNC4xMTY5IDE4Mi43ODcgMzMuNzk2OSAxODIuMTQ3IDM0LjExNjkgMTgwLjg2N0w2OC40NjM1IDgyLjQxMzNDNjguNzgzNSA4MS4zNDY3IDY5LjEwMzUgODAuMzg2NyA2OS41MzAyIDc5LjEwNjdDNjkuOTU2OSA3Ni44NjY3IDcwLjE3MDIgNzQuNTIgNzAuMTcwMiA3Mi4xNzMzQzcwLjA2MzUgNzEuNjQgNzAuNDkwMiA3MS4xMDY3IDcxLjAyMzUgNzFINzEuMzQzNUg5OC42NTAyQzk5LjM5NjkgNzEgOTkuOTMwMiA3MS4zMiAxMDAuMDM3IDcxLjg1MzNMMTM4Ljk3IDE4MC42NTNDMTM5LjI5IDE4MS44MjcgMTM4Ljk3IDE4Mi4zNiAxMzcuOTA0IDE4Mi4zNkgxMTUuNjFDMTE0Ljg2NCAxODIuNDY3IDExNC4xMTcgMTgxLjkzMyAxMTMuOTA0IDE4MS4xODdMMTA1LjE1NyAxNTUuNTg3VjE1Ni4xMlpNNzEuNjYzNSAxMzQuODkzSDk4Ljc1NjhDOTguMTE2OCAxMzIuNjUzIDk3LjI2MzUgMTI5Ljk4NyA5Ni4zMDM1IDEyNy4yMTNDOTUuMzQzNSAxMjQuMzMzIDk0LjM4MzUgMTIxLjI0IDkzLjQyMzUgMTE4LjA0QzkyLjM1NjkgMTE0LjczMyA5MS4zOTY4IDExMS41MzMgOTAuMzMwMiAxMDguMjI3Qzg5LjI2MzUgMTA0LjkyIDg4LjMwMzUgMTAxLjgyNyA4Ny40NTAyIDk4LjczMzNDODYuNTk2OSA5NS43NDY3IDg1Ljg1MDIgOTIuOTczMyA4NS4xMDM1IDkwLjQxMzNIODQuODkwMkM4My45MzAyIDk1IDgyLjc1NjkgOTkuNTg2NyA4MS4yNjM1IDEwNC4xNzNDNzkuNjYzNSAxMDkuMjkzIDc4LjA2MzUgMTE0LjYyNyA3Ni4zNTY5IDExOS45NkM3NC45NzAyIDEyNS40IDczLjI2MzUgMTMwLjQxMyA3MS42NjM1IDEzNC44OTNWMTM0Ljg5M1oiLz48cGF0aCBmaWxsPSIjOTlGIiBkPSJNMjAxLjc5NyAxNDYuNTJIMTY3Ljk4NEMxNjguNDEgMTQ5LjgyNyAxNjkuNDc3IDE1My4xMzMgMTcxLjI5IDE1Ni4wMTNDMTczLjIxIDE1OC44OTMgMTc1Ljg3NyAxNjEuMTMzIDE3OS4wNzcgMTYyLjQxM0MxODMuMzQ0IDE2NC4yMjcgMTg4LjAzNyAxNjUuMTg3IDE5Mi43MyAxNjUuMDhDMTk2LjQ2NCAxNjQuOTczIDIwMC4xOTcgMTY0LjY1MyAyMDMuODI0IDE2My45MDdDMjA3LjEzIDE2My40OCAyMTAuMzMgMTYyLjYyNyAyMTMuMzE3IDE2MS40NTNDMjEzLjg1IDE2MS4wMjcgMjE0LjE3IDE2MS4yNCAyMTQuMTcgMTYyLjMwN1YxNzguNjI3QzIxNC4xNyAxNzkuMDUzIDIxNC4wNjQgMTc5LjQ4IDIxMy45NTcgMTc5LjkwN0MyMTMuNzQ0IDE4MC4yMjcgMjEzLjUzIDE4MC40NCAyMTMuMjEgMTgwLjY1M0MyMDkuNzk3IDE4Mi4xNDcgMjA2LjI3NyAxODMuMjEzIDIwMi41NDQgMTgzLjg1M0MxOTcuNTMgMTg0LjgxMyAxOTIuNTE3IDE4NS4yNCAxODcuMzk3IDE4NS4xMzNDMTc5LjI5IDE4NS4xMzMgMTcyLjQ2NCAxODMuODUzIDE2Ni45MTcgMTgxLjRDMTYxLjY5IDE3OS4xNiAxNTcuMTA0IDE3NS42NCAxNTMuNDc3IDE3MS4yNjdDMTUwLjA2NCAxNjcuMTA3IDE0Ny42MSAxNjIuNDEzIDE0Ni4xMTcgMTU3LjI5M0MxNDQuNjI0IDE1Mi4yOCAxNDMuODc3IDE0Ny4wNTMgMTQzLjg3NyAxNDEuNzJDMTQzLjg3NyAxMzUuOTYgMTQ0LjczIDEzMC4zMDcgMTQ2LjU0NCAxMjQuNzZDMTQ4LjI1IDExOS40MjcgMTUwLjkxNyAxMTQuNTIgMTU0LjU0NCAxMTAuMTQ3QzE1OC4wNjQgMTA1Ljg4IDE2Mi40MzcgMTAyLjQ2NyAxNjcuNDUgMTAwLjAxM0MxNzIuNDY0IDk3LjU2IDE3OC40MzcgOTYuNzA2NyAxODUuMjY0IDk2LjcwNjdDMTkwLjkxNyA5Ni42IDE5Ni41NyA5Ny42NjY3IDIwMS43OTcgMTAwLjAxM0MyMDYuMTcgMTAxLjkzMyAyMTAuMDEgMTA0LjgxMyAyMTIuOTk3IDEwOC41NDdDMjE1Ljc3IDExMi4xNzMgMjE4LjAxIDExNi4yMjcgMjE5LjM5NyAxMjAuNzA3QzIyMC43ODQgMTI0Ljk3MyAyMjEuNDI0IDEyOS4zNDcgMjIxLjQyNCAxMzMuNzJDMjIxLjQyNCAxMzYuMjggMjIxLjMxNyAxMzguNTIgMjIxLjIxIDE0MC41NDdDMjIwLjk5NyAxNDIuNTczIDIyMC44OSAxNDQuMDY3IDIyMC43ODQgMTQ1LjAyN0MyMjAuNjc3IDE0NS43NzMgMjIwLjAzNyAxNDYuNDEzIDIxOS4yOSAxNDYuNDEzQzIxOC42NSAxNDYuNDEzIDIxNy40NzcgMTQ2LjUyIDIxNS43NyAxNDYuNjI3QzIxNC4wNjQgMTQ2Ljg0IDIxMi4wMzcgMTQ2Ljk0NyAyMDkuNTg0IDE0Ni45NDdDMjA3LjEzIDE0Ni45NDcgMjA0LjU3IDE0Ni41MiAyMDEuNzk3IDE0Ni41MlYxNDYuNTJaTTE2Ny45ODQgMTMwLjk0N0gxOTAuNDlDMTkzLjI2NCAxMzAuOTQ3IDE5NS4yOSAxMzAuOTQ3IDE5Ni41NyAxMzAuODRDMTk3LjQyNCAxMzAuNzMzIDE5OC4yNzcgMTMwLjUyIDE5OS4wMjQgMTI5Ljk4N1YxMjguOTJDMTk5LjAyNCAxMjcuNTMzIDE5OC44MSAxMjYuMjUzIDE5OC4zODQgMTI0Ljk3M0MxOTYuNDY0IDExOSAxOTAuODEgMTE0Ljk0NyAxODQuNTE3IDExNS4xNkMxNzguNjUgMTE0Ljg0IDE3My4xMDQgMTE3LjkzMyAxNzAuMzMgMTIzLjI2N0MxNjkuMDUgMTI1LjcyIDE2OC4zMDQgMTI4LjI4IDE2Ny45ODQgMTMwLjk0N1oiLz48L3N2Zz48L3N2Zz4=\"/></svg>";
function serveStack() {
  return new Response(STACK_SVG, {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
      "access-control-allow-origin": "*",
    },
  });
}


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

async function fetchContributionsAPI() {
  const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`, {
    headers: { "User-Agent": "portfolio-worker" },
  });
  if (!res.ok) throw new Error("contributions api failed");
  const json = await res.json();
  if (!json?.contributions?.length) throw new Error("empty contributions");
  const days = json.contributions.map((c) => ({
    date: c.date,
    count: c.count,
  }));
  const total = json.total?.lastYear ?? days.reduce((sum, d) => sum + d.count, 0);
  return { source: "contributions-api", days, total };
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
  if (!data) {
    try {
      data = await fetchContributionsAPI();
    } catch (_) {}
  }
  if (!data && snapshot?.days?.length) {
    data = normalizeSnapshot(snapshot);
  }
  if (data && data.source === "snapshot") {
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

function renderHeader(themeName) {
  const dark = themeName !== "light";
  const W = 900, H = 180;
  const ink = dark ? "#f6f7fb" : "#0b1220";
  const sub = dark ? "rgba(230,237,243,.5)" : "rgba(11,18,32,.55)";
  const dot = dark ? "rgba(255,255,255,.045)" : "rgba(11,18,32,.045)";
  const orbO = dark ? 0.14 : 0.09;
  const scanCol = dark ? "rgba(52,211,153,.12)" : "rgba(5,150,105,.10)";
  const gridLine = dark ? "rgba(255,255,255,.06)" : "rgba(11,18,32,.06)";
  const nameStops = dark
    ? ["#ffffff", "#eafff4", "#9ff0c8"]
    : ["#0b1220", "#0f3d2e", "#065f46"];

  const name = "AARAV GOEL";
  const tagline = "FULL-STACK DEVELOPER &#183; AI BUILDER &#183; CREATIVE EDITOR";
  const nameChars = name.split("");

  const charAnims = nameChars.map((ch, i) => {
    const bw = i * 32;
    return `<tspan fill-opacity="0">${ch}<animate attributeName="fill-opacity" from="0" to="1" begin="${0.4 + i * 0.07}s" dur="0.35s" fill="freeze"/></tspan>`;
  }).join("");

  const lineAnims = nameChars.map((ch, i) => {
    const bw = i * 32;
    const cx = W / 2 - (nameChars.length * 32) / 2 + bw + 16;
    return `<line x1="${cx}" y1="58" x2="${cx}" y2="88" stroke="url(#ul)" stroke-width="2.5" stroke-linecap="round" opacity="0"><animate attributeName="opacity" from="0" to=".7" begin="${0.5 + i * 0.07}s" dur="0.2s" fill="freeze"/><animate attributeName="y1" from="72" to="58" begin="${0.5 + i * 0.07}s" dur="0.3s" fill="freeze"/><animate attributeName="y2" from="72" to="88" begin="${0.5 + i * 0.07}s" dur="0.3s" fill="freeze"/></line>`;
  }).join("");

  const particles = [];
  for (let i = 0; i < 18; i++) {
    const px = 40 + Math.random() * (W - 80);
    const py = 10 + Math.random() * (H - 20);
    const pr = 0.8 + Math.random() * 1.2;
    const pdur = 8 + Math.random() * 12;
    const pdel = Math.random() * 6;
    const colors = ["#34d399", "#22d3ee", "#a78bfa", "#f59e0b"];
    const col = colors[i % 4];
    particles.push(
      `<circle cx="${px}" cy="${py}" r="${pr}" fill="${col}" opacity="0"><animate attributeName="opacity" values="0;.5;0" dur="${pdur}s" begin="${pdel}s" repeatCount="indefinite"/><animate attributeName="cy" values="${py};${py - 12 - Math.random() * 10};${py}" dur="${pdur}s" begin="${pdel}s" repeatCount="indefinite"/></circle>`
    );
  }

  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
<linearGradient id="ng" x1="0" y1="0" x2="1" y2="0">
<stop offset="0%" stop-color="${nameStops[0]}"/>
<stop offset="50%" stop-color="${nameStops[1]}"/>
<stop offset="100%" stop-color="${nameStops[2]}"/>
</linearGradient>
<linearGradient id="ul" x1="0" y1="0" x2="1" y2="0">
<stop offset="0%" stop-color="#34d399"/>
<stop offset="50%" stop-color="#22d3ee"/>
<stop offset="100%" stop-color="#a78bfa"/>
</linearGradient>
<linearGradient id="shine" x1="0" y1="0" x2="1" y2="0">
<stop offset="0%" stop-color="#fff" stop-opacity="0"/>
<stop offset="40%" stop-color="#fff" stop-opacity=".08"/>
<stop offset="60%" stop-color="#fff" stop-opacity=".08"/>
<stop offset="100%" stop-color="#fff" stop-opacity="0"/>
</linearGradient>
<linearGradient id="scanG" x1="0" y1="0" x2="0" y2="1">
<stop offset="0%" stop-color="#34d399" stop-opacity="0"/>
<stop offset="50%" stop-color="#34d399" stop-opacity=".18"/>
<stop offset="100%" stop-color="#34d399" stop-opacity="0"/>
</linearGradient>
<pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">
<circle cx="2" cy="2" r="1" fill="${dot}"/>
</pattern>
<pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
<line x1="60" y1="0" x2="60" y2="60" stroke="${gridLine}" stroke-width=".5"/>
<line x1="0" y1="60" x2="60" y2="60" stroke="${gridLine}" stroke-width=".5"/>
</pattern>
<filter id="blur" x="-80%" y="-80%" width="260%" height="260%">
<feGaussianBlur stdDeviation="28"/>
</filter>
<filter id="tglow" x="-20%" y="-20%" width="140%" height="140%">
<feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b"/>
<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
<clipPath id="rp"><rect width="${W}" height="${H}" rx="18"/></clipPath>
</defs>`,

    `<g clip-path="url(#rp)">
<rect width="${W}" height="${H}" fill="${dark ? "#0d1117" : "#f8fafc"}"/>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="18" fill="none" stroke="rgba(255,255,255,.08)"/>
<rect width="${W}" height="${H}" fill="url(#grid)"/>
<rect width="${W}" height="${H}" fill="url(#dots)"/>
</g>`,

    `<g filter="url(#blur)" opacity="${orbO}">
<ellipse cx="130" cy="35" rx="110" ry="48" fill="#34d399">
<animate attributeName="cx" values="130;170;130" dur="14s" repeatCount="indefinite"/>
<animate attributeName="cy" values="35;25;35" dur="11s" repeatCount="indefinite"/>
</ellipse>
<ellipse cx="770" cy="42" rx="100" ry="40" fill="#22d3ee">
<animate attributeName="cx" values="770;730;770" dur="12s" repeatCount="indefinite"/>
<animate attributeName="cy" values="42;55;42" dur="15s" repeatCount="indefinite"/>
</ellipse>
<ellipse cx="450" cy="165" rx="120" ry="42" fill="#a78bfa">
<animate attributeName="cx" values="450;500;450" dur="16s" repeatCount="indefinite"/>
<animate attributeName="cy" values="165;150;165" dur="13s" repeatCount="indefinite"/>
</ellipse>
</g>`,

    particles.join("\n"),

    `<g filter="url(#tglow)">
<text x="${W / 2}" y="78" text-anchor="middle" font-family="${SANS}" font-size="52" font-weight="800" letter-spacing="8" fill="url(#ng)">
${charAnims}
</text>
</g>`,

    lineAnims,

    `<rect x="${W / 2 - 130}" y="96" width="0" height="2.5" rx="1.25" fill="url(#ul)">
<animate attributeName="width" from="0" to="260" begin="1.6s" dur="0.6s" fill="freeze"/>
<animate attributeName="x" from="${W / 2}" to="${W / 2 - 130}" begin="1.6s" dur="0.6s" fill="freeze"/>
</rect>`,

    `<text x="${W / 2}" y="124" text-anchor="middle" font-family="${MON_FONT}" font-size="13.5" letter-spacing="5" fill="${sub}" fill-opacity="0">
${tagline}
<animate attributeName="fill-opacity" from="0" to="1" begin="2.2s" dur="0.8s" fill="freeze"/>
</text>`,

    `<rect x="0" y="0" width="${W}" height="2" fill="url(#scanG)" opacity="0">
<animate attributeName="y" from="-4" to="${H + 4}" dur="3.5s" begin="0.3s" repeatCount="indefinite"/>
<animate attributeName="opacity" from="0" to="1" begin="0.3s" dur="0.5s" fill="freeze"/>
</rect>`,

    `<rect width="160" height="${H}" fill="url(#shine)" transform="translate(-200 0)">
<animateTransform attributeName="transform" type="translate" values="-200 0;${W + 200} 0" dur="5s" begin="3s" repeatCount="indefinite"/>
</rect>`,

    `<line x1="40" y1="${H - 1}" x2="${W - 40}" y2="${H - 1}" stroke="url(#ul)" stroke-width="1" opacity=".2" stroke-linecap="round"/>`,

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

export const __internals = { renderCalendar, renderGraph, computeLevels, renderStats };

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
  return new Response(renderHeader(theme), {
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

    const cleanPath = p.toLowerCase();
    
    if (p === "/github/calendar.svg" || p === "/github/calendar")
      return serveWidget(request, "calendar", env, ctx);

    if (p === "/github/graph.svg" || p === "/github/graph")
      return serveWidget(request, "graph", env, ctx);

    if (p === "/github/data") return serveData(request, env, ctx);

    const badgeMatch = p.match(/^\/badge\/([a-z]+)(?:\.svg)?$/);
    if (badgeMatch) return serveBadge(request, badgeMatch[1]);

    if (p === "/banner.svg" || p === "/banner") return serveBanner(request);
    if (p === "/github/header.svg" || p === "/github/header") return serveBanner(request);
    if (p === "/stats.svg" || p === "/stats" || p === "/github/stats.svg" || p === "/github/stats")
      return serveStats(request);

    let res = await env.ASSETS.fetch(request);
    // Add CORS + correct content-type for self-hosted SVG icons
    if (p.startsWith("/icons/") && p.endsWith(".svg") && res.status < 400) {
      return new Response(res.body, {
        status: res.status,
        headers: {
          "content-type": "image/svg+xml; charset=utf-8",
          "cache-control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
          "access-control-allow-origin": "*",
        },
      });
    }
    if (res.status === 404 && !p.includes(".")) {
      const htmlUrl = new URL(request.url);
      htmlUrl.pathname = `${p}.html`;
      const htmlRes = await env.ASSETS.fetch(new Request(htmlUrl.toString(), request));
      if (htmlRes.status < 400) return htmlRes;
    }
    return res;
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
