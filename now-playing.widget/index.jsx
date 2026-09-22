import { React } from "uebersicht";
// --- Inlined design system (self-contained; formerly theme.js) ---
// Shared design system for the widget set: color tokens, fonts, layout, the
// common card shell, drag/resize handles, a last-known-good cache, and the
// standard data-resolution helper. Imported by every widget so they stay
// visually and behaviorally consistent.
const T = {
  // Accent tints
  tintBlue: "#296BE0",
  tintPink: "#E86E87",
  tintGreen: "#59A875",
  tintOrange: "#D9946B",
  tintPurple: "#A861DE",

  // Cards
  cardLight: "rgba(255,255,255,0.74)",
  cardDark: "rgba(33,36,43,0.88)",

  // Ink (text on light)
  ink: "#1F2129",
  inkDim: "#616670",
  inkMute: "#8C919C",

  // Text on dark
  onDark: "#F7F7FA",
  onDarkDim: "#BDBFC7",
  onDarkMute: "#8F949E",

  // Walls (desktop stand-in backgrounds)
  wall1: "#F0F2F7",
  wall2: "#DBE3ED",
  wall3: "#BFC7DB",

  // GitHub ramp
  ghEmpty: "rgba(255,255,255,0.10)",
  ghGreen1: "#9CE8A8",
  ghGreen2: "#40C463",
  ghGreen3: "#30A14F",
  ghGreen4: "#216E38",

  // Scene colors
  nightSky: "#14141A",
  cosmicBase: "#0A051A",
  cosmicViolet: "#8C338C",
  cosmicMagenta: "#D9598C",
  cosmicIndigo: "#331A66",
  shaderPurple: "#402673",
  shaderTeal: "#268C8C",
  duskBase: "#4D408C",
  duskAmber: "#D9A666",
  duskPurple: "#8C4DA6",
  duskGlow: "#F28073",
  cardCream: "#F2F0E6",
  paperGrain: "#9E8052",

  archivePalette: [
    "#D98C4D", "#A64D33", "#733326", "#E0B359",
    "#8C6640", "#B88CCC", "#594D80", "#8C73BF",
    "#8CBF8C", "#4D8059", "#598CD9", "#334D8C",
  ],

  // Layout
  radius: "24px",
  captionTracking: "1.5px",
};

// Fonts. Install Instrument Serif, Geist, and Geist Mono for the intended look;
// each stack falls back to a system font if the family is missing.
const serif = "'Instrument Serif', Georgia, serif";
const sans = "'Geist', -apple-system, BlinkMacSystemFont, sans-serif";
const mono = "'Geist Mono', 'SF Mono', ui-monospace, monospace";

// Default desktop placement [x, y] per widget. Each widget calls
// card(variant, w, h, ...LAYOUT.<key>) so widgets lay out at distinct positions
// rather than stacking at the origin. These are overridden by any saved
// position from the drag handle.
const LAYOUT = {
  nowSpinning:  [380, 40],
  musicArchive: [40, 40],
  spatial:      [380, 200],
  mosaic:       [1120, 40],
  stack:        [1120, 486],
  drop:         [1120, 708],
  swap:         [380, 672],
  aiDailyPull:  [40, 368],
  apod:         [40, 576],
  atlas:        [1280, 224],
  tarot:        [1120, 224],
};

