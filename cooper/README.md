# Cooper.js - Deno Module Auto-Exporter

## Overview

cooper.js is a utility designed for the Deno runtime that automates the creation of barrel files, which serve as central points for exporting all relevant modules from a single directory. This script is directly imported into a `mod.js` file located within the directory you wish to manage, simplifying imports and maintaining a clean codebase by consolidating multiple exports into one file.

## Features

- **Direct Import**: Import directly from a GitHub URL without the need for local installation.
- **Barrel File Generation**: Automatically generates `mod.js` files that serve as central export hubs for directories, consolidating exports into a single file.
- **Collision Detection**: Includes built-in collision detection to prevent issues with duplicate module names.
- **Dynamic Module Management**: Dynamically imports and exports modules based on their directory structure and naming conventions.

## Usage

Here is a sample of a `mod.js` file using cooper to become a barrel file.
```javascript
// mod.js
import barrelMaker from "https://raw.githubusercontent.com/hankatola/deno-snippets/main/cooper/mod.js"

const barrelExports = await barrelMaker(import.meta.url)

export default barrelExports
```
