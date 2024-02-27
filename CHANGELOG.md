# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased
### Added
- Added new extraPuppeteerArgs property to the config object, thanks to @orhanveli

## 0.3.2 - 2024-02-17

## 0.3.1 - 2023-09-13

## 0.3.0 - 2023-09-13
### Added
- Nestjs command

### Fixed
- Github workflow
- Version lock

## 0.2.1 - 2023-08-25
### Changed
- Updated dependencies

## 0.2.0 - 2023-08-25
### Changed
- Updated dependencies

## 0.1.0 - 2023-08-25
### Added
- Two config parameters have been added:
  - `browser` (default: `Browser.CHROMIUM`)
  - `browserTag` (default: `BrowserTag.STABLE`)

### Changed
- Updated puppeteer dependancy to `21.0.0`
- Updated the reamdme to reflect the new config parameters

### Deprecated
- The parameter `chromiumRevision` is no longer usefull
