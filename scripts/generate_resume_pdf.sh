#!/usr/bin/env bash
#
# Render /resume/print from the static export to public/Arthur_Krieger_Resume.pdf.
#
# The PDF and the site are generated from the same constants in src/constants/,
# so the downloadable resume can never drift from the one on the site.
#
# Usage:
#   make resume-pdf          # build first, then regenerate the PDF
#   ./scripts/generate_resume_pdf.sh [output.pdf]
#
# Requires: a completed `npm run build` (out/ must exist) and Microsoft Edge or
# Google Chrome installed. Run from Git Bash on Windows.
#
# Two things here are load bearing and easy to get wrong:
#   1. The export sets assetPrefix "/arthurs-portfolio/", so the page has to be
#      served over HTTP from a root containing an "arthurs-portfolio" directory.
#      Opening out/resume/print.html via file:// silently loads no CSS and you
#      get an unstyled PDF.
#   2. The browser is a Windows binary and cannot resolve the POSIX paths this
#      shell uses. Every path passed to it goes through `cygpath -m` first,
#      otherwise it exits 0 and writes nothing at all.
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${PORT:-4187}"
DEST="${1:-$REPO/public/Arthur_Krieger_Resume.pdf}"

BROWSER=""
for candidate in \
	"/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" \
	"/c/Program Files/Microsoft/Edge/Application/msedge.exe" \
	"/c/Program Files/Google/Chrome/Application/chrome.exe" \
	"/c/Program Files (x86)/Google/Chrome/Application/chrome.exe"
do
	[ -f "$candidate" ] && { BROWSER="$candidate"; break; }
done
[ -n "$BROWSER" ] || { echo "No Edge or Chrome found. Install one, or pass a path."; exit 1; }

[ -f "$REPO/out/resume/print.html" ] || { echo "out/resume/print.html missing. Run 'make build' first."; exit 1; }

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK" 2>/dev/null || true' EXIT

mkdir -p "$WORK/root"
cp -r "$REPO/out" "$WORK/root/arthurs-portfolio"

python -m http.server "$PORT" --directory "$WORK/root" >"$WORK/server.log" 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null || true; rm -rf "$WORK" 2>/dev/null || true' EXIT

URL="http://localhost:$PORT/arthurs-portfolio/resume/print.html"
for _ in $(seq 1 40); do curl -sf -o /dev/null "$URL" && break; sleep 0.25; done
curl -sf -o /dev/null "$URL" || { echo "local server never came up"; cat "$WORK/server.log"; exit 1; }

# An unstyled PDF is worse than no PDF, so prove the stylesheet resolves first.
CSS_PATH="$(grep -o '/arthurs-portfolio/_next/static/css/[^"]*\.css' "$REPO/out/resume/print.html" | head -1)"
[ -n "$CSS_PATH" ] || { echo "no stylesheet link found in print.html"; exit 1; }
curl -sf -o /dev/null "http://localhost:$PORT$CSS_PATH" || { echo "stylesheet 404: $CSS_PATH"; exit 1; }

"$BROWSER" --headless=new --disable-gpu --no-pdf-header-footer \
	--print-to-pdf="$(cygpath -m "$WORK/resume.pdf")" \
	--virtual-time-budget=15000 \
	--user-data-dir="$(cygpath -m "$WORK/profile")" \
	"$URL"

# Headless Chromium can return before the PDF is flushed, so wait for the file
# to appear and stop growing rather than trusting the exit code.
for _ in $(seq 1 60); do
	if [ -s "$WORK/resume.pdf" ]; then
		a=$(stat -c %s "$WORK/resume.pdf"); sleep 0.5; b=$(stat -c %s "$WORK/resume.pdf")
		[ "$a" = "$b" ] && break
	fi
	sleep 0.5
done
[ -s "$WORK/resume.pdf" ] || { echo "browser produced no PDF"; exit 1; }

cp "$WORK/resume.pdf" "$DEST"
echo "Wrote $DEST"
