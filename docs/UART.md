# Serial Console (UART)

**WebUI Options → Serial Console (UART)** keeps the router's serial port
enabled, so you get a console over a USB-serial adapter: useful to rescue the
router when SSH and the web UI are unavailable.

## Why it goes silent

At boot the firmware's console init (`fhdrv_kdrv_console_init` in
`libfhdrv_kdrv_cli_impl.so`) reads `uart_enable` from `/fhconf/uart.conf`:

- `uart_enable=0` (the shipped default, copied from `/fhrom/fhconf/uart.conf`
  on first boot) → `echo 0 0 >/proc/driver/uart/enable`: UART 0 is switched
  off once the FiberHome services start (U-Boot and early kernel messages still
  appear).
- `uart_enable=1` → `echo 0 1 >/proc/driver/uart/enable`: it stays on.

## What the page does

- **Enable UART** writes `uart_enable=1` and switches UART 0 on immediately.
  `/etc/inittab` runs a `getty` on `ttyAMA0`, so you get a login prompt.
- **Keep enabled even after a factory reset** additionally sets the immutable
  flag (`chattr +i /fhconf/uart.conf`). The full "preconfig" reset wipes
  `/fhconf` with `rm -rf` and copies the defaults back; both fail on an
  immutable file, so UART stays on. The firmware can still read it.
- **Disable UART** (or saving without the lock) clears the flag, writes
  `uart_enable=0` and switches UART 0 off.

The Info tab shows the current state.

## Hardware

Open the case and connect a **3.3 V** USB-serial adapter to the board's UART
header (TX, RX, GND; usually 115200 baud, 8N1). Never connect 5 V or RS-232
levels. Root login over the console behaves like SSH only when SSH Access is
enabled (which gives root a normal shell and your password); otherwise root
lands in FiberHome's restricted CLI or is locked.

## Manual equivalent

```sh
chattr -i /fhconf/uart.conf 2>/dev/null
printf '[config]\nuart_enable=1\n' > /fhconf/uart.conf
echo 0 1 > /proc/driver/uart/enable
chattr +i /fhconf/uart.conf      # optional: survive factory resets
```

Undo the lock with `chattr -i /fhconf/uart.conf`.
