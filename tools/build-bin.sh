#!/bin/sh
# build-bin.sh - build a flashable custom-webui .bin from the overlay.
#
# The .bin carries a self-extracting /bin/sh payload (the "patch_script"
# section). On Local Upgrade the device writes that section to /var/patch_script
# and runs it via libLedState.so's run_upgrade_shell -> system(), so a shell
# script works just like the original ARM-ELF payload - no cross-toolchain needed.
#
# Usage: tools/build-bin.sh [overlay_dir] [output.bin]
#   overlay_dir  default: webui/patch/www-custom
#   output.bin   default: build/custom-webui.bin
set -e

HERE=$(cd "$(dirname "$0")/.." && pwd)
OVERLAY="${1:-$HERE/webui/patch/www-custom}"
OUT="${2:-$HERE/build/custom-webui.bin}"

[ -d "$OVERLAY" ] || { echo "overlay dir not found: $OVERLAY" >&2; exit 1; }
command -v python3 >/dev/null || { echo "python3 required" >&2; exit 1; }

WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT
mkdir -p "$(dirname "$OUT")"

# 1) stage the overlay and stamp the build date (UTC, or SOURCE_DATE_EPOCH) into
#    cgi-bin/_about.conf for WebUI Options > Info
cp -a "$OVERLAY" "$WORK/overlay"
BUILD_DATE=$(date -u ${SOURCE_DATE_EPOCH:+-d "@$SOURCE_DATE_EPOCH"} +%Y-%m-%d)
[ -f "$WORK/overlay/cgi-bin/_about.conf" ] && \
    sed -i "s|^BUILD_DATE=.*|BUILD_DATE=\"$BUILD_DATE\"|" "$WORK/overlay/cgi-bin/_about.conf"

# 2) deterministic overlay archive (same tree + build date -> same bytes/CRC)
tar --numeric-owner --owner=0 --group=0 --sort=name --mtime='2026-01-01 00:00:00' \
    -czf "$WORK/overlay.tar.gz" -C "$WORK/overlay" .

# 3) self-extracting shell payload (runs on the device as /var/patch_script)
cat > "$WORK/payload.sh" <<'HDR'
#!/bin/sh
# custom-webui patch payload. Extracts the overlay and binds it over /www.
TARGET_DIR="/var/www-custom"
mkdir -p "$TARGET_DIR"
sed '1,/^PAYLOAD:$/d' "$0" | base64 -d | tar -xzf - -C "$TARGET_DIR"
mountpoint -q /www && umount -l /www
mount /www /www
chmod +x "$TARGET_DIR"/cgi-bin/* 2>/dev/null
# whole cgi-bin as a directory, so every custom CGI (incl. voip-switch) is served
mount --bind "$TARGET_DIR/cgi-bin" /www/cgi-bin
# whole lang dir too, so new languages (fr/ar) appear (new dirs can't be bound per-file)
[ -d "$TARGET_DIR/lang" ] && mount --bind "$TARGET_DIR/lang" /www/lang
# every other overlay file that has a stock counterpart (skip cgi-bin, lang, *.back.*)
cd "$TARGET_DIR" || exit 1
for f in $(find . -type f ! -path './cgi-bin/*' ! -path './lang/*' ! -name '*.back.*'); do
	f="${f#./}"
	[ -e "/www/$f" ] && mount --bind "$TARGET_DIR/$f" "/www/$f"
done
# re-enable SSH if it was left on (persists only because this UI payload is running)
[ -f /fhconf/ssh-access.on ] && [ -x "$TARGET_DIR/cgi-bin/ssh-access" ] && sh "$TARGET_DIR/cgi-bin/ssh-access" --boot >/dev/null 2>&1
# bounce the web server; the watchdog restarts it with the new mounts live
kill $(ps w 2>/dev/null | grep -iE 'http|nginx' | grep -v grep | awk '{print $1}') 2>/dev/null
exit 0
PAYLOAD:
HDR
base64 -w0 "$WORK/overlay.tar.gz" >> "$WORK/payload.sh"

# 4) wrap in the FiberHome upgrade header + init-0 CRC32
python3 "$HERE/tools/pack_firmware.py" "$WORK/payload.sh" "$OUT"
echo "Built $OUT ($(wc -c < "$OUT") bytes) from $OVERLAY"
