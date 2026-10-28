# Notice: what the license covers

Socratech WebUI is released under the [MIT License](LICENSE), **but only for
the work of this project's contributors**. A large part of this repository
comes from other parties and stays under their terms.

## Covered by the MIT License

Original work by the Socratech WebUI contributors, including:

- the WebUI Options pages we wrote: `cgi-bin/webui-info`, `cgi-bin/voip-switch`,
  `cgi-bin/ssh-access`, and the helpers `cgi-bin/_i18n.sh` and
  `cgi-bin/_about.conf` (all under `webui/patch/www-custom/`);
- our changes to the overlay files (language selector, right-to-left support,
  translation hooks, Info/credits/community additions);
- the French and Arabic translations in `webui/patch/www-custom/lang/fr/`,
  `lang/ar/` and the `webui_options.xml` files, to the extent they are our own
  work;
- `tools/`, `.github/`, `docs/`, `README.md`, `CONTRIBUTING.md`.

## Not covered

- **FiberHome firmware files.** `webui/stock/www/` is the router's original web
  UI, `webui/patched/www/` merges it with the overlay, and many files in
  `webui/patch/www-custom/` are modified copies of it (including the English
  strings in `lang/en/`). These belong to FiberHome and are included only so
  the custom UI can work with the router. They are not licensed by this
  project.
- **The upstream custom WebUI by [numberonedz](https://github.com/numberonedz)**,
  which this project builds on: the files from the original patch overlay
  (listed in `webui/changes.txt`; for example `cgi-bin/ajax`, `cgi-bin/install`,
  `cgi-bin/disable-tr069`, `cgi-bin/schedule-reboot`, the login page) and the
  files in `installer/`. They remain under their author's terms.
- **Third-party libraries** shipped with the UI (such as jQuery and Bootstrap)
  keep their own licenses, stated in their files.

If you are a rights holder and have a concern about a file here, please open
an issue.
