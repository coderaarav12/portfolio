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
const STACK_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"722\" height=\"106\" viewBox=\"0 0 722 106\"><rect width=\"722\" height=\"106\" fill=\"#0d1117\" rx=\"12\"/><text x=\"131\" y=\"30\" text-anchor=\"middle\" font-family=\"'Segoe UI',system-ui,sans-serif\" font-size=\"11\" font-weight=\"600\" letter-spacing=\"0.08em\" fill=\"#8b949e\" opacity=\"0.9\">LANGUAGES</text><g transform=\"translate(20,42) scale(0.1875)\"><rect width=\"256\" height=\"256\" rx=\"60\" fill=\"#F0DB4F\"/>\n<path d=\"M67.3117 213.932L86.9027 202.076C90.6821 208.777 94.1202 214.447 102.367 214.447C110.272 214.447 115.256 211.355 115.256 199.327V117.529H139.314V199.667C139.314 224.584 124.708 235.926 103.398 235.926C84.1533 235.926 72.9819 225.959 67.3113 213.93\" fill=\"#323330\"/>\n<path d=\"M152.381 211.354L171.969 200.013C177.126 208.434 183.828 214.62 195.684 214.62C205.653 214.62 212.009 209.636 212.009 202.762C212.009 194.514 205.479 191.592 194.481 186.782L188.468 184.203C171.111 176.815 159.597 167.535 159.597 147.945C159.597 129.901 173.345 116.153 194.826 116.153C210.12 116.153 221.118 121.481 229.022 135.4L210.291 147.429C206.166 140.04 201.7 137.119 194.826 137.119C187.78 137.119 183.312 141.587 183.312 147.429C183.312 154.646 187.78 157.568 198.09 162.037L204.104 164.614C224.553 173.379 236.067 182.313 236.067 202.418C236.067 224.072 219.055 235.928 196.2 235.928C173.861 235.928 159.426 225.274 152.381 211.354\" fill=\"#323330\"/></g><g transform=\"translate(78,42) scale(0.1875)\"><rect width=\"256\" height=\"256\" fill=\"#007ACC\" rx=\"60\"/><path fill=\"#fff\" d=\"M56.6112 128.849L56.5299 139.333H73.1902H89.8505L89.8505 186.673V234.012H101.635H113.419V186.673L113.419 139.333H130.079H146.739V129.052C146.739 123.363 146.618 118.609 146.455 118.487C146.333 118.325 126.056 118.243 101.472 118.284L56.7331 118.406L56.6112 128.849Z\"/><path fill=\"#fff\" d=\"M206.567 118.108C213.068 119.734 218.026 122.619 222.577 127.332C224.934 129.852 228.428 134.444 228.713 135.541C228.794 135.866 217.66 143.343 210.915 147.528C210.671 147.691 209.695 146.634 208.598 145.009C205.307 140.214 201.853 138.141 196.57 137.776C188.809 137.247 183.811 141.311 183.852 148.097C183.852 150.088 184.136 151.266 184.949 152.892C186.655 156.427 189.825 158.54 199.781 162.847C218.107 170.731 225.949 175.932 230.826 183.327C236.271 191.576 237.49 204.742 233.792 214.535C229.729 225.181 219.651 232.414 205.469 234.812C201.081 235.584 190.678 235.462 185.965 234.609C175.684 232.78 165.932 227.701 159.918 221.037C157.561 218.436 152.969 211.65 153.254 211.162C153.375 211 154.432 210.35 155.61 209.659C156.748 209.009 161.056 206.53 165.119 204.173L172.474 199.906L174.018 202.182C176.172 205.473 180.885 209.984 183.73 211.487C191.897 215.795 203.113 215.185 208.639 210.228C210.996 208.074 211.971 205.839 211.971 202.548C211.971 199.581 211.605 198.281 210.061 196.046C208.07 193.202 204.007 190.804 192.466 185.806C179.26 180.117 173.571 176.582 168.37 170.974C165.363 167.724 162.518 162.522 161.34 158.174C160.365 154.558 160.121 145.496 160.893 141.839C163.615 129.08 173.246 120.181 187.143 117.539C191.654 116.686 202.137 117.011 206.567 118.108Z\"/></g><g transform=\"translate(136,42) scale(0.1875)\"><rect width=\"256\" height=\"256\" fill=\"#242938\" rx=\"60\"/><path fill=\"url(#paint0_linear_2_47)\" d=\"M127.279 29C76.5066 29 79.6772 51.018 79.6772 51.018L79.7338 73.8284H128.185V80.6772H60.4893C60.4893 80.6772 28 76.9926 28 128.222C28 179.452 56.3573 177.636 56.3573 177.636H73.2812V153.863C73.2812 153.863 72.369 125.506 101.186 125.506H149.24C149.24 125.506 176.239 125.942 176.239 99.4123V55.5461C176.239 55.5461 180.338 29 127.279 29ZM100.563 44.339C105.384 44.339 109.28 48.2351 109.28 53.0556C109.28 57.8761 105.384 61.7723 100.563 61.7723C95.7426 61.7723 91.8465 57.8761 91.8465 53.0556C91.8465 48.2351 95.7426 44.339 100.563 44.339Z\"/><path fill=\"url(#paint1_linear_2_47)\" d=\"M128.721 227.958C179.493 227.958 176.323 205.941 176.323 205.941L176.266 183.13H127.815V176.281H195.511C195.511 176.281 228 179.966 228 128.736C228 77.5062 199.643 79.323 199.643 79.323H182.719V103.096C182.719 103.096 183.631 131.453 154.814 131.453H106.76C106.76 131.453 79.7607 131.016 79.7607 157.546V201.412C79.7607 201.412 75.6615 227.958 128.721 227.958ZM155.437 212.619C150.616 212.619 146.72 208.723 146.72 203.903C146.72 199.082 150.616 195.186 155.437 195.186C160.257 195.186 164.154 199.082 164.154 203.903C164.154 208.723 160.257 212.619 155.437 212.619Z\"/><defs><linearGradient id=\"paint0_linear_2_47\" x1=\"47.22\" x2=\"146.333\" y1=\"46.896\" y2=\"145.02\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#387EB8\"/><stop offset=\"1\" stop-color=\"#366994\"/></linearGradient><linearGradient id=\"paint1_linear_2_47\" x1=\"108.056\" x2=\"214.492\" y1=\"109.905\" y2=\"210.522\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#FFE052\"/><stop offset=\"1\" stop-color=\"#FFC331\"/></linearGradient></defs></g><g transform=\"translate(194,42) scale(0.1875)\"><rect width=\"256\" height=\"256\" fill=\"#00599C\" rx=\"60\"/><path fill=\"#fff\" d=\"M110.759 210.517C65.1254 210.517 28 173.392 28 127.759C28 82.1254 65.1254 45 110.759 45C140.204 45 167.667 60.8458 182.427 86.3533L146.611 107.079C139.224 94.3111 125.485 86.3793 110.759 86.3793C87.9416 86.3793 69.3793 104.942 69.3793 127.759C69.3793 150.575 87.9416 169.138 110.759 169.138C125.486 169.138 139.225 161.206 146.613 148.436L182.429 169.161C167.669 194.671 140.206 210.517 110.759 210.517Z\"/><path fill=\"#fff\" d=\"M193.517 123.161H184.321V113.965H175.127V123.161H165.931V132.356H175.127V141.552H184.321V132.356H193.517V123.161Z\"/><path fill=\"#fff\" d=\"M228 123.161H218.804V113.965H209.61V123.161H200.414V132.356H209.61V141.552H218.804V132.356H228V123.161Z\"/></g><text x=\"294\" y=\"30\" text-anchor=\"middle\" font-family=\"'Segoe UI',system-ui,sans-serif\" font-size=\"11\" font-weight=\"600\" letter-spacing=\"0.08em\" fill=\"#8b949e\" opacity=\"0.9\">FRAMEWORKS</text><g transform=\"translate(270,42) scale(0.1875)\"><rect width=\"256\" height=\"256\" fill=\"#242938\" rx=\"60\"/><path fill=\"#00D8FF\" d=\"M128.001 146.951C138.305 146.951 146.657 138.598 146.657 128.295C146.657 117.992 138.305 109.639 128.001 109.639C117.698 109.639 109.345 117.992 109.345 128.295C109.345 138.598 117.698 146.951 128.001 146.951Z\"/><path fill-rule=\"evenodd\" stroke=\"#00D8FF\" stroke-width=\"8.911\" d=\"M128.002 90.3633C153.05 90.3633 176.319 93.9575 193.864 99.9976C215.003 107.275 228 118.306 228 128.295C228 138.704 214.226 150.423 191.525 157.944C174.363 163.63 151.779 166.598 128.002 166.598C103.624 166.598 80.5389 163.812 63.1834 157.881C41.2255 150.376 28 138.506 28 128.295C28 118.387 40.4096 107.441 61.2515 100.175C78.8617 94.0353 102.705 90.3633 127.998 90.3633H128.002Z\" clip-rule=\"evenodd\"/><path fill-rule=\"evenodd\" stroke=\"#00D8FF\" stroke-width=\"8.911\" d=\"M94.9811 109.438C107.495 87.7402 122.232 69.3783 136.23 57.1971C153.094 42.5206 169.144 36.7728 177.796 41.7623C186.813 46.9623 190.084 64.7496 185.259 88.1712C181.614 105.879 172.9 126.925 161.021 147.523C148.842 168.641 134.897 187.247 121.09 199.315C103.619 214.587 86.7284 220.114 77.8833 215.013C69.3003 210.067 66.0181 193.846 70.1356 172.161C73.6145 153.838 82.3451 131.349 94.977 109.438L94.9811 109.438Z\" clip-rule=\"evenodd\"/><path fill-rule=\"evenodd\" stroke=\"#00D8FF\" stroke-width=\"8.911\" d=\"M95.0123 147.578C82.4633 125.904 73.9194 103.962 70.3531 85.7517C66.0602 63.8109 69.0954 47.0355 77.7401 42.0315C86.7485 36.8163 103.792 42.866 121.674 58.7437C135.194 70.7479 149.077 88.8052 160.99 109.383C173.204 130.481 182.358 151.856 185.919 169.844C190.425 192.608 186.778 210.001 177.941 215.116C169.367 220.08 153.676 214.825 136.945 200.427C122.809 188.263 107.685 169.468 95.0123 147.578Z\" clip-rule=\"evenodd\"/></g><text x=\"457\" y=\"30\" text-anchor=\"middle\" font-family=\"'Segoe UI',system-ui,sans-serif\" font-size=\"11\" font-weight=\"600\" letter-spacing=\"0.08em\" fill=\"#8b949e\" opacity=\"0.9\">CLOUD & DEVOPS</text><g transform=\"translate(346,42) scale(0.1875)\"><rect width=\"256\" height=\"256\" fill=\"#242938\" rx=\"60\"/><g clip-path=\"url(#clip0_4_272)\"><path fill=\"#fff\" d=\"M79 171.75H211.356V135.125L186.212 120.706L181.875 118.831L79 119.537V171.75Z\"/><path fill=\"#F38020\" d=\"M165.575 166.887C166.806 162.669 166.338 158.8 164.288 155.925C162.413 153.287 159.244 151.762 155.438 151.587L83.2813 150.65C82.8125 150.65 82.4063 150.412 82.1688 150.062C81.9313 149.712 81.875 149.25 81.9938 148.775C82.2313 148.069 82.9313 147.544 83.6938 147.487L156.494 146.55C165.119 146.137 174.494 139.162 177.769 130.612L181.931 119.769C182.115 119.323 182.158 118.833 182.056 118.362C177.369 97.1437 158.431 81.3187 135.806 81.3187C114.931 81.3187 97.2438 94.8 90.9063 113.506C86.8 110.456 81.5313 108.819 75.9563 109.344C65.9313 110.344 57.8313 118.369 56.9063 128.394C56.6634 130.887 56.8408 133.403 57.4313 135.837C49.5447 136.051 42.0537 139.337 36.5556 144.995C31.0574 150.653 27.9874 158.236 28 166.125C28 167.587 28.125 169.062 28.2938 170.519C28.4188 171.225 29 171.75 29.7 171.75H162.875C163.258 171.743 163.629 171.614 163.934 171.383C164.24 171.151 164.464 170.829 164.575 170.462L165.575 166.887V166.887Z\"/><path fill=\"#FAAE40\" d=\"M188.55 120.519L186.55 120.581C186.081 120.581 185.675 120.931 185.487 121.394L182.675 131.181C181.444 135.4 181.912 139.269 183.962 142.144C185.837 144.781 189.006 146.306 192.812 146.481L208.169 147.419C208.637 147.419 209.044 147.656 209.281 148.006C209.519 148.356 209.575 148.881 209.456 149.294C209.219 150 208.519 150.525 207.756 150.581L191.756 151.519C183.081 151.931 173.756 158.906 170.481 167.456L169.306 170.444C169.069 171.031 169.481 171.619 170.119 171.619H225.1C225.418 171.623 225.729 171.522 225.983 171.331C226.238 171.14 226.422 170.869 226.506 170.562C227.481 167.096 227.983 163.513 228 159.912C227.97 149.465 223.802 139.454 216.409 132.072C209.015 124.69 198.998 120.538 188.55 120.525\"/></g><defs><clipPath id=\"clip0_4_272\"><rect width=\"200\" height=\"200\" fill=\"#fff\" transform=\"translate(28 28)\"/></clipPath></defs></g><g transform=\"translate(404,42) scale(0.1875)\"><rect width=\"256\" height=\"256\" rx=\"60\" fill=\"#242938\"/>\n<path d=\"M128.001 30C72.7791 30 28 74.7708 28 130.001C28 174.184 56.6533 211.668 96.3867 224.891C101.384 225.817 103.219 222.722 103.219 220.081C103.219 217.696 103.126 209.819 103.083 201.463C75.2631 207.512 69.3927 189.664 69.3927 189.664C64.8437 178.105 58.2894 175.032 58.2894 175.032C49.2163 168.825 58.9733 168.953 58.9733 168.953C69.0151 169.658 74.3026 179.258 74.3026 179.258C83.2217 194.546 97.6965 190.126 103.403 187.571C104.301 181.107 106.892 176.696 109.752 174.199C87.5405 171.67 64.1913 163.095 64.1913 124.778C64.1913 113.86 68.0977 104.939 74.4947 97.9362C73.4564 95.4175 70.0335 85.2465 75.4635 71.4722C75.4635 71.4722 83.8609 68.7845 102.971 81.7226C110.948 79.5069 119.502 78.3958 128.001 78.3577C136.499 78.3958 145.061 79.5069 153.052 81.7226C172.139 68.7845 180.525 71.4722 180.525 71.4722C185.968 85.2465 182.544 95.4175 181.505 97.9362C187.917 104.939 191.797 113.86 191.797 124.778C191.797 163.187 168.403 171.644 146.135 174.119C149.722 177.223 152.918 183.308 152.918 192.638C152.918 206.018 152.802 216.787 152.802 220.081C152.802 222.742 154.602 225.86 159.671 224.878C199.383 211.64 228 174.169 228 130.001C228 74.7708 183.227 30 128.001 30ZM65.4536 172.453C65.2333 172.95 64.4517 173.099 63.7396 172.758C63.0143 172.432 62.6069 171.754 62.8421 171.256C63.0574 170.744 63.8406 170.602 64.5643 170.945C65.2913 171.271 65.7053 171.955 65.4536 172.453ZM70.3725 176.842C69.8956 177.285 68.9633 177.079 68.3307 176.38C67.6766 175.683 67.554 174.751 68.0376 174.302C68.5294 173.86 69.4336 174.067 70.0893 174.764C70.7434 175.47 70.8709 176.395 70.3725 176.842ZM73.7471 182.458C73.1344 182.884 72.1325 182.485 71.5132 181.595C70.9004 180.706 70.9004 179.64 71.5264 179.212C72.1474 178.785 73.1344 179.169 73.762 180.052C74.373 180.956 74.373 182.023 73.7471 182.458ZM79.4542 188.962C78.9061 189.566 77.7386 189.404 76.8841 188.579C76.0098 187.773 75.7663 186.629 76.3161 186.024C76.8709 185.418 78.045 185.589 78.9061 186.407C79.7738 187.211 80.0387 188.364 79.4542 188.962ZM86.8301 191.157C86.5883 191.941 85.4639 192.297 84.3312 191.964C83.2002 191.621 82.46 190.704 82.6885 189.912C82.9237 189.124 84.053 188.753 85.194 189.109C86.3234 189.45 87.0652 190.361 86.8301 191.157ZM95.2242 192.089C95.2523 192.913 94.2919 193.597 93.1029 193.612C91.9073 193.639 90.9402 192.971 90.9269 192.16C90.9269 191.327 91.8659 190.65 93.0615 190.63C94.2505 190.607 95.2242 191.269 95.2242 192.089ZM103.47 191.773C103.613 192.577 102.787 193.404 101.606 193.624C100.445 193.836 99.3702 193.339 99.2229 192.541C99.0788 191.716 99.92 190.89 101.079 190.676C102.262 190.471 103.32 190.955 103.47 191.773Z\" fill=\"white\"/></g><g transform=\"translate(462,42) scale(0.1875)\"><rect width=\"256\" height=\"256\" fill=\"#2396ED\" rx=\"60\"/><path fill=\"#fff\" d=\"M141.187 122.123H161.904V103.379H141.187V122.123ZM116.525 122.123H137.241V103.379H116.525V122.123ZM92.3554 122.123H113.072V103.379H92.3554V122.123ZM68.1859 122.123H88.4093V103.379H68.1859V122.123ZM43.5233 122.123H64.2399V103.379H43.5233V122.123ZM68.1859 99.4333H88.4093V80.6896H68.1859V99.4333ZM92.3554 99.4333H113.072V80.6896H92.3554V99.4333ZM116.525 99.4333H137.241V80.6896H116.525V99.4333ZM116.525 76.7436H137.241V58H116.525V76.7436ZM228 113.738C228 113.738 219.121 105.352 200.871 108.312C198.898 94.0075 183.607 85.6222 183.607 85.6222C183.607 85.6222 169.303 102.886 179.661 122.123C176.702 123.603 171.769 125.576 164.37 125.576H28.7257C26.2594 134.948 26.2594 197.097 94.3284 197.097C143.16 197.097 179.661 174.408 196.925 132.974C222.574 134.948 228 113.738 228 113.738Z\"/></g><g transform=\"translate(520,42) scale(0.1875)\"><rect width=\"256\" height=\"256\" rx=\"60\" fill=\"#242938\"/>\n<path d=\"M128 34L223 198.853H33L128 34Z\" fill=\"white\"/></g><text x=\"649\" y=\"30\" text-anchor=\"middle\" font-family=\"'Segoe UI',system-ui,sans-serif\" font-size=\"11\" font-weight=\"600\" letter-spacing=\"0.08em\" fill=\"#8b949e\" opacity=\"0.9\">CREATIVE & DEVELOPER TOOLS</text><g transform=\"translate(596,42) scale(0.1875)\"><rect width=\"256\" height=\"256\" fill=\"#00005B\" rx=\"60\"/><path fill=\"#99F\" d=\"M54 182.68V72.8133C54 72.0667 54.32 71.64 55.0667 71.64C56.88 71.64 58.5867 71.64 61.04 71.5333C63.6 71.4267 66.2667 71.4267 69.1467 71.32C72.0267 71.2133 75.12 71.2133 78.4267 71.1067C81.7333 71 84.9333 71 88.1333 71C96.88 71 104.133 72.0667 110.107 74.3067C115.44 76.12 120.347 79.1067 124.4 83.0533C127.813 86.4667 130.48 90.6267 132.187 95.2133C133.787 99.6933 134.64 104.28 134.64 109.08C134.64 118.253 132.507 125.827 128.24 131.8C123.973 137.773 118 142.253 111.067 144.813C103.813 147.48 95.8133 148.44 87.0667 148.44C84.5067 148.44 82.8 148.44 81.7333 148.333C80.6667 148.227 79.1733 148.227 77.1467 148.227V182.467C77.2533 183.213 76.72 183.853 75.9733 183.96H75.5467H55.28C54.4267 183.96 54 183.533 54 182.573V182.68ZM77.2533 92.3333V128.173C78.7467 128.28 80.1333 128.387 81.4133 128.387H87.0667C91.2267 128.387 95.3867 127.747 99.3333 126.467C102.747 125.507 105.733 123.48 108.08 120.813C110.32 118.147 111.387 114.52 111.387 109.827C111.493 106.52 110.64 103.213 108.933 100.333C107.12 97.56 104.56 95.4267 101.467 94.2533C97.52 92.6533 93.2533 92.0133 88.88 92.12C86.1067 92.12 83.6533 92.12 81.6267 92.2267C79.4933 92.12 78 92.2267 77.2533 92.3333V92.3333Z\"/><path fill=\"#99F\" d=\"M150 98.6267H168.667C169.734 98.6267 170.587 99.3733 170.907 100.333C171.227 101.187 171.44 102.04 171.547 103C171.76 104.067 171.974 105.24 172.08 106.307C172.187 107.48 172.294 108.76 172.294 110.147C175.494 106.413 179.334 103.32 183.707 100.973C188.614 98.2 194.267 96.8133 199.92 96.8133C200.667 96.7067 201.307 97.24 201.414 97.9867V98.4133V119.213C201.414 120.067 200.88 120.387 199.707 120.387C195.867 120.28 191.92 120.6 188.187 121.453C185.094 122.093 182.107 123.053 179.227 124.333C177.2 125.293 175.28 126.573 173.787 128.28V182.68C173.787 183.747 173.36 184.173 172.4 184.173H151.387C150.534 184.28 149.787 183.747 149.68 182.893V182.467V123.373C149.68 120.813 149.68 118.147 149.574 115.373C149.467 112.6 149.467 109.827 149.36 107.053C149.36 104.6 149.147 102.253 148.934 99.8C148.827 99.2667 149.147 98.7333 149.68 98.6267C149.68 98.52 149.894 98.52 150 98.6267V98.6267Z\"/></g><g transform=\"translate(654,42) scale(0.1875)\"><rect width=\"256\" height=\"256\" fill=\"#00005B\" rx=\"60\"/><path fill=\"#99F\" d=\"M105.157 156.12H65.4769L57.3702 181.293C57.1569 182.253 56.3035 182.893 55.3435 182.787H35.2902C34.1169 182.787 33.7969 182.147 34.1169 180.867L68.4635 82.4133C68.7835 81.3467 69.1035 80.3867 69.5302 79.1067C69.9569 76.8667 70.1702 74.52 70.1702 72.1733C70.0635 71.64 70.4902 71.1067 71.0235 71H71.3435H98.6502C99.3969 71 99.9302 71.32 100.037 71.8533L138.97 180.653C139.29 181.827 138.97 182.36 137.904 182.36H115.61C114.864 182.467 114.117 181.933 113.904 181.187L105.157 155.587V156.12ZM71.6635 134.893H98.7568C98.1168 132.653 97.2635 129.987 96.3035 127.213C95.3435 124.333 94.3835 121.24 93.4235 118.04C92.3569 114.733 91.3968 111.533 90.3302 108.227C89.2635 104.92 88.3035 101.827 87.4502 98.7333C86.5969 95.7467 85.8502 92.9733 85.1035 90.4133H84.8902C83.9302 95 82.7569 99.5867 81.2635 104.173C79.6635 109.293 78.0635 114.627 76.3569 119.96C74.9702 125.4 73.2635 130.413 71.6635 134.893V134.893Z\"/><path fill=\"#99F\" d=\"M201.797 146.52H167.984C168.41 149.827 169.477 153.133 171.29 156.013C173.21 158.893 175.877 161.133 179.077 162.413C183.344 164.227 188.037 165.187 192.73 165.08C196.464 164.973 200.197 164.653 203.824 163.907C207.13 163.48 210.33 162.627 213.317 161.453C213.85 161.027 214.17 161.24 214.17 162.307V178.627C214.17 179.053 214.064 179.48 213.957 179.907C213.744 180.227 213.53 180.44 213.21 180.653C209.797 182.147 206.277 183.213 202.544 183.853C197.53 184.813 192.517 185.24 187.397 185.133C179.29 185.133 172.464 183.853 166.917 181.4C161.69 179.16 157.104 175.64 153.477 171.267C150.064 167.107 147.61 162.413 146.117 157.293C144.624 152.28 143.877 147.053 143.877 141.72C143.877 135.96 144.73 130.307 146.544 124.76C148.25 119.427 150.917 114.52 154.544 110.147C158.064 105.88 162.437 102.467 167.45 100.013C172.464 97.56 178.437 96.7067 185.264 96.7067C190.917 96.6 196.57 97.6667 201.797 100.013C206.17 101.933 210.01 104.813 212.997 108.547C215.77 112.173 218.01 116.227 219.397 120.707C220.784 124.973 221.424 129.347 221.424 133.72C221.424 136.28 221.317 138.52 221.21 140.547C220.997 142.573 220.89 144.067 220.784 145.027C220.677 145.773 220.037 146.413 219.29 146.413C218.65 146.413 217.477 146.52 215.77 146.627C214.064 146.84 212.037 146.947 209.584 146.947C207.13 146.947 204.57 146.52 201.797 146.52V146.52ZM167.984 130.947H190.49C193.264 130.947 195.29 130.947 196.57 130.84C197.424 130.733 198.277 130.52 199.024 129.987V128.92C199.024 127.533 198.81 126.253 198.384 124.973C196.464 119 190.81 114.947 184.517 115.16C178.65 114.84 173.104 117.933 170.33 123.267C169.05 125.72 168.304 128.28 167.984 130.947Z\"/></g></svg>";
function serveStack() {
  return new Response(STACK_SVG, {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
      "access-control-allow-origin": "*",
    },
  });
}



