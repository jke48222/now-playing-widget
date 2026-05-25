#!/usr/bin/env bash
# Interactive setup for Now Playing. Invoked by install.sh.
# The widget reads your active player (Music/Spotify) via AppleScript, which
# requires macOS Automation permission for Übersicht. Apple Music artwork via
# MusicKit is optional.
set -euo pipefail
CFG="${CFG:-$HOME/.config/widgetsuite}"

echo "Now Playing shows the track from Music or Spotify as a spinning record."
echo
echo "macOS must allow Übersicht to control those apps:"
echo "  System Settings → Privacy & Security → Automation → Übersicht → enable"
echo "  Music and/or Spotify. (The first time the widget runs, macOS may also"
echo "  prompt you directly — choose Allow.)"
printf "Open Automation settings now? [Y/n] "; read -r a
case "$a" in
  n|N) ;;
  *) open "x-apple.systempreferences:com.apple.preference.security?Privacy_Automation" 2>/dev/null || true ;;
esac

echo
echo "Optional: Apple Music artwork + account-wide now-playing via MusicKit."
if [ -f "$CFG/musickit-setup.sh" ]; then
  printf "Run MusicKit setup now? [y/N] "; read -r m
  case "$m" in y|Y) bash "$CFG/musickit-setup.sh" || true ;; esac
else
  echo "    (MusicKit helper not installed; skipping.)"
fi
