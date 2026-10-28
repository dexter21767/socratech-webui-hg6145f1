# webui

Three views of the HG6145F1 web UI, plus a diff summary.

| Path | What it is |
|------|------------|
| `stock/www/` | Original UI from the NAND dump (`mtd7_rootfs1`, active bank). Matches the live `/www` with no patch applied. Our baseline. |
| `patch/www-custom/` | The custom-webui overlay, pulled live from `/var/www-custom` (38 files). |
| `patched/www/` | `stock/www` with `patch/www-custom` copied on top — the UI as the router serves it with the patch on. **Edit here.** |
| `changes.txt` | Each overlay file marked `MODIFIED`, `NEW`, or `same` vs stock. |

Patch summary: 25 modified, 6 new, 7 identical (the whole `cgi-bin/` is
overlaid, so unchanged CGIs are copied along too).

Installer artifacts and the build analysis are one level up, in `../installer/`
and `../docs/BUILD.md`.
