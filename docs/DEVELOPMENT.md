# Development notes

Technical reference for Socratech WebUI: how the repo is laid out, how the
patch reaches the router, and the quirks you will hit when changing it. For
the contribution workflow see [CONTRIBUTING.md](../CONTRIBUTING.md).

Target: **FiberHome HG6145F1** GPON ONT (Algérie Télécom, firmware
**RP4423**). Everything here was collected and verified from our own NAND dump
and live router (2026-10-28). Scope is our own devices; nothing here targets
other subscribers or ISP infrastructure.

## Repository layout

```
webui/
  stock/www/         original UI from the NAND dump (= live /www without the patch)
  patch/www-custom/  the overlay: every file the patch adds or replaces. THIS is what gets built.
  patched/www/       stock + overlay merged: a reference view of what the router serves
  changes.txt        original patch files marked MODIFIED / NEW / same vs stock
installer/
  custom-webui.sh                self-extracting shell installer (reference logic)
  custom-webui.bin.from-repo     firmware-format installer (upstream copy)
  custom-webui.bin.from-project-root   the other upstream .bin copy
  custom-webui.applier.elf       the upstream ARM applier run at boot
  README.upstream.md             the upstream project's own notes
tools/
  build-bin.sh       builds the flashable .bin from the overlay (see below)
  pack_firmware.py   wraps a payload in the FiberHome upgrade header + CRC32
  sync-patched.sh    copies the overlay into patched/www after you edit it
docs/
  BUILD.md           the .bin format and build, verified end to end
  SSH.md             the SSH Access page
  VOIP.md            the VoIP Line / Softphone page
.github/workflows/
  release.yml        builds and attaches the .bin to each GitHub release
```

Edit files under `webui/patch/www-custom/`, then run `sh tools/sync-patched.sh`
so `webui/patched/www/` matches. Compare against `webui/stock/www/` to see what
the patch changes.

## Building

```sh
sh tools/build-bin.sh            # -> build/custom-webui.bin
sh tools/build-bin.sh <overlay_dir> <output.bin>
```

Needs a POSIX shell, `python3`, GNU `tar` and `base64` (any Linux; WSL works).
No ARM toolchain: the payload is a self-extracting `/bin/sh` script. The build
stages a copy of the overlay, stamps `BUILD_DATE` into its
`cgi-bin/_about.conf` (UTC, or `SOURCE_DATE_EPOCH`), tars it deterministically
and wraps it with `pack_firmware.py`. Same tree + same day = same bytes.
Format details: [BUILD.md](BUILD.md).

## How the patch is delivered

"Local Upgrade" (Management → Device Management) accepts the `.bin`, writes its
payload to `/var/patch_script` and runs it. The payload:

1. extracts the overlay to `/var/www-custom`;
2. remounts `/www` and bind-mounts **the whole `cgi-bin/` and `lang/`
   directories** over the stock ones;
3. bind-mounts every other overlay file **that already exists in stock `/www`**
   over its counterpart;
4. restarts the web server.

The page then says "Upgrade failed": expected, because the payload is not a
firmware image. Nothing is flashed; a reboot restores the stock UI unless
persistence is on.

**Consequence for new files:** a brand-new file outside `cgi-bin/` and `lang/`
(e.g. a new `js/foo.js`) is **not served**, because there is no stock file to
bind it over. Put new code in a `cgi-bin/` page or inline it; new language
files are fine.

### Persistence

**WebUI Options → Custom WebUI persistence** (`cgi-bin/install`) copies the
currently running payload (`/var/patch_script`) to `/fhconf/custom-webui` and
adds `@reboot /fhconf/custom-webui` to `/fhconf/crontab_conf`. Because it
copies whatever was installed at that moment, **after installing a new version
you must Disable then Enable persistence** or the old version returns at the
next reboot. Disabling removes the hook and the copy.

### Orphaned overlay files (upstream installers)

Two overlay files were missing from the upstream applier's bind-mount list:
`js/admin_management_inter.js` (admin session-timeout setting) and
`js/wlanAdvancedSettings_5G_inter.js` (5 GHz SSID isolation + Wi-Fi password
reveal). `installer/custom-webui.sh` and `tools/build-bin.sh` mount them; the
compiled upstream applier (`installer/custom-webui.applier.elf`) still does not.

## Translations

- **Stock pages** load `js/i18n.js`, which reads the `uilang` cookie
  (`en`/`fr`/`ar`, set by the globe selector) and fetches
  `lang/<code>/<domain>.xml`. Despite the `.xml` name these files are **JSON**
  (`"key": "text"`). Elements carry `i18n="key"` (and optionally
  `i18n-set="placeholder"` etc.); JS uses `"key".i18n()`.
- **WebUI Options pages** are shell CGIs that print their own HTML. They source
  `cgi-bin/_i18n.sh` and call `$(i18n_head)` in `<head>`; that inlines a small
  translator which loads `lang/<code>/webui_options.xml` and fills elements
  marked `data-i18n="key"` (`data-arg`, `data-arg1`… fill `{0}`, `{1}`…;
  `data-i18n-html` for templates with markup; `data-i18n-attr` for
  attributes). English stays in the markup as the fallback.
- **Menu titles** are keys in `lang/<code>/menu.xml`, referenced from
  `menu/main_menu_admin_inter` and `menu/sub_menu_admin_inter`.
- **Arabic** sets `dir="rtl"`. `i18n.js` also injects an RTL stylesheet into
  the iframe pages, because the float-based forms don't mirror on their own.

## Router quirks

- **`_point_`:** the router's web server rewrites dotted IPs in CGI output
  (`192.168.1.1` → `192_point_168_point_1_point_1`). The stock `xhr.js` undoes
  it for AJAX; `_i18n.sh` undoes it in the DOM of our CGI pages. Request data
  is not affected.
- **Menu files** (`menu/*`) use CRLF line endings; keep them.
- **Login gate:** custom CGIs call `/www/cgi-bin/is_logined.cgi` and refuse to
  render when it reports not logged in.
- The default LAN is `192.168.1.1`; use `192.168.1.x` in examples.

## Release info and the Info tab

`webui/patch/www-custom/cgi-bin/_about.conf` holds `NAME`, `VERSION`,
`BUILD_DATE` and `GITHUB_URL`, shown on **WebUI Options → Info**. Its "Check
for updates" button asks the GitHub API (from the browser) for the latest
release and compares versions.

Publishing a GitHub release with a tag `vX.Y.Z` runs
[`release.yml`](../.github/workflows/release.yml): it stamps `VERSION` from the
tag, builds, attaches `socratech-webui-X.Y.Z.bin` + `.sha256`, and sets the
release body to the `webui:` commits since the previous tag. The workflow runs
from the **tagged commit**, so tag a commit that already contains any workflow
changes you want.
