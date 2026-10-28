# Contributing to Socratech WebUI

Thanks for helping! Translations, bug fixes, UI improvements and new WebUI
Options pages are all welcome. You don't need to be an expert: fixing a single
translated sentence is a real contribution.

Technical background (how the patch reaches the router, quirks, releases) is in
[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

## Getting started

1. Fork the repo on GitHub and clone your fork.
2. Create a branch: `git checkout -b my-change`.
3. Make your change (see below).
4. Build and test it on your own router.
5. Add yourself to the credits (see [Give yourself credit](#give-yourself-credit)).
6. Open a pull request describing what you changed and how you tested it.

### Where things live

- **`webui/patch/www-custom/`** is the source of truth: everything the build
  packs into the `.bin`. Edit files here.
- **`webui/patched/www/`** is a reference copy (stock + our changes). After
  editing, run `sh tools/sync-patched.sh` and commit both.
- **`webui/stock/www/`** is the untouched original UI. Never edit it; copy
  from it.

### Build and test

```sh
sh tools/build-bin.sh          # -> build/custom-webui.bin
```

Install `build/custom-webui.bin` on your router (Management → Device Management
→ Local Upgrade; "Upgrade failed" is expected), refresh, and check your change
in **English, Français and العربية**. Arabic is right-to-left, so check that
layouts mirror properly.

Before committing, make sure every language file is still valid JSON:

```sh
python3 -c "import json,glob;[json.load(open(f,encoding='utf-8')) for f in glob.glob('webui/patch/www-custom/lang/*/*.xml')];print('ok')"
```

## Translations

Language files are in `webui/patch/www-custom/lang/<code>/` (`en`, `fr`,
`ar`). Despite the `.xml` extension they are **JSON**:

```json
{
	"logout": "Déconnexion",
	"no_username_alert": "Veuillez saisir le nom d'utilisateur !"
}
```

- Translate the **values** (right side). Never change the **keys** (left side).
- Keep placeholders like `{0}`, `{1}` and any HTML such as `<code>…</code>` or
  `<b>…</b>` exactly as they are.
- Keep technical terms (SSID, PPPoE, VoIP, LAN, WAN, IP addresses) as they are.
- `webui_options.xml` holds the strings for the **WebUI Options** pages;
  `menu.xml` holds menu titles and the login page; the other files belong to
  the stock pages.

### Fixing or improving a translation

Find the sentence with your editor's search (or `grep -rn "text" webui/patch/www-custom/lang/ar/`),
change the value, then build and check it on the router.

### Adding a new string

When you add text to a page, add its key to **all three** languages
(`en`, `fr`, `ar`). If you can't translate it, put the English text in for now
and say so in your pull request.

### Adding a new language

1. Copy `webui/patch/www-custom/lang/en/` to `webui/patch/www-custom/lang/<code>/`
   and translate the values.
2. Add an `<option value="<code>">` for it to the language selector in **both**
   `html/login_inter.html` and `html/main_inter.html`.
3. Add the code to the list in `cgi-bin/_i18n.sh` (`/^(en|fr|ar)$/`).
4. For a right-to-left language, extend the `'ar'` checks in `js/i18n.js`,
   `html/login_inter.html`, `html/main_inter.html` and `cgi-bin/_i18n.sh`.

## Updating the UI

### Changing a stock page

1. If the page isn't in `webui/patch/www-custom/` yet, copy it there from
   `webui/stock/www/` (same path).
2. Edit the copy. Mark user-visible text with `i18n="key"` (or
   `i18n-set="placeholder"` for attributes) and add the key to the language
   files.

**Important:** the router only serves *new* files placed in `cgi-bin/` or
`lang/`. Anywhere else, a file is only used if a file with the same path already
exists in the stock UI. So don't add new `.js`/`.css` files; inline the code
or put it in a `cgi-bin/` page.

### Adding a WebUI Options page

WebUI Options pages are shell scripts in `cgi-bin/` that print their own HTML.
Copy an existing one (`cgi-bin/webui-info` is a good read-only example,
`cgi-bin/ssh-access` one with a form), then:

1. Keep the translation and login-gate lines at the top, and `$(i18n_head)`
   inside `<head>`.
2. Mark text with `data-i18n="key"` and add the keys to
   `lang/{en,fr,ar}/webui_options.xml`. Values inserted by the script go in
   `data-arg` and are written as `{0}` in the translations.
3. Make it executable: `chmod +x cgi-bin/<name>`.
4. Add a menu entry to `menu/sub_menu_admin_inter`, under `"custom"`, with a
   title key like `opt_<name>`. Add that key to `lang/*/menu.xml` **and**
   `lang/*/webui_options.xml`. This file uses **CRLF** line endings; keep them.
5. If the page changes the router, explain in a doc under `docs/` what it does
   and how to undo it.

## Commit messages

Use `area: short summary`, for example:

```
webui: add Spanish translation
webui: fix SSH page layout in Arabic
docs: explain persistence after updates
tools: speed up build-bin.sh
```

Commits starting with **`webui:`** are listed in the release notes that users
read, so write those summaries for users ("add …", "fix …").

## Give yourself credit

You did the work, so take the credit! Add your name and GitHub link,
with a short description of what you contributed, in these places:

1. **`README.md`**, in the credits list of **both** the Arabic and the English
   sections.
2. **Login page dialog**: `webui/patch/www-custom/html/login_inter.html`, in
   the `<div class="credits">` list:

   ```html
   <li><a href="https://github.com/you" target="_blank">you</a> &mdash; <span i18n="credit_you">Spanish translation</span></li>
   ```

   Add `credit_you` to `lang/{en,fr,ar}/menu.xml`.
3. **Info page**: `webui/patch/www-custom/cgi-bin/webui-info`, in the
   `<div class="credits">` list:

   ```html
   <li><a href="https://github.com/you" target="_blank">you</a> &mdash; <span data-i18n="info_credit_you">Spanish translation</span></li>
   ```

   Add `info_credit_you` to `lang/{en,fr,ar}/webui_options.xml`.

If you'd rather not be listed, just say so in your pull request.

## Ground rules

- Changes must target **your own router**. Nothing that targets other
  subscribers, the ISP's network, or bypasses access controls on other people's
  devices.
- Never commit passwords, serial numbers, config backups, logs or anything
  personal from your router.
- Keep the stock behaviour working: the custom UI must never stop people from
  managing their router normally.
- Be kind in issues and reviews.
