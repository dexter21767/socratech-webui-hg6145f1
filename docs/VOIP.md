# VoIP line: RJ11 ↔ LAN softphone

The custom WebUI adds **WebUI Options → Options → VoIP Line / Softphone**
(`webui/patch/www-custom/cgi-bin/voip-switch`), a standalone CGI that moves the
Algerie Telecom voice line between the physical RJ11 handset and one LAN
softphone, and shows the SIP credentials.

## Using it
- Pick **LAN softphone**, enter the phone's static LAN IP (gateway 192.168.2.1), **Apply**.
- Pick **RJ11 handset** to hand the line back.
- One endpoint at a time (one IMS registration per line): LAN mode stops the ONT's
  SIP client; RJ11 restarts it.

## Softphone settings
- Username / number: `21324826219`
- Auth username: `21324826219@voip.ims.algerietelecom.dz`
- Domain / registrar: `voip.ims.algerietelecom.dz`
- Outbound proxy: `10.216.16.66:5060`, transport UDP
- Local SIP port `5060`, RTP `20000–30000`
- Register expiry `3600` (lower to ~60–120 for snappier inbound)
- Codecs: PCMA (G.711 A-law), then PCMU
- **STUN / ICE: OFF** (see troubleshooting)
- Password: shown on the page, read from the device at load time

## Reboot persistence
LAN mode writes `/fhconf/voip-switch.boot` and an `@reboot` line in
`/fhconf/crontab_conf` (this busybox crond supports `@reboot`) that re-applies the
routing at boot once the voice interface is up; RJ11 removes them. Same policy as
the other custom tools (`tr069-firewall`, `schedule-reboot`). The page UI itself
is part of the overlay (runtime until baked into the applier), but the LAN/RJ11
setting persists.

## Troubleshooting

### Can't receive incoming calls (outbound works)
**Turn STUN / ICE OFF in the softphone.** Confirmed fix (2026-10-28): with STUN
enabled the phone advertises a STUN-discovered address in its SIP/SDP, which
breaks inbound delivery through the router's NAT — outbound still works, but the
carrier can't route calls in. Disabling STUN restored incoming calls.

Also helps keep inbound reliable:
- Enable SIP **keep-alive / rport** so the NAT binding stays open between
  re-registrations.
- Keep the app running — exclude it from battery optimization on mobile, or the
  OS kills it and the binding drops.

The router already DNATs inbound SIP (UDP 5060) on the voice interface to the
softphone, ahead of the stock rule, so the router side needs no change.
