# now-playing — Setup

> The current track as a spinning vinyl record.

## Install (one click)

1. Install [Übersicht](https://tracesof.net/uebersicht/) and run it once.
2. Double-click `install.command` (or run `./install.sh` in Terminal).
   It copies `now-playing.widget` into your Übersicht widgets folder, installs any
   helpers, and walks you through any configuration.

The installer is safe to re-run; it just refreshes the install in place.
To install by hand instead, unzip `now-playing.widget.zip` into
`~/Library/Application Support/Übersicht/widgets/`.

## Configuration

The widget reads your active player (Music or Spotify) using AppleScript, so it
needs **Automation permission**:

> System Settings → Privacy & Security → Automation → Übersicht → enable Music
> and/or Spotify.

The first time the widget runs, macOS may prompt you directly — choose **Allow**.
If permission is missing, the widget shows a tap-to-fix notice instead of going
blank.

**Optional:** Apple Music artwork and account-wide now-playing via MusicKit.
`install.sh` can run `musickit-setup.sh` for you.

## Fonts

For the intended look, install **Instrument Serif**, **Geist**, and
**Geist Mono**. System fonts are used as a fallback otherwise.