// Shared card shell. variant is "dark" or "light"; x/y set the on-desktop
// position. The common loading/empty/stale state styles are appended so every
// widget can render those states without repeating CSS.
const card = (variant, w, h, x = 0, y = 0) => `
  position: absolute;
  left: ${x}px; top: ${y}px;
  width: ${w}px;
  height: ${h}px;
  border-radius: ${T.radius};
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0,0,0,0.35);
  background: ${variant === "dark" ? T.cardDark : T.cardLight};
  backdrop-filter: blur(20px);
  color: ${variant === "dark" ? T.onDark : T.ink};
  font-family: ${sans};
  box-sizing: border-box;
  transform-origin: top left;

  /* Promote each card to its own GPU layer so a sibling widget's frequent
     refresh cannot trigger a backdrop-filter recomposite, which otherwise made
     the blur flicker on and off. */
  will-change: transform;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;

  .ws-stale { position:absolute; top:8px; right:10px; z-index:5;
              font-family:${mono}; font-size:8px; letter-spacing:1px;
              text-transform:uppercase; opacity:0.72;
              color:${variant === "dark" ? T.onDarkMute : T.inkMute}; }
  .ws-empty { position:absolute; inset:0; display:flex; align-items:center;
              justify-content:center; padding:24px; text-align:center;
              font-family:${serif}; font-style:italic; font-size:18px;
              opacity:0.6; color:${variant === "dark" ? T.onDarkDim : T.inkDim}; }
  .ws-skel  { position:absolute; inset:14px; border-radius:14px; opacity:0.18;
              animation: ws-pulse 1.6s ease-in-out infinite; }
  @keyframes ws-pulse { 0%,100% { opacity:0.10; } 50% { opacity:0.24; } }
  @media (prefers-reduced-motion: reduce) {
    .ws-skel { animation:none; opacity:0.16; }
  }

  .ws-drag  { position:absolute; top:6px; left:6px; z-index:30;
              width:18px; height:18px; border-radius:6px;
              display:flex; align-items:center; justify-content:center;
              font-size:11px; line-height:1; cursor:grab; opacity:0.42;
              transition:opacity .15s ease; user-select:none;
              -webkit-user-select:none;
              color:${variant === "dark" ? T.onDarkMute : T.inkMute};
              background:${variant === "dark"
                ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}; }
  .ws-drag:hover  { opacity:0.95; }
  .ws-drag:active { cursor:grabbing; }

  .ws-resize { position:absolute; bottom:5px; right:5px; z-index:30;
               width:16px; height:16px; border-radius:5px;
               display:flex; align-items:center; justify-content:center;
               font-size:11px; line-height:1; cursor:nwse-resize; opacity:0.42;
               transition:opacity .15s ease; user-select:none;
               -webkit-user-select:none;
               color:${variant === "dark" ? T.onDarkMute : T.inkMute};
               background:${variant === "dark"
                 ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}; }
  .ws-resize:hover { opacity:0.95; }
`;

// Small uppercase monospace caption used for metadata labels.
const caption = (color) => `
  font-family: ${mono};
  text-transform: uppercase;
  letter-spacing: ${T.captionTracking};
  color: ${color};
`;

// State helpers, returned as React elements (this is plain JS, not JSX).
const h = React.createElement;

// Loading: an accent-tinted skeleton block.
const Skel = ({ tint = T.tintBlue }) =>
  h("div", { className: "ws-skel", style: { background: tint } });

// Empty: a single quiet line of text.
const Empty = ({ text }) => h("div", { className: "ws-empty" }, text);

// Stale: a small marker showing the time of the last successful refresh.
const Stale = ({ ts }) =>
  h("div", { className: "ws-stale" }, `stale · ${clockStamp(ts)}`);

// Drag and resize support.
//
// Übersicht renders each widget into its own absolutely-positioned `.widget`
// node, all inside a shared `#uebersicht` container. The wrapper to move is the
// nearest `.widget` ancestor of a handle — not the topmost absolute element,
// which is the shared container.
//
// DragHandle updates the wrapper's left/top. ResizeHandle scales it uniformly
// via a top-left-anchored CSS transform, keeping these fixed-layout cards crisp
// instead of clipping. Both persist to localStorage, so position and size
// survive refreshes and reboots.
const posKey = (k) => `ws:pos:${k}`;
const scaleKey = (k) => `ws:scale:${k}`;
const MIN_SCALE = 0.4, MAX_SCALE = 3;

const findWrapper = (node) => node && node.closest(".widget");

// Apply any saved position and scale. Runs on every mount, since the wrapper
// may have been recreated on refresh.
const applySaved = (wrapper, key) => {
  try {
    const pos = JSON.parse(localStorage.getItem(posKey(key)) || "null");
    if (pos && typeof pos.x === "number") {
      wrapper.style.left = pos.x + "px";
      wrapper.style.top = pos.y + "px";
    }
  } catch (e) { /* storage unavailable */ }
  try {
    const scale = parseFloat(localStorage.getItem(scaleKey(key)));
    if (scale > 0) wrapper.style.transform = `scale(${scale})`;
  } catch (e) { /* storage unavailable */ }
};

