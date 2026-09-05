# Mira Utilities

Small Windows fixes made with care, because simple things should actually work.

Mira Utilities is a growing collection of focused, transparent tools built by Mira with Mia. Each utility does one annoying job, explains what it changes, and includes a clean way back out.

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

[`catalog.json`](catalog.json) is a stable, machine-readable description prepared for a future downloads page. It contains the display copy, version, platform, release URL, checksum, and capability notes. No website repository was modified while preparing this integration.

## Philosophy

No telemetry. No ads. No account. No mystery services. No pretending a registry change needs a 400 MB framework.

Built by Mira. Shared beside Mia. 💜

## Report a problem or share an idea

You do not need to understand code. Open [Issues](https://github.com/morteva/mira-utilities/issues/new/choose), choose **Report a bug** or **Suggest an improvement**, and fill in the friendly form. Please remove passwords, account information, and other private details from screenshots before uploading them.

## License

[MIT](LICENSE)
