# HG6145F1 custom UI

Customisation work for a **FiberHome HG6145F1** GPON ONT (Algerie Telecom,
firmware **RP4423**), on a unit we own. Everything here was collected and
verified from our own NAND dump and the live router on 2026-10-28.

This is the custom web UI: the "custom-webui" patch that overlays modified
pages onto the stock `/www`, plus the original UI as a baseline for our own
changes (e.g. translations).

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

Two files sit in the patch but were **not** bind-mounted on the live router on
2026-10-28, so the stock versions are still served:
`js/admin_management_inter.js` and `js/wlanAdvancedSettings_5G_inter.js`.

## How the patch is delivered

The shell and `.bin` installers do the same thing: drop the files in
`/var/www-custom` and bind-mount each over its stock counterpart in `/www`. The
`.bin` wraps an ARM version of that logic in a FiberHome firmware header so the
web "Local Upgrade" accepts it. Full details and verification in
[docs/BUILD.md](docs/BUILD.md).
