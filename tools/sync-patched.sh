#!/bin/sh
# sync-patched.sh - refresh webui/patched/www (stock + overlay merged, the
# reference view of what the router serves) after editing the overlay.
# The build only reads webui/patch/www-custom; this keeps the mirror honest.
set -e

HERE=$(cd "$(dirname "$0")/.." && pwd)
cp -a "$HERE/webui/patch/www-custom/." "$HERE/webui/patched/www/"
echo "Synced webui/patch/www-custom -> webui/patched/www"