const initDrag = (node, key) => {
  if (!node) return;
  const wrapper = findWrapper(node);
  if (!wrapper) return;
  applySaved(wrapper, key);

  if (node.__wsDragWired) return; // attach listeners once per node
  node.__wsDragWired = true;

  // Keep grip clicks from reaching the card's own onClick handler.
  node.addEventListener("click", (e) => e.stopPropagation());

  node.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX, startY = e.clientY;
    const cs = getComputedStyle(wrapper);
    const origX = parseFloat(wrapper.style.left || cs.left) || 0;
    const origY = parseFloat(wrapper.style.top || cs.top) || 0;
    const onMove = (ev) => {
      wrapper.style.left = origX + (ev.clientX - startX) + "px";
      wrapper.style.top = origY + (ev.clientY - startY) + "px";
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      try {
        localStorage.setItem(posKey(key), JSON.stringify({
          x: parseFloat(wrapper.style.left) || 0,
          y: parseFloat(wrapper.style.top) || 0,
        }));
      } catch (e) { /* storage unavailable */ }
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  });

  // Double-click the grip to snap back to the card's default LAYOUT slot.
  node.addEventListener("dblclick", (e) => {
    e.preventDefault();
    e.stopPropagation();
    try { localStorage.removeItem(posKey(key)); } catch (e) { /* ignore */ }
    wrapper.style.left = "";
    wrapper.style.top = "";
  });
};

const initResize = (node, key) => {
  if (!node) return;
  const wrapper = findWrapper(node);
  if (!wrapper) return;
  applySaved(wrapper, key);

  if (node.__wsResizeWired) return;
  node.__wsResizeWired = true;

  node.addEventListener("click", (e) => e.stopPropagation());

  node.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX, startY = e.clientY;
    const cs = getComputedStyle(wrapper);
    // Layout width/height are unaffected by transform, so they stay constant.
    const baseW = parseFloat(cs.width) || 1;
    const baseH = parseFloat(cs.height) || 1;
    const m = /scale\(([^)]+)\)/.exec(wrapper.style.transform || "");
    const origScale = m ? parseFloat(m[1]) || 1 : 1;
    const onMove = (ev) => {
      const delta = (ev.clientX - startX + (ev.clientY - startY)) / (baseW + baseH);
      const next = Math.max(MIN_SCALE, Math.min(MAX_SCALE, origScale + delta));
      wrapper.style.transform = `scale(${next})`;
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      const m2 = /scale\(([^)]+)\)/.exec(wrapper.style.transform || "");
      try { localStorage.setItem(scaleKey(key), String(m2 ? m2[1] : 1)); }
      catch (e) { /* storage unavailable */ }
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  });

  // Double-click the corner to restore the card's default size.
  node.addEventListener("dblclick", (e) => {
    e.preventDefault();
    e.stopPropagation();
    try { localStorage.removeItem(scaleKey(key)); } catch (e) { /* ignore */ }
    wrapper.style.transform = "";
  });
};

// Each handle takes the widget's LAYOUT key so position and scale are stored
// per widget. DragHandle renders top-left, ResizeHandle bottom-right.
const DragHandle = ({ k }) =>
  h("div", { className: "ws-drag", title: "Drag to move · double-click to reset",
             ref: (n) => initDrag(n, k) }, "☰");

const ResizeHandle = ({ k }) =>
  h("div", { className: "ws-resize", title: "Drag to resize · double-click to reset",
             ref: (n) => initResize(n, k) }, "⤡");

// Last-known-good cache, persisted in localStorage with a timestamp.
const remember = (key, data) => {
  try { localStorage.setItem(`ws:${key}`, JSON.stringify({ data, ts: Date.now() })); }
  catch (e) { /* storage unavailable; skip */ }
};

const recall = (key) => {
  try { return JSON.parse(localStorage.getItem(`ws:${key}`)); }
  catch (e) { return null; }
};

const clockStamp = (ms) =>
  new Date(ms).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

// True before the command has produced any output (the initial load tick).
const isLoading = ({ output, error }) =>
  output === undefined && !error;

// Standard data flow for command-backed widgets. parse(output) must return a
// falsy value when there is nothing usable.
//   loading -> { loading: true }            render <Skel/>
//   success -> { data }                     cached as last-known-good
//   failure -> { data, staleTs }            last-known-good + time, render <Stale/>
//   cold    -> { data, mock: true }         mock data, nothing cached yet
const resolve = (key, props, parse, mock) => {
  if (isLoading(props)) return { loading: true };
  let data = null;
  try { data = parse(props.output); } catch (e) { data = null; }
  if (data) { remember(key, data); return { data }; }
  const cached = recall(key);
  if (cached && cached.data) return { data: cached.data, staleTs: cached.ts };
  return { data: mock, mock: true };
};
// --- End inlined design system ---

