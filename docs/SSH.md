# SSH access (root shell over the LAN)

The custom WebUI adds **WebUI Options → Options → SSH Access**
(`webui/patch/www-custom/cgi-bin/ssh-access`), which turns root SSH (dropbear)
on and off from the browser — no exploit needed, because the CGI already runs as
root.

This is the WebUI equivalent of what `get_root.py` in the full-access project
does, minus the command-injection bootstrap (that's only needed to get the first
shell). The enable action reproduces its proven steps:

1. Reuse the stock persistent host key `/fhconf/dropbear/dropbear_rsa_host_key`
   (stable fingerprint across reboots).
2. Set the root password from the form (`chpasswd`); the hash is saved to
   `/fhconf/ssh-access.shadow` (mode 600) for boot restore — never the plaintext.
3. Give SSH logins a real shell instead of the vendor CLI: bind-mount a patched
   `/etc/passwd` (root shell → `/bin/ash`), a no-op over
   `/fhrom/fhshell/fh_dropbear.sh` (which otherwise runs `load_cli`), and a
   usable `/etc/profile`.
4. Start `dropbear` bound to the **LAN IP only** (`<br0-ip>:2222`), never
   all-interfaces, and open port 2222 on `br0` only.

Connect from the LAN: `ssh -p 2222 root@192.168.2.1`.

## Off by default, password only
- Ships disabled. Enable from the page by setting a root password (min 6 chars,
  entered twice). No password is shipped in the repo.
- Password auth only (no key option, by choice).
- The page is login-gated (`is_logined.cgi`) like the other tools.
- **Disable** stops dropbear, closes the firewall rule, unmounts the shell
  bind-mounts, removes the saved hash, and locks the root password.

## Persistence — tied to the UI
SSH does **not** get its own `@reboot` hook. Instead, enabling writes the marker
`/fhconf/ssh-access.on`, and the custom-UI payload (the `patch_script` the
`@reboot /fhconf/custom-webui` hook runs — i.e. only when **Custom WebUI
persistence** is enabled) calls `ssh-access --boot` after restoring the overlay.
So:

- UI persistence **on**  → SSH comes back after reboot (if it was left on).
- UI persistence **off** → SSH is gone after reboot, like the rest of the overlay.

`build-bin.sh` bakes that `--boot` call into the payload it generates.

## Security
Root SSH is a real exposure. Mitigations built in: LAN-only bind, firewall open
on `br0` only (never `ppp0`/`veip0.114`), off by default, one-click disable,
login-gated, user-chosen password stored only as a hash. Turn it off when not in
use.
