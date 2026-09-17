#!/usr/bin/env bash
#
# Encode every clip in a source directory for the /life video gallery.
#
# Phone captures are far too heavy to serve as is. The Dokkan recordings come
# off Android at 1080x1200 / 120fps / ~6Mbps, which is 16MB for 25 seconds.
# Nothing on a web page needs 120fps, and dropping to 30 is most of the saving.
#
# Usage:
#   scripts/encode_clips.sh [SRC_DIR] [OUT_DIR]
#
# Defaults to reading D:/KriegerDataForge/videos and writing public/videos.
#
# Writes, per clip:
#   <name>.mp4   the encoded clip
#   <name>.jpg   a poster frame
# and one manifest.json for the whole set, carrying each clip's real pixel
# dimensions so the page can size its player to the exact aspect ratio and
# never letterbox.
#
set -euo pipefail

SRC_DIR="${1:-/d/KriegerDataForge/videos}"
OUT_DIR="${2:-public/videos}"

# WIDTH and CRF are the two worth tuning. These clips are shown large rather
# than behind a scrim, so this is deliberately higher quality than a background
# would need. Raise CRF to shrink.
WIDTH=810
FPS=30
CRF=27
AUDIO_KBPS=128
POSTER_AT=2

# The phone captures are 1080 wide but the game only draws its animation in the
# middle 900, leaving a 90px black bar down each side. This crops them off.
# Measured with cropdetect and confirmed frame by frame: the artwork sits
# entirely inside the crop. The game's HUD overlay is drawn full width, so the
# outermost sliver of a damage number can lose part of its last digit. That is
# the whole cost of removing the bars.
# Set CROP="" to keep the full frame.
CROP="900:1200:90:0"

FFMPEG="$(command -v ffmpeg || true)"
FFPROBE="$(command -v ffprobe || true)"
FALLBACK=/c/Users/erkph/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build/bin
[ -z "$FFMPEG" ] && [ -x "$FALLBACK/ffmpeg.exe" ] && FFMPEG="$FALLBACK/ffmpeg.exe"
[ -z "$FFPROBE" ] && [ -x "$FALLBACK/ffprobe.exe" ] && FFPROBE="$FALLBACK/ffprobe.exe"

if [ -z "$FFMPEG" ]; then
	echo "ffmpeg not found. winget install --id Gyan.FFmpeg -e" >&2
	exit 1
fi

# cygpath keeps native Windows ffmpeg happy with MSYS style paths.
win() { cygpath -w "$1" 2>/dev/null || echo "$1"; }

# Crop first, then scale, so WIDTH describes the visible frame.
VF="scale=${WIDTH}:-2,fps=${FPS}"
POSTER_VF="scale=${WIDTH}:-2"
if [ -n "$CROP" ]; then
	VF="crop=${CROP},${VF}"
	POSTER_VF="crop=${CROP},${POSTER_VF}"
fi

mkdir -p "$OUT_DIR"

entries=""
count=0

for src in "$SRC_DIR"/*.mp4; do
	[ -e "$src" ] || continue
	name="$(basename "$src" .mp4)"
	count=$((count + 1))

	echo "[$count] $name"

	# -movflags +faststart moves the moov atom ahead of the media data so
	# playback can start off the first bytes. Without it a clip that starts on
	# scroll stalls until the whole file lands.
	"$FFMPEG" -y -v error -i "$(win "$src")" \
		-vf "$VF" \
		-c:v libx264 -profile:v high -level 4.0 -pix_fmt yuv420p -crf "$CRF" -preset slow \
		-c:a aac -b:a "${AUDIO_KBPS}k" -ac 2 -ar 48000 \
		-movflags +faststart \
		"$(win "$OUT_DIR/$name.mp4")"

	"$FFMPEG" -y -v error -ss "$POSTER_AT" -i "$(win "$src")" \
		-frames:v 1 -vf "$POSTER_VF" -q:v 4 \
		"$(win "$OUT_DIR/$name.jpg")"

	dims="?x?"
	if [ -n "$FFPROBE" ]; then
		dims="$("$FFPROBE" -v error -select_streams v:0 \
			-show_entries stream=width,height -of csv=s=x:p=0 \
			"$(win "$OUT_DIR/$name.mp4")")"
	fi
	w="${dims%%x*}"
	h="${dims##*x}"

	[ -n "$entries" ] && entries="$entries,"
	entries="$entries
	{ \"name\": \"$name\", \"width\": ${w:-810}, \"height\": ${h:-900} }"

	echo "    $(du -h "$OUT_DIR/$name.mp4" | cut -f1)  ${dims}"
done

printf '{\n  "clips": [%s\n  ]\n}\n' "$entries" > "$OUT_DIR/manifest.json"

echo ""
echo "$count clip(s) -> $OUT_DIR  (total $(du -sh "$OUT_DIR" | cut -f1))"
echo "manifest.json written"