// The current track as a tilted, continuously spinning vinyl record.
//
// Auto-detects the active player and resolves cover art, in priority order:
//   1. A local companion's MediaRemote snapshot (now-playing-state.json), used
//      only while it reports active playback — carries the system's real art.
//   2. Spotify (if running) — AppleScript exposes the cover URL directly.
//   3. The macOS Music app (if running) for the local track/state.
//   4. For the Music app while the Mac is idle, the MusicKit helper's account-
//      wide now-playing (e.g. playback on iPhone), with correct Apple Music art.
//   5. Music-app cover fallback via the MusicKit catalog, then the iTunes Search
//      API (album first, then song; cached per album).
// Whichever of Spotify/Music is actively playing wins; a paused player is shown
// when nothing is playing. Output fields use the ASCII Unit Separator (0x1F):
// track, artist, album, state, art.
export const command =
  `US=$(printf '\\037'); ` +
  // Optional MediaRemote snapshot written by your own companion (not included).
  `S="$HOME/.config/widgetsuite/now-playing-state.json"; ` +
  `if [ -s "$S" ] && grep -q '"playing"[[:space:]]*:[[:space:]]*true' "$S"; then cat "$S"; exit 0; fi; ` +
  // Pick the active player and return: track, artist, album, state, artURL.
  // Spotify fills artURL directly; the Music app leaves it empty (resolved below).
  `INFO=$(osascript -e '` +
  `set d to (ASCII character 31)\n` +
  `set sp to "stopped"\n` +
  `set mu to "stopped"\n` +
  `if application "Spotify" is running then\n` +
  `  tell application "Spotify" to set sp to (player state as text)\n` +
  `end if\n` +
  `if application "Music" is running then\n` +
  `  tell application "Music" to set mu to (player state as text)\n` +
  `end if\n` +
  `set src to ""\n` +
  `if sp is "playing" then\n` +
  `  set src to "s"\n` +
  `else if mu is "playing" then\n` +
  `  set src to "m"\n` +
  `else if mu is not "stopped" then\n` +
  `  set src to "m"\n` +
  `else if sp is not "stopped" then\n` +
  `  set src to "s"\n` +
  `end if\n` +
  `if src is "s" then\n` +
  `  tell application "Spotify"\n` +
  `    set t to current track\n` +
  `    return (name of t) & d & (artist of t) & d & (album of t) & d & sp & d & (artwork url of t)\n` +
  `  end tell\n` +
  `else if src is "m" then\n` +
  `  tell application "Music"\n` +
  `    return (get name of current track) & d & (get artist of current track) & d & (get album of current track) & d & mu & d & ""\n` +
  `  end tell\n` +
  `end if\n` +
  `return "idle"' 2>"$HOME/Library/Caches/ws-np.err"); ` +
  // If AppleScript was blocked by macOS Automation permission, surface it so the
  // widget can prompt the user to grant it instead of silently showing nothing.
  `if [ -z "$INFO" ] && grep -qiE 'not authoriz|-1743|-10004|execution error' "$HOME/Library/Caches/ws-np.err" 2>/dev/null; then printf '__PERM__'; exit 0; fi; ` +
  // Nothing playing on the Mac: fall back to the account's most recently played
  // track (with real Apple Music artwork), the same source the album mosaic
  // uses, so the widget shows your last listen instead of a placeholder.
  `case "$INFO" in idle|"") ` +
    `RC=$(/usr/bin/python3 "$HOME/.config/widgetsuite/musickit-fetch.py" --recent 2>/dev/null); ` +
    `if [ -n "$RC" ]; then printf '%s' "$RC"; else printf '%s' "$INFO"; fi; exit 0;; ` +
  `esac; ` +
  `TRACK=$(printf '%s' "$INFO" | cut -d"$US" -f1); ` +
  `ARTIST=$(printf '%s' "$INFO" | cut -d"$US" -f2); ` +
  `ALBUM=$(printf '%s' "$INFO" | cut -d"$US" -f3); ` +
  `STATE=$(printf '%s' "$INFO" | cut -d"$US" -f4); ` +
  `ARTURL=$(printf '%s' "$INFO" | cut -d"$US" -f5); ` +
  `if [ -n "$ARTURL" ]; then ` +
    // Spotify provides the cover URL straight from AppleScript.
    `ART="$ARTURL"; ` +
  `else ` +
    // Music app, Mac idle -> account-wide now-playing via MusicKit (correct art).
    `if [ "$STATE" != "playing" ]; then ` +
      `MK=$(/usr/bin/python3 "$HOME/.config/widgetsuite/musickit-fetch.py" --nowplaying "$TRACK" "$ARTIST" 2>/dev/null); ` +
      `if [ -n "$MK" ]; then printf '%s' "$MK"; exit 0; fi; ` +
    `fi; ` +
    `C="$HOME/Library/Caches/ws-nowplaying-art.txt"; PREV=$(cat "$C" 2>/dev/null); ` +
    `if [ "$(printf '%s' "$PREV" | cut -d"$US" -f1)" = "$ARTIST$ALBUM$TRACK" ] && [ -n "$ARTIST" ] && [ -n "$(printf '%s' "$PREV" | cut -d"$US" -f2)" ]; then ` +
      `ART=$(printf '%s' "$PREV" | cut -d"$US" -f2); ` +
    `else ` +
      // Correct sleeve from Apple Music (MusicKit catalog) first, then iTunes.
      `ART=$(/usr/bin/python3 "$HOME/.config/widgetsuite/musickit-fetch.py" --cover "$TRACK" "$ARTIST" "$ALBUM" 2>/dev/null); ` +
      `art_of(){ curl -s -G "https://itunes.apple.com/search" --data-urlencode "term=$1" -d "entity=$2&limit=1" ` +
      `| grep -o '"artworkUrl100":"[^"]*"' | head -1 | sed -e 's/^"artworkUrl100":"//' -e 's/"$//' | tr -d '\\\\' | sed 's/100x100bb/600x600bb/'; }; ` +
      `A1=$(printf '%s' "$ARTIST" | sed -E 's/ (&|x|feat\\.?|ft\\.?|,) .*//'); ` +
      `A2=$(printf '%s' "$ARTIST" | sed -E 's/.* (&|x|feat\\.?|ft\\.?|,) //'); ` +
      `ALBUMC=$(printf '%s' "$ALBUM" | sed -E 's/ - (Single|EP)$//'); ` +
      `[ -z "$ART" ] && ART=$(art_of "$ARTIST $ALBUMC" album); ` +
      `[ -z "$ART" ] && [ "$A1" != "$ARTIST" ] && ART=$(art_of "$A1 $ALBUMC" album); ` +
      `[ -z "$ART" ] && ART=$(art_of "$ARTIST $TRACK" song); ` +
      `[ -z "$ART" ] && [ "$A2" != "$ARTIST" ] && ART=$(art_of "$A2 $TRACK" song); ` +
      `[ -z "$ART" ] && [ "$A1" != "$ARTIST" ] && ART=$(art_of "$A1 $TRACK" song); ` +
      `[ -z "$ART" ] && ART=$(art_of "$TRACK" song); ` +
      `[ -n "$ART" ] && printf '%s%s%s' "$ARTIST$ALBUM$TRACK" "$US" "$ART" > "$C"; ` +
    `fi; ` +
  `fi; ` +
  `printf '%s%s%s%s%s%s%s%s%s' "$TRACK" "$US" "$ARTIST" "$US" "$ALBUM" "$US" "$STATE" "$US" "$ART"`;

