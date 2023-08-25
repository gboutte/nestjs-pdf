# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Changed
- Updated puppeteer dependancy to `21.0.0`
- Updated the reamdme to reflect the new config parameters

### Deprecated
- The parameter `chromiumRevision` is no longer usefull

### Added
- Two config parameters have been added:
  - `browser` (default: `Browser.CHROMIUM`)
  - `browserTag` (default: `BrowserTag.STABLE`)