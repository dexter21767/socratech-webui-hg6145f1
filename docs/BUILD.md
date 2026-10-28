# How `custom-webui.bin` is built

Verified against both copies in this tree on 2026-10-28. The `.bin` is a FiberHome
firmware-upgrade file that the stock "Local Upgrade" page accepts; it carries an
ARM applier program that lays the custom web files over `/www`.

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
executes the payload. There is no signature, which is why an unsigned ARM ELF
runs. (The two root/repo `.bin`s differ only in header build-date and in which
payload build they carry.)

## The payload (ARM applier)

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

## Reproducing it

```
# 1. build the ARM applier (C source not in this repo; the shell script is the reference logic)
arm-linux-gnueabi-gcc -static-pie -Os applier.c -o payload.elf
#    applier embeds gzip(tar of www-custom) and does extract + bind-mount

# 2. wrap it in the firmware header + CRC
python3 ../tools/pack_firmware.py payload.elf custom-webui.bin
```

`pack_firmware.py` (in `../tools/`) writes the 3584-byte header with the
constants above, CRC32s the payload with init=0, and concatenates
`header + payload`. That is the entire build.

## What is NOT in this repo

- The C source of the ARM applier (only the compiled ELF, recoverable from
  either `.bin` or `/fhconf/custom-webui`).
- A Makefile / cross-toolchain setup. The reference behaviour is fully captured
  by `../installer/custom-webui.sh`.