export const refreshFrequency = 1000 * 2; // pick up track / play-pause changes

const D = 128;
const FONTS = "now-playing.widget/fonts";
// A direct-drive deck: matte plinth with a bevelled edge, a platter with a
// strobe ring, the record as the platter mat with the sleeve as its label, a
// tonearm that swings onto the groove when something is playing, a start/stop
// button that actually pauses and resumes, and a slim readout strip.
export const className = card("dark", 300, 236, ...LAYOUT.nowSpinning) + `
  @font-face { font-family: "Michroma"; src: url("${FONTS}/Michroma-400.woff2") format("woff2"); }
  @font-face { font-family: "Barlow Condensed"; src: url("${FONTS}/BarlowCondensed-600.woff2") format("woff2"); font-weight: 600; }
  --cond: "Barlow Condensed", "Arial Narrow", sans-serif;
  padding: 0; border-radius: 14px; backdrop-filter: none; overflow: hidden; user-select:none; -webkit-user-select:none;
  background: linear-gradient(180deg, #2B2C30 0%, #1B1C1F 7%, #141518 90%, #0E0F11 100%);
  box-shadow: 0 30px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.10), inset 0 0 0 2px #26272B, 0 0 0 1px #050506;
  .ws-drag { top: 8px; left: 8px; } .ws-resize { bottom: 6px; right: 6px; }
  .platter { position:absolute; left: 18px; top: 24px; width: 160px; height: 160px; border-radius:50%;
             background: radial-gradient(circle, #3A3B40 0 55%, #2A2B2F 56% 100%);
             box-shadow: 0 0 0 4px #0B0B0C, 0 10px 22px rgba(0,0,0,0.65), inset 0 0 0 1px rgba(255,255,255,0.06); }
  .strobe { position:absolute; inset: 0; border-radius:50%; opacity: 0.55; pointer-events:none;
            background: repeating-conic-gradient(rgba(255,255,255,0.55) 0 1.3deg, transparent 1.3deg 4.8deg);
            -webkit-mask: radial-gradient(circle, transparent 73px, #000 74px, #000 78px, transparent 79px); mask: radial-gradient(circle, transparent 73px, #000 74px, #000 78px, transparent 79px); }
  .platter.on .strobe { opacity: 0.9; }
  .vinyl  { position:absolute; left: 10px; top: 10px; width: ${D}px; height: ${D}px; border-radius:50%;
            background: radial-gradient(circle at 32% 24%, rgba(255,255,255,0.07), transparent 58%),
                        radial-gradient(circle at 68% 80%, rgba(0,0,0,0.6), transparent 55%), #0B0B0E;
            box-shadow: 0 2px 6px rgba(0,0,0,0.7); }
  .groove { position:absolute; border-radius:50%; border:1px solid rgba(255,255,255,0.06); top:50%; left:50%; transform:translate(-50%,-50%); }
  .label  { position:absolute; top:50%; left:50%; width:${Math.round(D * 0.42)}px; height:${Math.round(D * 0.42)}px; transform:translate(-50%,-50%); border-radius:50%; overflow:hidden;
            display:flex; align-items:center; justify-content:center; font: 700 8px/1 var(--cond); letter-spacing:1px; text-transform:uppercase; color:#fff;
            box-shadow: inset 0 0 0 1.5px rgba(0,0,0,0.45), inset 3px 3px 6px rgba(255,255,255,0.3); }
  .art    { width:100%; height:100%; object-fit:cover; }
  .spindle { position:absolute; top:50%; left:50%; width: 7px; height: 7px; margin: -3.5px 0 0 -3.5px; border-radius:50%; background: radial-gradient(circle at 40% 35%, #f2f2f2, #8a8c92 70%); box-shadow: 0 1px 2px rgba(0,0,0,0.8); z-index: 3; }
  .sheen  { position:absolute; inset:0; border-radius:50%; pointer-events:none; background: radial-gradient(120px at 30% 20%, rgba(255,255,255,0.18), transparent 55%); }
  .armbase { position:absolute; right: 24px; top: 22px; width: 36px; height: 36px; border-radius:50%; background: radial-gradient(circle at 40% 35%, #8E9096, #3C3E44 70%); box-shadow: 0 4px 8px rgba(0,0,0,0.6), inset 0 0 0 1px #111; }
  .weight { position:absolute; right: 22px; top: 8px; width: 28px; height: 12px; border-radius: 6px; background: linear-gradient(180deg,#5C5E64,#2A2B2F); box-shadow: 0 2px 4px rgba(0,0,0,0.6); transform-origin: 100% 50%; }
  .arm    { position:absolute; right: 40px; top: 40px; width: 4px; height: 122px; transform-origin: 50% 0; transform: rotate(var(--arm, -24deg)); transition: transform 1.6s cubic-bezier(.45,0,.2,1);
            background: linear-gradient(90deg,#B7B9BF,#E9EAEE 50%,#8F9298); border-radius: 2px; box-shadow: 2px 3px 6px rgba(0,0,0,0.6); z-index: 4; }
  .arm::after { content:""; position:absolute; left:-6px; bottom:-16px; width:16px; height:22px; border-radius: 3px; transform: rotate(-24deg); background: linear-gradient(180deg,#2C2D31,#0F0F11); box-shadow: 0 2px 4px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12); }
  .pitch  { position:absolute; right: 30px; top: 78px; width: 8px; height: 84px; border-radius:4px; background: #0A0A0B; box-shadow: inset 0 0 0 1px #2A2B2F; }
  .pitch i { position:absolute; left:-8px; top: 36px; width: 24px; height: 12px; border-radius:2px; background: linear-gradient(180deg,#4A4C52,#1F2024); box-shadow: 0 2px 4px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12); }
  .pitch b { position:absolute; left: 12px; top: 40px; width: 4px; height: 4px; border-radius:50%; background:#f5561e; box-shadow: 0 0 4px #f5561e; }
  .lbl    { position:absolute; font: 600 7px/1 var(--cond); letter-spacing: 1.6px; color: #7E8187; text-transform:uppercase; }
  .brand  { position:absolute; left: 20px; bottom: 44px; font: 400 8px/1 "Michroma", sans-serif; letter-spacing: 2px; color: #8C8E95; }
  .start  { position:absolute; left: 194px; top: 156px; width: 40px; height: 40px; border-radius:50%; cursor:pointer;
            background: radial-gradient(circle at 40% 35%, #3A3B40, #1C1D20 70%); box-shadow: 0 3px 0 #08080A, 0 5px 8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12); transition: transform .05s, box-shadow .05s; }
  .start:active { transform: translateY(3px); box-shadow: 0 0 0 #08080A, 0 1px 3px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12); }
  .start i { position:absolute; left: 50%; top: 50%; width: 10px; height: 3px; margin: -1.5px 0 0 -5px; border-radius: 2px; background: #2c2d31; }
  .start.on i { background: #39D353; box-shadow: 0 0 6px #39D353; }
  .r33, .r45 { position:absolute; width: 22px; height: 12px; border-radius: 2px; background: linear-gradient(180deg,#3A3B40,#202124); box-shadow: 0 2px 0 #08080a; font: 600 6px/12px var(--cond); color:#9a9ca3; text-align:center; letter-spacing: 0.5px; }
  .r33 { left: 194px; top: 130px; } .r45 { left: 220px; top: 130px; }
  .r33 b { position:absolute; left: 3px; top: -4px; width: 3px; height: 3px; border-radius:50%; background:#39D353; box-shadow: 0 0 3px #39D353; }
  .info   { position:absolute; left: 20px; right: 20px; bottom: 12px; height: 26px; border-radius: 5px; background: #0A0A0B; box-shadow: inset 0 0 0 1px #26272B; padding: 0 10px; display:flex; align-items:center; gap: 10px; }
  .info .t { flex:1; min-width:0; font: 600 11px/1 var(--cond); letter-spacing: 0.6px; color: #F1EDE3; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .info .a { flex:none; max-width: 42%; font: 600 8px/1 var(--cond); letter-spacing: 1.2px; color: #8C8E95; text-transform:uppercase; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .info .st { flex:none; width: 5px; height: 5px; border-radius:50%; background:#3a3b40; }
  .info .st.on { background:#39D353; box-shadow: 0 0 5px #39D353; }
`;
const MOCK = {
  track: "Cassette Light", artist: "Field of Margins", album: "Halcyon · 2025",
  playing: true, art: null,
};

