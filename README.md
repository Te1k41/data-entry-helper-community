# TTHelper-SC — Community Edition

Built by a sailing scheduler, for sailing schedulers. A Chrome extension that adds checks and shortcut buttons on top of Tradetech's Sailing Schedule screen: date and port-order checks, duplicate vessel/voyage warnings, date syncing and step buttons, vessel and port helpers, notes, keyboard navigation, text highlighting and full-page screenshots. See [FEATURES.md](FEATURES.md) for the feature-by-feature guide.

Maintained by Kai (Team Vietnam). This is the version used by the team; new features are tried first in Kai's own development version and only move here once they work.

## Install in Chrome

1. Download or copy this whole folder to your computer and keep it in place.
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode** (top-right).
4. Click **Load unpacked** and select this folder (the one containing `manifest.json`).
5. Optional, for the Update button: double-click `updater/register.bat` once. See [updater/README.md](updater/README.md).

## What it can and can't do

- **Runs on Tradetech only** for all schedule features (`https://www.tradetech.net/*`, the only host permission).
- **Works through the page you have open, with your own login.** It reads the schedule form, shows warnings and fills fields when you click its buttons. It never touches Tradetech's servers directly, and nothing is saved until you press Tradetech's own Save.
- **Changes it makes without a click:** when a schedule loads, old dates in the notes field are refreshed to today; typing an arrival date copies it to departure. AWR is only *suggested* — a person always clicks **Apply**.
- **Sends no data anywhere.** There are no network calls to any server. Settings and layout stay in your browser; highlights stay in the extension's own storage; screenshots go to your Downloads folder only when you ask.
- **Two small helpers run on all websites:** `highlighter.js` (Ctrl+Shift+H text highlighting, saved only in your browser) and `force-tab-links.js` (opens pop-up windows as normal tabs). Neither reads or sends page data.

### Permissions

| Permission | Why |
|---|---|
| `https://www.tradetech.net/*` | The schedule features. |
| `storage` | Settings and highlights. |
| `downloads`, `activeTab`, `scripting` | Full-page screenshot of the tab you're on, saved as a PNG. |
| `notifications` | One "Extension updated" pop-up after an update. |
| `nativeMessaging` | Lets the Update button run the local updater script. Nothing else. |

## Updates

- Nothing updates on its own — only when you click **🔄 Update Extension**.
- The button runs `updater/update-extension.ps1` on your PC (Chrome lets only this extension call it). It checks the latest commit on this repository's `main` branch, downloads that ZIP from GitHub, and replaces the extension's files (except `updater/`).
- Updates come from https://github.com/Te1k41/data-entry-helper-community. The account is protected with two-factor authentication; there is no signature check on the download yet.

## How it was made

The rules and checks come from daily sailing-schedule work. Most of the code was written with AI coding assistants (Claude Code) under Kai's direction, and every change is tested on real schedules.

## Questions

Contact Kai (Team Vietnam).