/* ---------------- /shield flat-square badge ---------------- */
function renderShield(label, value, color) {
  const H = 20, PAD = 5, FZ = 11;
  const FONT = "DejaVu Sans,Verdana,Geneva,sans-serif";
  const cw = (s) => s.length * 6.5 + PAD * 2;
  const lw = Math.ceil(cw(label)), vw = Math.ceil(cw(value));
  const W = lw + vw, lx = lw / 2, vx = lw + vw / 2;
  const hex = color.replace(/^#/, "");
  const bg = "#" + (hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex.slice(0, 6));
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '">' +
    '<linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient>' +
    '<rect width="' + lw + '" height="' + H + '" fill="#555"/><rect x="' + lw + '" width="' + vw + '" height="' + H + '" fill="' + bg + '"/>' +
    '<rect width="' + W + '" height="' + H + '" fill="url(#s)"/>' +
    '<g fill="#fff" text-anchor="middle" font-family="' + FONT + '" font-size="' + FZ + '">' +
    '<text x="' + lx + '" y="15" fill="#010101" fill-opacity=".3">' + label + "</text>" +
    '<text x="' + lx + '" y="14">' + label + "</text>" +
    '<text x="' + vx + '" y="15" fill="#010101" fill-opacity=".3">' + value + "</text>" +
    '<text x="' + vx + '" y="14">' + value + "</text>" +
    "</g></svg>"
  );
}

function serveShield(request) {
  const url = new URL(request.url);
  const label = url.searchParams.get("l") || url.searchParams.get("label") || "";
  const value = url.searchParams.get("v") || url.searchParams.get("value") || "";
  const color = url.searchParams.get("c") || url.searchParams.get("color") || "555555";
  return new Response(renderShield(label, value, color), {
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

    if (p === '/stack' || p === '/stack.svg') return serveStack();
    if (p === '/shield' || p === '/shield.svg') return serveShield(request);
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
