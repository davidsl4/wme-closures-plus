<p align="center">
   <picture>
    <source media="(prefers-color-scheme: dark)" srcset="/docs/logo-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="/docs/logo-light.svg">
    <img alt="W.M.E Closures Plus Logo" src="/docs/logo-light.svg">
  </picture>
</p>

<p align="center">
   Manage with ease all kinds of closures inside the WME!
</p>

## Description

Closures+ is an add-on script for the Waze Map Editor (WME), part of the **Editor+ series**. This series focuses on delivering a **premium experience** for core WME tasks through carefully crafted and enhanced features, high-quality implementation, and dedicated community support.

Handling closures in WME can be time-consuming. Closures+ aims to revolutionize this process, simplifying everything from creation to management and providing powerful tools for efficiency.

> [!WARNING]
> **Early Development Stage:** Closures+ is currently in active development and may be unstable. Features might change, and unexpected behavior could occur.
> We are committed to continuous improvement towards a stable version suitable for general use.
> Until then, please use Closures+ with caution, especially during critical editing. Use at your own risk.

## Features

Closures+ introduces several enhancements to streamline closure management. The status of current and planned features is listed below:

| Feature                     | Description                                                      | Status            |
|-----------------------------|------------------------------------------------------------------|-------------------|
| Recurring Closures          | Define closures that repeat on a schedule (daily, weekly, etc.). | Available         |
| Closure Templates           | Save/load templates for common closures.                         | Planned           |
| Filters                     | Filter/view closures on map/list by date, reason, or status.     | Planned           |
| Quick-Add Durations         | Buttons for common closure lengths.                              | Planned           |
| Bulk Editing                | Modify details (time, reason) or delete multiple closures.       | Planned           |

* **Status Key:**
    * **Available:** Feature is implemented and usable.
    * **Experimental:** Feature is available for testing but may change or have bugs.
    * **Under Development:** Feature is actively being worked on.
    * **Planned:** Feature is intended for a future release.

## Installation

To use Closures+, you **must** have a userscript manager browser extension installed, such as Tampermonkey or Greasemonkey.

1.  **Install a Userscript Manager:** If you don't have one, choose one compatible with your browser:
    * [Tampermonkey](https://www.tampermonkey.net/) (Recommended for Chrome, Firefox, Edge, Safari, Opera)
    * [Greasemonkey](https://www.greasespot.net/) (Firefox)
    * Violentmonkey (Chrome, Firefox, Edge, Opera)
2.  **Install Closures+:**
    * Click here to install directly from [**GitHub**](YOUR_GITHUB_RAW_INSTALL_LINK_HERE)
3.  Your userscript manager should prompt you to confirm the installation. Accept the prompt.
4.  Once installed, Closures+ will automatically be active the next time you load or refresh the Waze Map Editor.

## Usage

1.  Navigate to the Waze Map Editor at [**waze.com/editor**](https://www.waze.com/editor).
2.  Ensure the Closures+ script is enabled in your userscript manager.
3.  Interact with the script's features directly within the WME interface. Look for enhancements in standard locations, such as:
    * The **scripts sidebar/menu**.
    * The **closures editing panel** when segments or turns are selected.
    * New buttons or visual cues on the map or segment list.
4.  The specific steps might vary depending on the task you want to achieve (e.g., creating a single closure, applying a template, bulk editing). The goal is for interactions to be intuitive and feel integrated with the standard WME workflow.

## Contribution

Closures+ is an open-source, community-driven add-on. We aim to create a stable, native-feeling, performant, easy-to-use, and impactful tool for managing closures, and we welcome contributions!

See the [**CONTRIBUTING.md**](/CONTRIBUTING.md) guidelines if you're interested in helping improve Closures+.

## License

This add-on is licensed under the Apache License, Version 2.0. See the [LICENSE](/LICENSE) file for details.