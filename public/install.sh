#!/usr/bin/env sh
set -eu

repo='B-Divyesh/sf-color-signal-lens'
os=$(uname -s | tr '[:upper:]' '[:lower:]')
arch=$(uname -m)
case "$os" in
  darwin) match='\.dmg$' ;;
  linux) match='\.appimage$|\.deb$' ;;
  *) echo "Use install.ps1 on Windows." >&2; exit 1 ;;
esac

release=$(curl -fsSL "https://api.github.com/repos/$repo/releases/latest")
asset=$(printf '%s' "$release" | grep -Eo 'https://[^" ]+' | grep -Ei "$match" | head -n 1)
checksum=$(printf '%s' "$release" | grep -Eo 'https://[^" ]+' | grep 'SHA256SUMS' | head -n 1)
[ -n "$asset" ] && [ -n "$checksum" ] || { echo "A matching download is not published yet." >&2; exit 1; }
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT
name=$(basename "$asset")
curl -fL "$asset" -o "$work/$name"
curl -fL "$checksum" -o "$work/SHA256SUMS"
(cd "$work" && grep " $name$" SHA256SUMS | sha256sum -c -)
echo "Verified $name. Installing it is your next step: $work/$name"
echo "The app is unsigned; your operating system may ask you to confirm it."
