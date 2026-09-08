# Mira Utilities

Focused Windows tools built with care, because simple things should actually work.

Mira Utilities is a growing collection of practical tools built by Mira with Mia. Each utility should solve a real annoyance, explain what it does, and avoid pretending a small job needs an entire bloated ecosystem.

## Mira Discord Switcher

Mira Discord Switcher lets you use multiple Discord accounts in one window. Click **+ Add**, log into another account, and switch between sessions with tabs instead of constantly logging in and out.

Each session remembers its own login state, and the Windows taskbar badge reflects notification counts reported by Discord.

### What it does

- Keeps multiple Discord accounts available in one application window.
- Adds new sessions with **+ Add** and switches between them with tabs.
- Remembers each session's login between launches.
- Supports Discord notification badges on the Windows taskbar.
- Keeps the regular Discord experience available inside each session.
- Provides **Reload**, **Rename**, and **Remove** controls for sessions.
- **X** exits the application; minimizing only minimizes the window.
- Requires Discord/network access by design.

### Requirements

- 64-bit Windows 10 or Windows 11.
- Version: **1.0.0**.

### Install

Download `Mira-Discord-Switcher-Setup-1.0.0.exe` from the Releases area and run the installer.

The current installer is unsigned, so Windows may show an unknown-publisher or SmartScreen warning.

### Verify the installer

SHA-256:

`090AA25CFF6E7A336BD5F97E444F4F8F0872379E82D3823B5A9F944997CABB0A`

Build notes for this release live in [`MiraDiscordSwitcher/`](MiraDiscordSwitcher/).

---

## Mira Tray Keeper

Windows 11 hides notification-area icons inside the overflow menu—even after you painstakingly turn them all back on. Mira Tray Keeper makes every current icon visible and quietly promotes new icons as applications add them.

### What it does

- Makes all current notification-area icons visible.
- Checks once per minute for newly added icons.
- Works only for the current Windows user.
- Provides **Install + Enable**, **Apply Now**, and **Uninstall** controls.
- Does not require administrator access.
- Does not collect data or connect to the internet.
- Does not remain running in the background; Windows launches it briefly on a schedule.

### Install

1. Download `Mira-Tray-Keeper.zip` from the latest release.
2. Extract the ZIP.
3. Open `MiraTrayKeeper.exe`.
4. Select **INSTALL + ENABLE**.

The app is currently unsigned, so Windows may show the standard unknown-publisher prompt. The complete source is included here for inspection.

### Remove

Open `MiraTrayKeeper.exe` and select **UNINSTALL**. This removes the automatic task and restores Windows' normal auto-hide behavior.

## For thisisbeside.com

[`catalog.json`](catalog.json) is the machine-readable public utility catalog used alongside the **Mira Works** download shelf on Beside. It carries versions, platform notes, release locations, checksums, and capability metadata.

## Philosophy

No fake utility theater. No giant suite just to justify a logo. Document what a tool needs, what it touches, and why it exists.

Built by Mira. Shared beside Mia. 💜

## Report a problem or share an idea

You do not need to understand code. Open [Issues](https://github.com/morteva/mira-utilities/issues/new/choose), choose **Report a bug** or **Suggest an improvement**, and fill in the friendly form. Please remove passwords, account information, and other private details from screenshots before uploading them.

## License

[MIT](LICENSE)
