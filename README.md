# Socratech WebUI — HG6145F1

Customisation work for a **FiberHome HG6145F1** GPON ONT (Algerie Telecom,
firmware **RP4423**), on a unit we own. Everything here was collected and
verified from our own NAND dump and the live router on 2026-10-28.

This is **Socratech WebUI**, the community custom web UI: the "custom-webui"
patch that overlays modified pages onto the stock `/www`, plus the original UI
as a baseline for our own changes (e.g. translations).

> Scope: our own device. Nothing here targets other subscribers or ISP
> infrastructure.

## Layout

```
webui/
  stock/www/         original UI from the NAND dump (= live /www without the patch)
  patch/www-custom/  the patch overlay, pulled from the router's /var/www-custom (38 files)
  patched/www/       stock + overlay merged = what the router serves with the patch on
  changes.txt        every patch file marked MODIFIED / NEW / same vs stock
installer/
  custom-webui.sh                self-extracting shell installer (reference logic)
  custom-webui.bin.from-repo     firmware-format installer (upstream repo copy)
  custom-webui.bin.from-project-root   the other .bin copy (differs: build date + payload)
  custom-webui.applier.elf       the ARM applier run at boot (= /fhconf/custom-webui)
  README.upstream.md             the upstream project's own notes
tools/
  pack_firmware.py   builds a .bin from an ARM payload (header + CRC32)
docs/
  BUILD.md           how custom-webui.bin is built, verified end to end
```

## Working on the UI

Edit under `webui/patched/www/` — that is the version the router actually
serves. Translations live in `webui/patched/www/lang/<code>/`. Compare against
`webui/stock/www/` to see what the patch already changed. The patch is applied
at runtime (bind-mounts over a read-only `/www`) and does **not** survive a
reboot unless the boot-time applier is installed.

Two overlay files were omitted from the applier's bind-mount list, so their
tweaks weren't served: `js/admin_management_inter.js` (admin session-timeout
setting) and `js/wlanAdvancedSettings_5G_inter.js` (5 GHz SSID isolation + Wi-Fi
password reveal). `installer/custom-webui.sh` now bind-mounts both. Note the
compiled boot applier (`installer/custom-webui.applier.elf`) still omits them,
so a device relying on it needs these two re-mounted after each boot.

The version number and GitHub link shown on **WebUI Options → Info** come from
`webui/patch/www-custom/cgi-bin/_about.conf`. Publishing a GitHub release
(tag `vX.Y.Z`) runs `.github/workflows/release.yml`, which stamps the tag and
date into that file, builds the `.bin` and attaches it (plus a `.sha256`) to
the release.

## How the patch is delivered

The shell and `.bin` installers do the same thing: drop the files in
`/var/www-custom` and bind-mount each over its stock counterpart in `/www`. The
`.bin` wraps an ARM version of that logic in a FiberHome firmware header so the
web "Local Upgrade" accepts it. Full details and verification in
[docs/BUILD.md](docs/BUILD.md).

## Credits

- [numberonedz](https://github.com/numberonedz) — the original custom WebUI
  this project builds on, and its persistence across reboots.
- [MrSmiiith](https://github.com/MrSmiiith) — the SSH access work behind the
  WebUI Options → SSH Access page.
