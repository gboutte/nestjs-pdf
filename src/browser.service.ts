import * as puppeteerBrowser from "@puppeteer/browsers";
import {Browser} from "@puppeteer/browsers";
import {Inject, Injectable, Logger} from "@nestjs/common";
import * as path from "path";
import {PdfParameters} from "./pdf-parameters.interface";
import {ConfigService} from "@nestjs/config";
import * as fs from "fs";

export enum BrowserTag {
    LATEST = 'latest',
    BETA = 'beta',
    DEV = 'dev',
    STABLE = 'stable',
    CANARY = 'canary',
}

@Injectable()
export class BrowserService {
    private cacheDir: string;
    private options?: PdfParameters;

    private browser: Browser;
    private browserTag: BrowserTag;
    private useLockedBrowser: boolean;

    constructor(@Inject('PDF_PARAMETERS') pdfParams: PdfParameters) {
        this.cacheDir = path.resolve(".cache/puppeteer-browser");
        this.options = pdfParams;
        this.loadBrowser();
        this.loadBrowserTag();
        this.loadUseLockedBrowser();
    }

    async install(lock: boolean = false) {
        const browser: Browser = this.browser;
        const versionTag: BrowserTag = this.browserTag;

        const browserPlatform = puppeteerBrowser.detectBrowserPlatform();

        const buildId = await puppeteerBrowser.resolveBuildId(browser, browserPlatform, versionTag);

        Logger.log(`Browser ${browser} ${versionTag} build id: ${buildId}`, 'NestJsPdf')

        if (await this.hasBrowserInstalled(browser, buildId)) {
            Logger.log('Browser already installed', 'NestJsPdf')
            if (lock) {
                this.writeLockFile(browser, buildId);
            }
            return;
        } else {
            Logger.log('Starting browser installation', 'NestJsPdf')


            const installOption = {
                cacheDir: this.cacheDir,
                browser: browser,
                buildId: buildId,
                // downloadProgressCallback: (downloadedBytes, totalBytes) => {
                //     const progress = ((downloadedBytes / totalBytes) * 100).toFixed(2);
                //     Logger.log(`Downloaded ${progress}%`, 'NestJsPdf');
                // }
            };

            if (puppeteerBrowser.canDownload(installOption)) {
                Logger.log(`Installing ${installOption.browser} ${installOption.buildId}`, 'NestJsPdf')
                const installedBrowser = await puppeteerBrowser.install(installOption)
                if (await this.hasBrowserInstalled(browser, buildId)) {
                    Logger.log('Browser installed successfully', 'NestJsPdf')
                    if (lock) {
                        this.writeLockFile(browser, buildId);
                    }
                    return installedBrowser;
                } else {
                    Logger.error('Browser installation failed', 'NestJsPdf')
                }
            } else {
                Logger.error(`Error, can't install ${installOption.browser} ${installOption.buildId}`, 'NestJsPdf')
            }
        }
        return null;
    }

    private loadBrowser(): void {
        let browser: Browser;
        if (this.options === undefined || this.options.browser === undefined) {
            browser = Browser.CHROMIUM;
        } else {
            browser = this.options.browser;
        }
        this.browser = browser;
    }

    public setBrowser(browser: Browser): void {
        this.browser = browser;
    }

    public getBrowser(): Browser {
        return this.browser;
    }

    private loadBrowserTag(): void {
        let versionTag: BrowserTag;
        if (this.options === undefined || this.options.browserTag === undefined) {
            if (this.browser === Browser.CHROMIUM) {
                versionTag = BrowserTag.LATEST;
            } else {
                versionTag = BrowserTag.STABLE;
            }
        } else {
            versionTag = this.options.browserTag;
        }
        this.browserTag = versionTag;
    }

    public setBrowserTag(browserTag: BrowserTag): void {
        this.browserTag = browserTag;
    }

    public getBrowserTag(): BrowserTag {
        return this.browserTag;
    }

    private loadUseLockedBrowser(): void {
        let useLockedBrowser: boolean;
        if (this.options === undefined || this.options.useLockedBrowser === undefined) {
            useLockedBrowser = false;
        } else {
            useLockedBrowser = this.options.useLockedBrowser;
        }
        this.useLockedBrowser = useLockedBrowser;
    }

    async hasBrowserInstalled(browser, buildId) {
        const installedBrowserlist = await puppeteerBrowser.getInstalledBrowsers({
            cacheDir: this.cacheDir
        })

        const installedBrowser = installedBrowserlist.find((installedBrowser) => {
            return installedBrowser.browser === browser && installedBrowser.buildId === buildId
        });
        return installedBrowser !== undefined;
    }

    async getExecutablePath(): Promise<string> {
        const browser: Browser = this.browser;
        const versionTag: BrowserTag = this.browserTag
        const browserPlatform = puppeteerBrowser.detectBrowserPlatform();
        let buildId: string;
        if (this.useLockedBrowser) {
            buildId = this.getLockedBuildId(browser);
            Logger.log(`Using locked browser ${buildId}`, 'NestJsPdf')
        }
        if (buildId === null || buildId === undefined) {
            buildId = await puppeteerBrowser.resolveBuildId(browser, browserPlatform, versionTag);
        }
        const installedBrowserlist = await puppeteerBrowser.getInstalledBrowsers({
            cacheDir: this.cacheDir
        });
        const installedBrowser = installedBrowserlist.find((installedBrowser) => {
            return installedBrowser.browser === browser && installedBrowser.buildId === buildId
        });
        if (installedBrowser === undefined) {
            const newinstalledBrowser = await this.install();
            if (newinstalledBrowser === null) {
                throw new Error('Could not install browser')
            } else {
                return newinstalledBrowser.executablePath;
            }
        }
        return installedBrowser.executablePath;
    }

    private writeLockFile(browser: Browser, buildId: string) {
        const lockFile = path.resolve(this.cacheDir, `${browser}.lock`);
        const data = JSON.stringify({
            browser: browser,
            buildId: buildId,
            date: new Date().toISOString(),
        });
        fs.writeFileSync(lockFile, data);

        Logger.log(`Browser ${browser} locked to build ${buildId}`, 'NestJsPdf')

    }

    getLockedBuildId(browser: Browser): string | null {
        const lockFile = path.resolve(this.cacheDir, `${browser}.lock`);
        if (fs.existsSync(lockFile)) {
            const data = fs.readFileSync(lockFile);
            const lock = JSON.parse(data.toString());
            return lock.buildId;
        }
        return null;
    }
}