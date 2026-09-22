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

const D = 108;
const FONTS = "now-playing.widget/fonts";
// After the Braun SK 4 (Rams and Gugelot, 1956): a cream enamel box with
// elm-veneer sides, a plain grey platter under a clear acrylic lid, a slim
// straight arm, a row of small grey keys, a tuning scale, and a slotted
// grille on the front. The record spins and the arm swings on while a track
// plays; the "on" key really pauses and resumes the player.
export const className = card("light", 340, 238, ...LAYOUT.nowSpinning) + `
  @font-face { font-family: "Inter"; src: url("${FONTS}/Inter-500.woff2") format("woff2"); font-weight: 500; }
  @font-face { font-family: "Inter"; src: url("${FONTS}/Inter-600.woff2") format("woff2"); font-weight: 600; }
  @font-face { font-family: "Inter"; src: url("${FONTS}/Inter-800.woff2") format("woff2"); font-weight: 800; }
  --ui: "Inter", -apple-system, "Helvetica Neue", sans-serif; --cream: #F3F0E8; --cream2: #E9E5DB;
  padding: 0; border-radius: 6px; backdrop-filter: none; overflow: hidden; user-select:none; -webkit-user-select:none;
  background: linear-gradient(180deg, #F6F3EC 0%, var(--cream) 62%, var(--cream2) 100%);
  box-shadow: 0 30px 50px rgba(0,0,0,0.42), inset 0 1px 0 #FFFFFF, 0 0 0 1px #C8C3B7;
  .ws-drag { top: 8px; left: 30px; color:#8a8680; background: rgba(0,0,0,0.05); } .ws-resize { bottom: 8px; right: 30px; color:#8a8680; background: rgba(0,0,0,0.05); }
  .side { position:absolute; top:0; bottom:0; width: 22px; background: linear-gradient(90deg, #D5A76A 0%, #B98346 42%, #CB9C5E 70%, #B27C40 100%); box-shadow: inset 0 0 0 1px rgba(0,0,0,0.15); }
  .side::after { content:""; position:absolute; inset:0; opacity:0.55; background: repeating-linear-gradient(0deg, rgba(60,30,0,0.16) 0 1px, rgba(0,0,0,0) 1px 4px, rgba(60,30,0,0.08) 4px 5px, rgba(0,0,0,0) 5px 9px); }
  .side.l { left:0; border-radius: 6px 0 0 6px; } .side.r { right:0; border-radius: 0 6px 6px 0; }
  .deck { position:absolute; left: 22px; right: 22px; top: 0; height: 156px; border-bottom: 1px solid #D6D2C8; }
  .platter { position:absolute; left: 20px; top: 20px; width: 124px; height: 124px; border-radius: 50%; background: radial-gradient(circle at 50% 50%, #D9D6CE 0 30%, #CFCBC2 31% 100%);
             box-shadow: inset 0 0 0 1px #B9B5AB, 0 2px 4px rgba(0,0,0,0.18); }
  .platter::before { content:""; position:absolute; inset: 6px; border-radius: 50%; background: repeating-radial-gradient(circle at 50% 50%, rgba(0,0,0,0.05) 0 1px, rgba(0,0,0,0) 1px 4px); }
  .vinyl  { position:absolute; left: 8px; top: 8px; width: ${D}px; height: ${D}px; border-radius:50%; background: radial-gradient(circle at 34% 26%, rgba(255,255,255,0.08), transparent 55%), #121214; box-shadow: 0 2px 5px rgba(0,0,0,0.45); }
  .groove { position:absolute; border-radius:50%; border:1px solid rgba(255,255,255,0.05); top:50%; left:50%; transform:translate(-50%,-50%); }
  .label  { position:absolute; top:50%; left:50%; width: 40px; height: 40px; transform:translate(-50%,-50%); border-radius:50%; overflow:hidden; display:flex; align-items:center; justify-content:center; font: 800 7px/1 var(--ui); color:#fff; text-transform:lowercase; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.4); }
  .art    { width:100%; height:100%; object-fit:cover; }
  .spindle { position:absolute; left: 50%; top: 50%; width: 6px; height: 6px; margin: -3px 0 0 -3px; border-radius: 50%; background: radial-gradient(circle at 40% 35%, #f6f6f4, #9a9a94 70%); box-shadow: 0 1px 1px rgba(0,0,0,0.6); z-index: 3; }
  .armbase { position:absolute; left: 176px; top: 16px; width: 18px; height: 18px; border-radius: 50%; background: radial-gradient(circle at 40% 35%, #E4E2DC, #9F9C94 70%); box-shadow: 0 2px 3px rgba(0,0,0,0.3), inset 0 0 0 1px #8A877F; }
  .arm { position:absolute; left: 184px; top: 25px; width: 3px; height: 100px; transform-origin: 50% 0; transform: rotate(var(--arm, 10deg)); transition: transform 1.6s cubic-bezier(.45,0,.2,1);
         background: linear-gradient(90deg, #B9B7B0, #F2F1EC 55%, #A5A39C); border-radius: 2px; box-shadow: 1px 2px 3px rgba(0,0,0,0.35); z-index: 4; }
  .arm::after { content:""; position:absolute; left:-4px; bottom:-10px; width: 11px; height: 16px; border-radius: 2px; background: linear-gradient(180deg, #DAD8D1, #9C9A93); box-shadow: 0 1px 2px rgba(0,0,0,0.4); }
  .rest { position:absolute; left: 164px; top: 116px; width: 10px; height: 14px; border-radius: 2px; background: #C2BFB6; box-shadow: inset 0 0 0 1px #9E9B93; }
  .keys { position:absolute; left: 196px; top: 22px; display:flex; gap: 6px; }
  .key { width: 13px; height: 22px; border-radius: 2px; cursor:pointer; background: linear-gradient(180deg, #D9D6CE, #BDB9AF); box-shadow: 0 2px 0 #8F8C84, 0 3px 3px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.7); transition: transform .06s, box-shadow .06s; }
  .key.down, .key:active { transform: translateY(2px); box-shadow: 0 0 0 #8F8C84, 0 1px 2px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.7); background: linear-gradient(180deg, #C9C5BC, #ADA9A0); }
  .key.red { background: linear-gradient(180deg, #E5563E, #B8331F); box-shadow: 0 2px 0 #7A1E12, 0 3px 3px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.35); }
  .klabels { position:absolute; left: 196px; top: 48px; display:flex; gap: 6px; }
  .klabels span { width: 13px; text-align:center; font: 500 6px/1 var(--ui); color: #7B7872; letter-spacing: 0.2px; }
  .scale { position:absolute; left: 196px; top: 74px; width: 90px; height: 20px; background: #FBFAF6; box-shadow: inset 0 0 0 1px #C8C4BA; overflow:hidden; }
  .scale i { position:absolute; bottom: 0; width: 1px; height: 5px; background: #8B8880; } .scale i.t { height: 9px; }
  .scale b { position:absolute; top: 3px; font: 500 6px/1 var(--ui); color:#7B7872; }
  .scale em { position:absolute; top: 0; bottom: 0; width: 1.5px; background: #D9432B; left: var(--needle, 38%); transition: left 1.2s ease; }
  .lamp { position:absolute; left: 196px; top: 104px; width: 6px; height: 6px; border-radius: 50%; background: #C9C5BC; box-shadow: inset 0 1px 1px rgba(0,0,0,0.25); }
  .lamp.on { background: #E5563E; box-shadow: 0 0 6px rgba(229,86,62,0.8); }
  .lamptxt { position:absolute; left: 206px; top: 103px; font: 500 7px/1 var(--ui); color: #7B7872; letter-spacing: 0.3px; }
  .lid { position:absolute; left: 24px; right: 24px; top: 4px; height: 148px; border-radius: 3px; pointer-events:none;
         background: linear-gradient(112deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.05) 34%, rgba(255,255,255,0.02) 55%, rgba(255,255,255,0.18) 100%);
         box-shadow: inset 0 0 0 1px rgba(255,255,255,0.75), inset 0 -1px 0 rgba(0,0,0,0.08), 0 3px 8px rgba(0,0,0,0.10); }
  .lid::after { content:""; position:absolute; left: 18%; top: -10%; width: 22%; height: 130%; transform: rotate(18deg); background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0) 100%); }
  .front { position:absolute; left: 22px; right: 22px; bottom: 0; height: 82px; }
  .grille { position:absolute; left: 20px; top: 16px; width: 124px; height: 50px; border-radius: 2px; background: repeating-linear-gradient(0deg, #C4C0B6 0 2px, rgba(0,0,0,0) 2px 6px); box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05); }
  .readout { position:absolute; left: 186px; right: 12px; top: 14px; }
  .track { font: 600 11px/1.25 var(--ui); color: #2B2A27; letter-spacing: -0.1px; text-transform: lowercase; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .artist { margin-top: 3px; font: 500 9px/1.2 var(--ui); color: #7B7872; text-transform: lowercase; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .logo { position:absolute; right: 12px; bottom: 12px; font: 800 9px/1 var(--ui); letter-spacing: -0.3px; color: #6B6862; text-transform: lowercase; }
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
const TICKS = Array.from({ length: 21 }, (_, i) => i);
export const render = (props) => {
  if (isLoading(props)) return <Skel tint={T.tintPink} />;
  if ((props.output || "").trim() === "__PERM__" && !(recall("nowspinning") || {}).data) return <PermNotice />;
  let m = parse(props.output);
  if (m && m.art) remember("nowspinning", m);
  else if (!m) { const cached = recall("nowspinning"); m = cached && cached.data ? { ...cached.data, playing: false } : MOCK; }
  const stamp = (m.album || m.track || "").split(" ")[0];
  ensureSpin();
  return (
    <div aria-label={`Now playing: ${m.track} by ${m.artist}`} style={{ "--arm": m.playing ? "55deg" : "10deg", "--needle": m.playing ? "62%" : "38%" }}>
      <div className="side l" /><div className="side r" />
      <div className="deck">
        <div className="platter">
          <div id="ws-vinyl" className="vinyl" data-playing={m.playing ? "1" : "0"}>
            <div className="groove" style={{ width: D * 0.88, height: D * 0.88 }} /><div className="groove" style={{ width: D * 0.72, height: D * 0.72 }} /><div className="groove" style={{ width: D * 0.56, height: D * 0.56 }} />
            <div className="label" style={{ background: m.art ? "#000" : "#D9432B" }}>{m.art ? <img className="art" src={artSrc(m)} /> : stamp}</div>
          </div>
          <div className="spindle" />
        </div>
        <div className="rest" /><div className="armbase" /><div className="arm" />
        <div className="keys">
          <span className="key" title="Stop" onClick={() => m.playing && run(PLAYPAUSE)} />
          <span className={`key ${m.playing ? "down" : ""}`} title={m.playing ? "Pause" : "Play"} onClick={() => run(PLAYPAUSE)} />
          <span className="key down" title="33 rpm" /><span className="key" title="45 rpm" /><span className="key red" title="Off" />
        </div>
        <div className="klabels"><span>stop</span><span>on</span><span>33</span><span>45</span><span>aus</span></div>
        <div className="scale">{TICKS.map((i) => <i key={i} className={i % 5 === 0 ? "t" : ""} style={{ left: `${3 + i * 4.2}px` }} />)}{[0, 1, 2, 3, 4].map((i) => <b key={i} style={{ left: `${2 + i * 19.5}px` }}>{i * 25}</b>)}<em /></div>
        <div className={`lamp ${m.playing ? "on" : ""}`} /><span className="lamptxt">{m.playing ? "playing" : "standby"}</span>
      </div>
      <div className="lid" />
      <div className="front">
        <div className="grille" />
        <div className="readout"><div className="track">{m.track}</div><div className="artist">{m.artist}{m.album ? ` · ${m.album}` : ""}</div></div>
        <div className="logo">now playing</div>
      </div>
      <DragHandle k="nowSpinning" />
      <ResizeHandle k="nowSpinning" />
    </div>
  );
};
