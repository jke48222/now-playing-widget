# now-playing

> The current track as a tilted, continuously spinning vinyl record.

A self-contained widget for [Übersicht](http://tracesof.net/uebersicht/). The
entire widget lives in `index.jsx` (the shared design system is inlined), so it
runs on any Mac with no extra files beyond the bundled assets.

![screenshot](screenshot.png)

## Install

1. Install and run [Übersicht](http://tracesof.net/uebersicht/).
2. Unzip `now-playing.widget.zip`, or copy the `now-playing.widget` folder into your
   Übersicht widgets directory:
   `~/Library/Application Support/Übersicht/widgets/`
3. Refresh Übersicht (menu bar icon -> Refresh All).

## Notes

- Reads the macOS Music app via AppleScript; cover art via the public iTunes Search API.
- Optional: install the Instrument Serif and Geist font families for the intended typography; system fonts are used as a fallback.

## How to edit

No configuration needed. The cover-art lookup order is in the command string in index.jsx.

All visual styling (colors, fonts, the card shell, drag/resize handles) is in
the inlined design-system block at the top of `index.jsx`.

## Bundled files

- `index.jsx`

## Submitting to the Übersicht gallery

Create a public GitHub repo with `widget.json`, `now-playing.widget.zip`, and a
258x160 (or 516x320 hi-res) `screenshot.png`, then
[open an issue](https://github.com/felixhageloh/uebersicht-widgets/issues) with the URL.

## Author

Jalen Edusei <jalen.edusei@gmail.com>
