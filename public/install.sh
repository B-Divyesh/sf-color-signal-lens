#!/usr/bin/env sh
set -eu

repo='B-Divyesh/sf-color-signal-lens'
os=$(uname -s | tr '[:upper:]' '[:lower:]')
arch=$(uname -m)
case "$os" in
  darwin)
    case "$arch" in
      x86_64|i386) match='_x64\.dmg$' ;;
      arm64|aarch64) match='_aarch64\.dmg$' ;;
      *) echo "Unsupported macOS CPU: $arch. Download the matching installer from the release page." >&2; exit 1 ;;
    esac
    ;;
  linux) match='\.appimage$' ;;
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
expected=$(grep " $name$" "$work/SHA256SUMS" | awk '{print $1}')
[ -n "$expected" ] || { echo "No checksum was published for $name." >&2; exit 1; }
if command -v sha256sum >/dev/null 2>&1; then actual=$(sha256sum "$work/$name" | awk '{print $1}'); else actual=$(shasum -a 256 "$work/$name" | awk '{print $1}'); fi
[ "$actual" = "$expected" ] || { echo "Checksum did not match. The download was not installed." >&2; exit 1; }
echo "Verified $name."
if [ "$os" = 'linux' ]; then
  install_dir=${COLOR_SIGNAL_LENS_INSTALL_DIR:-${XDG_BIN_HOME:-$HOME/.local/bin}}
  mkdir -p "$install_dir"
  installed="$install_dir/color-signal-lens"
  mv "$work/$name" "$installed"
  chmod 755 "$installed"
  echo "Installed Color Signal Lens at $installed"
  case ":$PATH:" in *":$install_dir:"*) ;; *) echo "Add $install_dir to PATH to run color-signal-lens from a terminal." ;; esac
else
  install_dir=${COLOR_SIGNAL_LENS_INSTALL_DIR:-$HOME/Downloads}
  mkdir -p "$install_dir"
  installed="$install_dir/$name"
  mv "$work/$name" "$installed"
  echo "Saved the verified installer at $installed"
  if [ "${COLOR_SIGNAL_LENS_NO_LAUNCH:-0}" != '1' ]; then open "$installed"; fi
fi
echo "The app is unsigned; your operating system may ask you to confirm it."
