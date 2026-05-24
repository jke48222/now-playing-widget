# now-playing

> The current track as a tilted, continuously spinning vinyl record.

A widget for [Übersicht](http://tracesof.net/uebersicht/), self-contained in
`index.jsx`. It reads the macOS Music app via AppleScript. Connect it to the
Apple Music (MusicKit) API (below) for correct album artwork and to reflect
playback happening on other devices (e.g. your iPhone).

![screenshot](screenshot.png)

### On the desktop

The widget shown running alongside the full set:

[![Homescreen demo — click to play](homescreen-poster.png)](homescreen.mp4)

## Install

1. Install and run [Übersicht](http://tracesof.net/uebersicht/).
2. Unzip `now-playing.widget.zip`, or copy the `now-playing.widget` folder into
   your Übersicht widgets directory:
   `~/Library/Application Support/Übersicht/widgets/`
3. Refresh Übersicht (menu bar icon -> Refresh All).

Without the MusicKit setup, the track comes from the Music app and the cover is
resolved via the public iTunes Search API (a best-effort match).

## Connect to Apple Music / MusicKit (optional)

The widget uses a local helper that calls the Apple Music API to (a) fetch the
correct catalog artwork for the playing track and (b) surface account-wide
now-playing when the Mac itself is idle. When the helper is absent it falls back
to the iTunes Search API, so this step is optional.

1. Create the config directory and copy the helpers:
   ```sh
   mkdir -p ~/.config/widgetsuite
   cp setup/musickit-fetch.py setup/musickit-setup.sh ~/.config/widgetsuite/
   ```
2. In the [Apple Developer portal](https://developer.apple.com/account) create a
   **MusicKit identifier** and a **private key (.p8)**, then place:
   ```sh
   #  ~/.config/widgetsuite/musickit.p8     (the downloaded private key)
   #  ~/.config/widgetsuite/musickit.json   {"keyId": "ABC123DEF4", "teamId": "TEAMID1234"}
   ```
3. Authorize Apple Music to get a Music User Token:
   ```sh
   bash ~/.config/widgetsuite/musickit-setup.sh
   # authorize, then paste the token into:
   #  ~/.config/widgetsuite/musickit-user-token.txt
   ```
4. Refresh Übersicht.

Your `.p8`, tokens, and `musickit.json` stay on your machine and are never
committed (see `.gitignore`). An Apple Developer Program membership is required.

Note: `index.jsx` also checks an optional MediaRemote snapshot at
`~/.config/widgetsuite/now-playing-state.json` (a JSON file you could have your
own companion write for system-accurate artwork; none is included). If that file
does not exist, the widget simply skips it — no action needed.

## How to edit

- Cover-art lookup order: the command string in `index.jsx`.
- Spin speed / sizing: the constants and styles in `index.jsx`.
- All styling is in the inlined design-system block at the top of `index.jsx`.

## Bundled files

- `now-playing.widget/index.jsx` — the widget
- `setup/musickit-fetch.py` — optional Apple Music helper (no keys included)
- `setup/musickit-setup.sh` — one-time MusicKit authorization helper

## Other widgets

- [Animated Wallpaper](https://github.com/jke48222/animated-wallpaper-widget)
- [Clipboard History](https://github.com/jke48222/clipboard-history-widget)
- [Daily AI Prompt](https://github.com/jke48222/daily-ai-prompt-widget)
- [Daily Astronomy Photo](https://github.com/jke48222/daily-astronomy-photo-widget)
- [Daily Tarot](https://github.com/jke48222/daily-tarot-widget)
- [GitHub Contributions](https://github.com/jke48222/github-contributions-widget)
- [Recent Album Covers](https://github.com/jke48222/recent-album-covers-widget)
- [Recent Downloads](https://github.com/jke48222/recent-downloads-widget)
- [Rotating 3D Model](https://github.com/jke48222/rotating-3d-model-widget)
- [Spinning Globe](https://github.com/jke48222/spinning-globe-widget)
- [Wallpaper Switcher](https://github.com/jke48222/wallpaper-switcher-widget)

## Author

Jalen Edusei <jalen.edusei@gmail.com>