const US = String.fromCharCode(31);

const parse = (output) => {
  const raw = (output || "").trim();
  if (!raw || raw === "idle") return null;
  try {
    const j = JSON.parse(raw);
    if (j && j.track) return {
      track: j.track, artist: j.artist, album: j.album,
      playing: !!j.playing, art: j.art || null,
    };
  } catch (e) {}
  const p = raw.split(US);
  if (p.length >= 4) return {
    track: p[0], artist: p[1], album: p[2], playing: p[3] === "playing", art: p[4] || null,
  };
  return null;
};

// Cache-bust the cover URL so the <img> reloads when the track changes.
const artSrc = (m) =>
  m.art + (m.art.includes("?") ? "&" : "?") + "v=" + encodeURIComponent(m.track || "");

// Rotation is driven by setInterval, not requestAnimationFrame or CSS
// keyframes, because the latter two do not tick reliably in Übersicht's
// always-backgrounded desktop WebView. The interval re-finds the disc by id
// each tick, so it survives the widget's periodic re-renders.
//
// The timer handle and angle are stored on `window` rather than in module
// scope: Übersicht re-evaluates this module on every reload without clearing
// the previous interval, so a module-scoped guard cannot stop the old timer.
// Keying off `window` lets each reload cancel the prior timer and resume from
// the same angle, avoiding stacked timers fighting over the transform.
const REDUCED = typeof window !== "undefined" && window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const ensureSpin = () => {
  if (typeof window === "undefined") return;
  if (window.__wsSpinTimer) clearInterval(window.__wsSpinTimer);
  if (window.__wsSpinAngle == null) window.__wsSpinAngle = 0;
  window.__wsSpinTimer = setInterval(() => {
    const el = document.getElementById("ws-vinyl");
    if (!el) return;
    // Spin only while the platter is running (data-playing), like a real deck.
    if (!REDUCED && el.dataset.playing === "1") window.__wsSpinAngle = (window.__wsSpinAngle + 1.5) % 360;
    el.style.transform = "rotate(" + window.__wsSpinAngle + "deg)";
  }, 16);
};

