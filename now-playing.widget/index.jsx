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
              font-size:11px; line-height:1; cursor:grab; opacity:0.22;
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
               font-size:11px; line-height:1; cursor:nwse-resize; opacity:0.22;
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
// Source resolution, in priority order:
//   1. A local companion's MediaRemote snapshot (now-spinning/state.json), used
//      only while it reports active playback — carries the system's real art.
//   2. The macOS Music app via AppleScript for the local track/state.
//   3. When the Mac is not actively playing, the MusicKit helper's account-wide
//      now-playing (e.g. playback on iPhone), which carries correct Apple Music art.
//   4. Cover-art fallback via the iTunes Search API: the album is looked up
//      first (entity=album), then song artwork; combined artist strings are also
//      tried per token and a " - Single"/" - EP" album suffix stripped. Cached
//      per album so it only refetches when the album changes.
// Output fields are delimited by the ASCII Unit Separator (0x1F).
export const command =
  `US=$(printf '\\037'); ` +
  // Optional MediaRemote snapshot written by your own companion (not included).
  // If the file is absent, this is skipped and the Music app path is used.
  `S="$HOME/.config/widgetsuite/now-playing-state.json"; ` +
  `if [ -s "$S" ] && grep -q '"playing"[[:space:]]*:[[:space:]]*true' "$S"; then cat "$S"; exit 0; fi; ` +
  `INFO=$(osascript -e '` +
  `set d to (ASCII character 31)\n` +
  `if application "Music" is running then\n` +
  `  tell application "Music"\n` +
  `    if player state is not stopped then\n` +
  `      return (get name of current track) & d & (get artist of current track) & d & (get album of current track) & d & (player state as text)\n` +
  `    end if\n` +
  `  end tell\n` +
  `end if\n` +
  `return "idle"'); ` +
  `case "$INFO" in ` +
  `  idle|"") TRACK=""; ARTIST=""; ALBUM=""; STATE="";; ` +
  `  *) TRACK=$(printf '%s' "$INFO" | cut -d"$US" -f1); ` +
  `     ARTIST=$(printf '%s' "$INFO" | cut -d"$US" -f2); ` +
  `     ALBUM=$(printf '%s' "$INFO" | cut -d"$US" -f3); ` +
  `     STATE=$(printf '%s' "$INFO" | cut -d"$US" -f4);; ` +
  `esac; ` +
  // Mac not actively playing -> account-wide now-playing via MusicKit (correct art).
  `if [ "$STATE" != "playing" ]; then ` +
    `MK=$(/usr/bin/python3 "$HOME/.config/widgetsuite/musickit-fetch.py" --nowplaying "$TRACK" "$ARTIST" 2>/dev/null); ` +
    `if [ -n "$MK" ]; then printf '%s' "$MK"; exit 0; fi; ` +
  `fi; ` +
  `case "$INFO" in idle|"") printf '%s' "$INFO"; exit 0;; esac; ` +
  `C="$HOME/Library/Caches/ws-nowplaying-art.txt"; PREV=$(cat "$C" 2>/dev/null); ` +
  `if [ "$(printf '%s' "$PREV" | cut -d"$US" -f1)" = "$ARTIST$ALBUM$TRACK" ] && [ -n "$ARTIST" ] && [ -n "$(printf '%s' "$PREV" | cut -d"$US" -f2)" ]; then ` +
    `ART=$(printf '%s' "$PREV" | cut -d"$US" -f2); ` +
  `else ` +
    // Correct sleeve from Apple Music (MusicKit catalog) first.
    `ART=$(/usr/bin/python3 "$HOME/.config/widgetsuite/musickit-fetch.py" --cover "$TRACK" "$ARTIST" "$ALBUM" 2>/dev/null); ` +
    // iTunes Search fallback. art_of <term> <entity>: first artworkUrl100 match, upscaled to 600x600.
    `art_of(){ curl -s -G "https://itunes.apple.com/search" --data-urlencode "term=$1" -d "entity=$2&limit=1" ` +
    `| grep -o '"artworkUrl100":"[^"]*"' | head -1 | sed -e 's/^"artworkUrl100":"//' -e 's/"$//' | tr -d '\\\\' | sed 's/100x100bb/600x600bb/'; }; ` +
    `A1=$(printf '%s' "$ARTIST" | sed -E 's/ (&|x|feat\\.?|ft\\.?|,) .*//'); ` +
    `A2=$(printf '%s' "$ARTIST" | sed -E 's/.* (&|x|feat\\.?|ft\\.?|,) //'); ` +
    `ALBUMC=$(printf '%s' "$ALBUM" | sed -E 's/ - (Single|EP)$//'); ` +
    // Album artwork is the true sleeve; try it before song artwork.
    `[ -z "$ART" ] && ART=$(art_of "$ARTIST $ALBUMC" album); ` +
    `[ -z "$ART" ] && [ "$A1" != "$ARTIST" ] && ART=$(art_of "$A1 $ALBUMC" album); ` +
    `[ -z "$ART" ] && ART=$(art_of "$ARTIST $TRACK" song); ` +
    `[ -z "$ART" ] && [ "$A2" != "$ARTIST" ] && ART=$(art_of "$A2 $TRACK" song); ` +
    `[ -z "$ART" ] && [ "$A1" != "$ARTIST" ] && ART=$(art_of "$A1 $TRACK" song); ` +
    `[ -z "$ART" ] && ART=$(art_of "$TRACK" song); ` +
    // Cache only on a hit, so a miss retries next refresh instead of sticking.
    `[ -n "$ART" ] && printf '%s%s%s' "$ARTIST$ALBUM$TRACK" "$US" "$ART" > "$C"; ` +
  `fi; ` +
  `printf '%s%s%s' "$INFO" "$US" "$ART"`;

