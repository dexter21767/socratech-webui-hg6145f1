# Socratech WebUI — FiberHome HG6145F1

[العربية](#العربية) · [English](#english)

<div dir="rtl">

## العربية

واجهة ويب معدلة من مجتمع **Socratech** لموجّه الألياف **FiberHome HG6145F1** الخاص باتصالات الجزائر.
تضيف إعدادات مخفية في الواجهة الأصلية، وتدعم **العربية والفرنسية والإنجليزية**.

انضم إلى المجتمع: [مجموعة فيسبوك](https://www.facebook.com/groups/socratech) · [تيليغرام](https://t.me/socrada)

### ماذا تضيف؟

- واجهة بثلاث لغات: العربية، الفرنسية، الإنجليزية.
- إظهار كلمات مرور PPPoE و VoIP.
- إعدادات DNS المخصص، DDNS، جودة الخدمة (QoS)، الرقابة الأبوية، عزل SSID، DLNA و Samba.
- قائمة **WebUI Options** تحتوي على:
  - **Info**: الإصدار، تاريخ البناء، والتحقق من وجود تحديثات.
  - **VoIP Line / Softphone**: استخدام خط الهاتف من تطبيق على هاتفك أو حاسوبك.
  - **SSH Access**: الوصول إلى الموجّه عبر SSH (داخل الشبكة المحلية فقط).
  - **Serial Console (UART)**: إبقاء المنفذ التسلسلي مفعّلًا لإنقاذ الموجّه، حتى بعد إعادة ضبط المصنع إن أردت.
  - **Disable TR069**: منع التفعيل التلقائي لـ TR-069.
  - **Schedule Reboot**: إعادة تشغيل الموجّه تلقائيًا في وقت تحدده.
  - **Custom WebUI persistence**: الإبقاء على الواجهة بعد إعادة التشغيل.

### تنبيه

> [!WARNING]
> هذا البرنامج مقدَّم **«كما هو»** دون أي ضمان من أي نوع. باستخدامه فإنك تتحمل **كامل المسؤولية** عن جهازك:
> القائمون على المشروع والمساهمون فيه **غير مسؤولين** عن أي عطل في الموجّه، أو فقدان للإعدادات أو للاتصال بالإنترنت أو الهاتف، أو أي ضرر آخر قد ينتج عن استخدامه.
> استخدمه على جهازك فقط. المشروع غير مرتبط بشركة FiberHome ولا باتصالات الجزائر.

### قبل أن تبدأ

- هذه الواجهة مخصصة **فقط** لموجّه **FiberHome HG6145F1** من اتصالات الجزائر بإصدار البرنامج **RP4423**.
  للتحقق: بعد تسجيل الدخول إلى الموجّه، تعرض الصفحة الأولى (**Status** ← **Device Information**) السطر **Software Version**.
- تحتاج حاسوبًا أو هاتفًا متصلًا بالموجّه (عبر WiFi أو كابل).
- تحتاج الدخول بحساب **المسؤول الأعلى (superadmin)**، فالحساب العادي لا يُظهر صفحة التحديث.
  يمكنك توليد كلمة مرور superadmin من عنوان MAC الخاص بموجّهك (مكتوب على الملصق أسفل الموجّه) عبر موقع [sapgen.page.gd](https://sapgen.page.gd/).
- **احتفظ بنسخة احتياطية من إعداداتك قبل التثبيت** (الخطوة 4 أدناه)، لتتمكن من استعادتها إذا حدثت مشكلة.
- التثبيت **لا يغيّر** البرنامج الثابت للموجّه. إذا لم تفعّل خيار الاستمرارية، تعود الواجهة الأصلية بمجرد إعادة تشغيل الموجّه.

### التثبيت خطوة بخطوة

1. **نزّل الملف**: افتح [صفحة آخر إصدار](https://github.com/dexter21767/socratech-webui-hg6145f1/releases/latest)، وفي قسم **Assets** نزّل الملف الذي ينتهي بـ `.bin` (مثل `socratech-webui-1.0.0.bin`).
   لا تفك ضغطه ولا تغيّر اسمه.
2. **افتح صفحة الموجّه**: في المتصفح اكتب `192.168.1.1` في شريط العنوان ثم اضغط Enter.
3. **سجّل الدخول** بحساب **admin**.
4. **خذ نسخة احتياطية من الإعدادات**: اذهب إلى **Management** ← **Device Management** ← **Configuration File**
   (**الإدارة** ← **إدارة الجهاز** ← **ملف الإعدادات**) واضغط **Download configuration file**. احتفظ بالملف في مكان آمن.
5. اذهب إلى **Management** ← **Device Management** ← **Local Upgrade**
   (بالعربية: **الإدارة** ← **إدارة الجهاز** ← **تحديث محلي**).
6. اضغط **Choose File** واختر ملف `.bin` الذي نزّلته، ثم اضغط **Update File**.
7. انتظر بضع ثوانٍ. ستظهر رسالة **Upgrade failed** (فشل الترقية): **هذا طبيعي** ولا يعني وجود مشكلة.
8. **حدّث الصفحة** (زر F5 أو سحب الصفحة للأسفل على الهاتف) وسجّل الدخول من جديد.
   ستظهر الواجهة الجديدة مع قائمة **WebUI Options** في الأعلى.

### تغيير اللغة

اضغط على القائمة التي فيها أيقونة الكرة الأرضية 🌐 (في صفحة تسجيل الدخول أو أعلى الواجهة) واختر **العربية** أو **Français** أو **English**.

### الإبقاء على الواجهة بعد إعادة التشغيل

افتراضيًا تختفي الواجهة المعدلة عند إعادة تشغيل الموجّه. لإبقائها:
**WebUI Options** ← **Custom WebUI persistence** ← **Enable**.

### التحديث إلى إصدار جديد

1. في **WebUI Options** ← **Info** اضغط **Check for updates**. إذا ظهر «يتوفر تحديث»، اضغط **عرض الإصدار** ونزّل ملف `.bin` الجديد.
2. ثبّته بنفس خطوات التثبيت أعلاه.
3. **إذا كانت الاستمرارية مفعّلة**: اذهب إلى **Custom WebUI persistence** واضغط **Disable** ثم **Enable**، وإلا سيعود الإصدار القديم بعد إعادة التشغيل.

### إزالة الواجهة

إذا كانت الاستمرارية مفعّلة اضغط **Disable** في **Custom WebUI persistence**، ثم أعد تشغيل الموجّه. ستعود الواجهة الأصلية.
إعادة ضبط المصنع قد لا تزيل الواجهة المعدلة، لذا عطّل الاستمرارية أولًا.

### واجهت مشكلة؟

افتح [بلاغًا (Issue)](https://github.com/dexter21767/socratech-webui-hg6145f1/issues) واذكر إصدار الواجهة (من صفحة **Info**) ووصفًا لما حدث،
أو اسأل في [مجموعة فيسبوك](https://www.facebook.com/groups/socratech) أو على [تيليغرام](https://t.me/socrada).

### البناء من المصدر

على Linux (أو WSL على Windows) مع `python3`:

```sh
git clone https://github.com/dexter21767/socratech-webui-hg6145f1.git
cd socratech-webui-hg6145f1
sh tools/build-bin.sh
```

الملف الناتج: `build/custom-webui.bin`. التفاصيل التقنية في [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

### المساهمة

الترجمات والإصلاحات والصفحات الجديدة مرحب بها. اقرأ [CONTRIBUTING.md](CONTRIBUTING.md)، ولا تنسَ إضافة اسمك إلى قائمة الشكر.

### شكر وتقدير

- [numberonedz](https://github.com/numberonedz): الواجهة المعدلة الأصلية واستمراريتها بعد إعادة التشغيل.
- [MrSmiiith](https://github.com/MrSmiiith): الوصول عبر SSH.
- مجتمع **Socratech**: الترجمات، الصفحات الجديدة، والصيانة.

### الترخيص

عمل المساهمين في هذا المشروع مرخّص بموجب [رخصة MIT](LICENSE). ملفات FiberHome الأصلية وأعمال المشروع الأصلي ليست مشمولة؛ التفاصيل في [NOTICE.md](NOTICE.md).

</div>

---

## English

A community custom web UI by **Socratech** for the **FiberHome HG6145F1** fiber
router from Algérie Télécom. It unlocks settings hidden in the stock UI and
adds **Arabic, French and English**.

Join the community: [Facebook group](https://www.facebook.com/groups/socratech) · [Telegram](https://t.me/socrada)

### What it adds

- A three-language UI: Arabic, French, English.
- PPPoE and VoIP password reveal.
- Custom DNS, DDNS, QoS, parental control, SSID isolation, DLNA and Samba settings.
- A **WebUI Options** menu with:
  - **Info**: version, build date and an update check.
  - **VoIP Line / Softphone**: use your phone line from an app on your phone or PC.
  - **SSH Access**: SSH into the router (LAN only).
  - **Serial Console (UART)**: keep the serial port enabled as a rescue console,
    optionally even after a factory reset.
  - **Disable TR069**: stop TR-069 from re-enabling itself.
  - **Schedule Reboot**: reboot the router automatically at a set time.
  - **Custom WebUI persistence**: keep the custom UI after a reboot.

### Disclaimer

> [!WARNING]
> This software is provided **"as is"**, without warranty of any kind. By using
> it you take **full responsibility** for your device: the maintainers and
> contributors are **not responsible** for any damage to your router, loss of
> settings, loss of internet or phone service, or any other harm that may result
> from using it. Use it on your own device only. This project is not affiliated
> with FiberHome or Algérie Télécom.

### Before you start

- This is **only** for the **FiberHome HG6145F1** from Algérie Télécom running
  software **RP4423**. To check: after logging in to the router, the first page
  (**Status** → **Device Information**) shows **Software Version**.
- You need a computer or phone connected to the router (Wi-Fi or cable).
- You need to log in with the **superadmin** account; the regular account
  doesn't show the upgrade page. You can generate the superadmin password from
  your router's MAC address (printed on the sticker under the router) at
  [sapgen.page.gd](https://sapgen.page.gd/).
- **Back up your configuration before installing** (step 4 below), so you can
  restore your settings if anything goes wrong.
- Installing **does not change** the router's firmware. Unless you turn on
  persistence, rebooting the router brings back the stock UI.

### Install, step by step

1. **Download the file**: open the
   [latest release](https://github.com/dexter21767/socratech-webui-hg6145f1/releases/latest)
   and, under **Assets**, download the file ending in `.bin`
   (e.g. `socratech-webui-1.0.0.bin`). Don't unzip or rename it.
2. **Open the router page**: type `192.168.1.1` in your browser's address bar
   and press Enter.
3. **Log in** with the **superadmin** account.
4. **Back up your configuration**: go to **Management** → **Device Management**
   → **Configuration File** and click **Download configuration file**. Keep
   the file somewhere safe.
5. Go to **Management** → **Device Management** → **Local Upgrade**.
6. Click **Choose File**, pick the `.bin` file you downloaded, then click
   **Update File**.
7. Wait a few seconds. You will see **Upgrade failed**: **this is normal** and
   not a problem.
8. **Refresh the page** (F5, or pull down on a phone) and log in again. The new
   UI appears, with a **WebUI Options** menu at the top.

### Change the language

Use the menu with the globe icon 🌐 (on the login page or at the top of the UI)
and pick **العربية**, **Français** or **English**.

### Keep it after a reboot

By default the custom UI disappears when the router reboots. To keep it:
**WebUI Options** → **Custom WebUI persistence** → **Enable**.

### Update to a new version

1. In **WebUI Options** → **Info**, click **Check for updates**. If it says
   an update is available, click **View release** and download the new `.bin`.
2. Install it with the same steps as above.
3. **If persistence is on**: open **Custom WebUI persistence** and click
   **Disable**, then **Enable**. Otherwise the old version comes back after a
   reboot.

### Remove it

If persistence is on, click **Disable** in **Custom WebUI persistence**, then
reboot the router. The stock UI comes back. A factory reset may not remove the
custom UI, so turn persistence off first.

### Something wrong?

Open an [issue](https://github.com/dexter21767/socratech-webui-hg6145f1/issues)
with your WebUI version (from the **Info** page) and what happened, or ask in
the [Facebook group](https://www.facebook.com/groups/socratech) or on
[Telegram](https://t.me/socrada).

### Build from source

On Linux (or WSL on Windows) with `python3`:

```sh
git clone https://github.com/dexter21767/socratech-webui-hg6145f1.git
cd socratech-webui-hg6145f1
sh tools/build-bin.sh
```

Output: `build/custom-webui.bin`. Technical details in
[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

### Contribute

Translations, fixes and new pages are welcome. Read
[CONTRIBUTING.md](CONTRIBUTING.md), and add yourself to the credits.

### Credits

- [numberonedz](https://github.com/numberonedz): the original custom WebUI and
  its persistence across reboots.
- [MrSmiiith](https://github.com/MrSmiiith): SSH access.
- The **Socratech** community: translations, new pages and maintenance.

### License

The contributors' work in this project is released under the
[MIT License](LICENSE). FiberHome's original files and the upstream project's
work are not covered; see [NOTICE.md](NOTICE.md).

## Documentation

- [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md): repo layout, how the patch is
  delivered, translations, router quirks, releases
- [docs/BUILD.md](docs/BUILD.md): the `.bin` format and build
- [docs/SSH.md](docs/SSH.md): the SSH Access page
- [docs/UART.md](docs/UART.md): the Serial Console (UART) page
- [docs/VOIP.md](docs/VOIP.md): the VoIP Line / Softphone page