// Shown when macOS has not granted Übersicht permission to read the active
// player (System Settings > Privacy & Security > Automation), and there is no
// cached track to fall back to. Clicking opens the right settings pane.
const PermNotice = () =>
  h("div", {
    onClick: () => run("open 'x-apple.systempreferences:com.apple.preference.security?Privacy_Automation'"),
    style: {
      width: D, height: D, borderRadius: "16px", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      textAlign: "center", padding: "16px", boxSizing: "border-box",
      background: "rgba(20,20,28,0.55)", backdropFilter: "blur(8px)",
      color: T.onDarkDim, fontFamily: mono, fontSize: "9px", lineHeight: 1.5,
      letterSpacing: "0.5px",
    },
  }, "Allow Übersicht to control Music in System Settings → Automation");

// Start/stop pauses and resumes whichever player is running; the refresh
// picks up the new state within two seconds and swings the arm.
const PLAYPAUSE = `osascript -e 'if application "Spotify" is running then' -e 'tell application "Spotify" to playpause' -e 'else if application "Music" is running then' -e 'tell application "Music" to playpause' -e 'end if' >/dev/null 2>&1`;
export const render = (props) => {
  if (isLoading(props)) return <Skel tint={T.tintPink} />;
  if ((props.output || "").trim() === "__PERM__" && !(recall("nowspinning") || {}).data) return <PermNotice />;
  let m = parse(props.output);
  if (m && m.art) remember("nowspinning", m);
  else if (!m) { const cached = recall("nowspinning"); m = cached && cached.data ? { ...cached.data, playing: false } : MOCK; }
  const stamp = (m.album || m.track || "").split(" ")[0];
  ensureSpin();
  return (
    <div aria-label={`Now playing: ${m.track} by ${m.artist}`} style={{ "--arm": m.playing ? "13deg" : "-24deg" }}>
      <DragHandle k="nowSpinning" />
      <ResizeHandle k="nowSpinning" />
      <div className={`platter ${m.playing ? "on" : ""}`}>
        <div className="strobe" />
        <div id="ws-vinyl" className="vinyl" data-playing={m.playing ? "1" : "0"}>
          <div className="groove" style={{ width: D * 0.9, height: D * 0.9 }} />
          <div className="groove" style={{ width: D * 0.76, height: D * 0.76 }} />
          <div className="groove" style={{ width: D * 0.62, height: D * 0.62 }} />
          <div className="label" style={{ background: m.art ? "#000" : T.tintOrange }}>{m.art ? <img className="art" src={artSrc(m)} /> : stamp}</div>
          <div className="sheen" />
        </div>
        <div className="spindle" />
      </div>
      <div className="weight" /><div className="armbase" /><div className="arm" />
      <span className="lbl" style={{ right: 22, top: 62 }}>Pitch</span>
      <div className="pitch"><b /><i /></div>
      <span className="lbl" style={{ left: 194, top: 118 }}>Speed</span>
      <div className="r33"><b />33</div><div className="r45">45</div>
      <div className={`start ${m.playing ? "on" : ""}`} title={m.playing ? "Pause" : "Play"} onClick={() => run(PLAYPAUSE)}><i /></div>
      <span className="lbl" style={{ left: 240, top: 172 }}>Start<br />Stop</span>
      <div className="brand">DIRECT DRIVE · NOW PLAYING</div>
      <div className="info"><span className={`st ${m.playing ? "on" : ""}`} /><span className="t">{m.track}</span><span className="a">{m.artist}</span></div>
    </div>
  );
};