export const refreshFrequency = 1000 * 2; // pick up track / play-pause changes

const D = 128;
export const className = card("dark", 176, 176, ...LAYOUT.nowSpinning) + `
  background: transparent; box-shadow: none; backdrop-filter: none; overflow: visible;
  padding: 0; display: flex; align-items: center; justify-content: center;
  .stage  { position:relative; width:${D}px; height:${D}px;
            display:flex; align-items:center; justify-content:center; }
  .backlight { position:absolute; inset:10px; border-radius:50%; pointer-events:none;
            background: radial-gradient(circle at 50% 45%,
                          rgba(255,255,255,0.16), transparent 64%);
            filter: blur(12px); }
  .tilt   { position:relative; width:${D}px; height:${D}px; transform: rotate(-15deg);
            filter: drop-shadow(0 14px 26px rgba(0,0,0,0.55))
                    drop-shadow(0 3px 6px rgba(0,0,0,0.4)); }
  .vinyl  { position:relative; width:${D}px; height:${D}px; border-radius:50%;
            background: radial-gradient(circle at 32% 24%, rgba(255,255,255,0.07), transparent 58%),
                        radial-gradient(circle at 68% 80%, rgba(0,0,0,0.6), transparent 55%),
                        #0b0b0e; }
  .groove { position:absolute; border-radius:50%; border:1px solid rgba(255,255,255,0.06);
            top:50%; left:50%; transform:translate(-50%,-50%); }
  .label  { position:absolute; top:50%; left:50%; width:${D * 0.41}px; height:${D * 0.41}px;
            transform:translate(-50%,-50%); border-radius:50%; overflow:hidden;
            display:flex; align-items:center; justify-content:center;
            font-family:${mono}; font-size:8px; font-weight:700; letter-spacing:0.5px;
            text-transform:uppercase; color:#fff;
            box-shadow: inset 0 0 0 1.5px rgba(0,0,0,0.45),
                        inset 3px 3px 6px rgba(255,255,255,0.35); }
  .art    { width:100%; height:100%; object-fit:cover; }
  .sheen  { position:absolute; top:50%; left:50%; width:${D}px; height:${D}px;
            transform:translate(-50%,-50%); border-radius:50%; pointer-events:none;
            background: radial-gradient(120px at 30% 20%, rgba(255,255,255,0.22), transparent 55%),
                        linear-gradient(125deg, rgba(255,255,255,0.10) 0%, transparent 38%); }
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
let SPIN_PLAYING = true;
const REDUCED = typeof window !== "undefined" && window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const ensureSpin = () => {
  if (typeof window === "undefined") return;
  if (window.__wsSpinTimer) clearInterval(window.__wsSpinTimer);
  if (window.__wsSpinAngle == null) window.__wsSpinAngle = 0;
  window.__wsSpinTimer = setInterval(() => {
    const el = document.getElementById("ws-vinyl");
    if (!el) return;
    if (SPIN_PLAYING && !REDUCED) window.__wsSpinAngle = (window.__wsSpinAngle + 1.5) % 360;
    el.style.transform = "rotate(" + window.__wsSpinAngle + "deg)";
  }, 16);
};

export const render = (props) => {
  if (isLoading(props)) return <Skel tint={T.tintPink} />;
  // Remember each track (with its cover); when playback stops, show the last
  // known record sitting still rather than reverting to the mock.
  let m = parse(props.output);
  if (m && m.art) {
    remember("nowspinning", m);
  } else if (!m) {
    const cached = recall("nowspinning");
    m = cached && cached.data ? { ...cached.data, playing: false } : MOCK;
  }
  const stamp = (m.album || m.track || "").split(" ")[0];
  SPIN_PLAYING = m.playing;
  ensureSpin();

  return (
    <div aria-label={`Now playing: ${m.track} by ${m.artist}`}>
      <DragHandle k="nowSpinning" />
      <ResizeHandle k="nowSpinning" />
      <div className="stage">
        <div className="backlight" />
        <div className="tilt">
          <div id="ws-vinyl" className="vinyl">
            <div className="groove" style={{ width: D * 0.88, height: D * 0.88 }} />
            <div className="groove" style={{ width: D * 0.73, height: D * 0.73 }} />
            <div className="groove" style={{ width: D * 0.58, height: D * 0.58 }} />
            <div className="label" style={{ background: m.art ? "#000" : T.tintOrange }}>
              {m.art ? <img className="art" src={artSrc(m)} /> : stamp}
            </div>
          </div>
          <div className="sheen" />
        </div>
      </div>
    </div>
  );
};
