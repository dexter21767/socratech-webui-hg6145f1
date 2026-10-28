# How `custom-webui.bin` is built

The `.bin` is a FiberHome firmware-upgrade file that the stock "Local Upgrade"
page accepts; it carries a payload that lays the custom web files over `/www`.
The device writes the payload (the `patch_script` section) to `/var/patch_script`
and runs it via `libLedState.so`'s `run_upgrade_shell` → `system()` — so the
payload can be an **ARM ELF** (the original repo `.bin`) or a **shell script**
(what `tools/build-bin.sh` produces, confirmed working via Local Upgrade
2026-10-28).

## Two independent delivery shapes, same payload

The project ships the patch in two forms that do the *same* thing:

- **`custom-webui.sh`** — a self-extracting bash script. Everything after the
  `PAYLOAD:` line is `base64(gzip(tar of www-custom))`. It extracts to
  `/var/www-custom`, remounts `/www`, bind-mounts each custom file over its
  stock counterpart, and restarts the web server. Delivered over telnet/SSH.
- **`custom-webui.bin`** — the same action compiled as an ARM ELF, wrapped in a
  firmware header so the web "Local Upgrade" accepts it. This is the interesting
  build.

## Layout of the `.bin`

```
0x000 .. 0xDFF   header (0xE00 = 3584 bytes)
0xE00 .. EOF     payload  = ARM ELF applier
```

The payload is installed verbatim on the router as `/fhconf/custom-webui`
(md5 `7641b8a…`, byte-identical to `repo .bin` minus the 3584-byte header) and
run at every boot via `@reboot /fhconf/custom-webui` in `/fhconf/crontab_conf`.

### Header fields the device checks (from `pack_firmware.py`)

| Offset | Bytes | Field | Value in these files |
|--------|-------|-------|----------------------|
| 0x000  | 16 | HW version      | `WKE2.094.445A01` |
| 0x010  | 16 | HW compat       | `WKE2.094.424A01` |
| 0x044  | – | SW base         | `RX.XX.01.01` |
| 0x053  | – | SW version      | `RP4423` (must match the unit's firmware) |
| 0x100  | 16 | **ATOS magic**  | `~@$^*)+ATOS!#%&(` |
| 0x166  | 4  | **CRC32** (LE)  | over the payload only |
| 0x172  | 8  | chip type       | `BCM6855X` |
| 0x1f0  | – | section count   | `1` |
| 0x200  | – | section name    | `patch_script` |
| 0x220  | – | section size    | payload length, ASCII |

The CRC is a CRC32 variant initialised to 0 (not the usual 0xFFFFFFFF),
computed over the payload bytes. I recomputed it for both files and it matches
the stored value:

- `custom-webui.bin` (project root): payload 466848 B, CRC `0x98DE9477` ✓
- `tools/.../custom-webui.bin` (repo): payload 532696 B, CRC `0xD3D318C8` ✓

The device validates HW/SW compatibility, the ATOS magic, and the CRC32 — then
writes the payload to `/var/patch_script` and runs it (`run_upgrade_shell` →
`system()`). There is no signature and no ELF requirement, so an unsigned ARM
ELF *or* a shell script runs. (The two root/repo `.bin`s differ only in header
build-date and in which payload build they carry.)

## The original payload (ARM applier)

`file`: ELF 32-bit LSB pie, ARM EABI5, static-pie, stripped. Built with
`GCC (GNU) 11.2.1` for `arm-linux-gnueabi`. Its strings show it is the compiled
twin of the shell script:

```
Extracting payload...
tar -xzf - -C "%s"          -> /var/www-custom
mountpoint -q /www && umount -l /www
mount /www /www
mount --bind %s %s           (one per custom file)
```

The web files it installs are a **gzipped tar embedded inside the ELF** at
payload offset `0xa12c` (44 entries = the whole `www-custom` tree in
`../webui/patch/www-custom`).

## Building a new `.bin` — `tools/build-bin.sh`

`tools/build-bin.sh` builds a flashable `.bin` from the overlay using a
**shell-script payload** — no ARM toolchain needed:

```
tools/build-bin.sh [overlay_dir] [output.bin]
#   overlay_dir  default: webui/patch/www-custom
#   output.bin   default: build/custom-webui.bin   (build/ is git-ignored)
```

It:
1. tars the overlay deterministically (`--sort=name`, fixed mtime/owner) to a
   gzip archive;
2. wraps it in a self-extracting `/bin/sh` payload that extracts to
   `/var/www-custom`, remounts `/www`, bind-mounts the **whole `cgi-bin`
   directory**, then bind-mounts every other overlay file that has a stock
   counterpart (skipping `*.back.*`), and bounces the web server;
3. calls `tools/pack_firmware.py` to prepend the 3584-byte header and the
   init-0 CRC32.

The whole-`cgi-bin` mount means new CGIs (e.g. `voip-switch`) are served with no
per-file entry, and the generic file loop also covers the two JS tweaks the
original ELF applier omitted (`admin_management_inter.js`,
`wlanAdvancedSettings_5G_inter.js`). The deterministic tar makes the payload —
and therefore the CRC — reproducible for a given overlay.

Flash the result via **Management → Device Management → Local Upgrade**; the
"Upgrade failed" message is expected (it runs the payload, then reports failure
because it isn't real firmware). Refresh/re-login to see the overlay.

## The original ELF payload (reference)

The repo's `installer/custom-webui.bin` instead carries an ARM ELF applier built
with `arm-linux-gnueabi-gcc -static-pie` that embeds `gzip(tar)` and does the
same extract + bind-mount. Its C source isn't in the repo (only the compiled
ELF, recoverable from the `.bin` or `/fhconf/custom-webui`), its bind-mount list
is baked in (so it omitted the two JS tweaks), and its archive buffer is a fixed
size (so a larger overlay can't simply be swapped in). `build-bin.sh`'s script
payload supersedes it for new builds.
