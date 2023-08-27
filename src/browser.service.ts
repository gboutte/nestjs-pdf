import * as puppeteerBrowser from "@puppeteer/browsers";
import {Browser} from "@puppeteer/browsers";
import {Inject, Injectable, Logger} from "@nestjs/common";
import * as path from "path";
import {PdfParameters} from "./pdf-parameters.interface";
import {ConfigService} from "@nestjs/config";

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

    constructor(private configService: ConfigService) {
        this.cacheDir = path.resolve(".cache/puppeteer-browser");
        this.options = this.configService.get<PdfParameters>('PDF_PARAMETERS');
        this.loadBrowser();
        this.loadBrowserTag();
    }

    async install() {
        const browser: Browser = this.browser;
        const versionTag: BrowserTag = this.browserTag;

        const browserPlatform = puppeteerBrowser.detectBrowserPlatform();

        const buildId = await puppeteerBrowser.resolveBuildId(browser, browserPlatform, versionTag);

        Logger.log(`Browser ${browser} ${versionTag} build id: ${buildId}`, 'NestJsPdf')

        if (await this.hasBrowserInstalled(browser, buildId)) {
            Logger.log('Browser already installed', 'NestJsPdf')
            return;
        } else {
            Logger.log('Starting browser installation', 'NestJsPdf')


            const installOption = {
                cacheDir: this.cacheDir,
                browser: browser,
                buildId: buildId,
                downloadProgressCallback: (downloadedBytes, totalBytes) => {
                    const progress = ((downloadedBytes / totalBytes) * 100).toFixed(2);
                    Logger.log(`Downloaded ${progress}%`, 'NestJsPdf');
                }
            };

            if (puppeteerBrowser.canDownload(installOption)) {
                Logger.log(`Installing ${installOption.browser} ${installOption.buildId}`, 'NestJsPdf')
                const installedBrowser = await puppeteerBrowser.install(installOption)
                if (await this.hasBrowserInstalled(browser, buildId)) {
                    Logger.log('Browser installed successfully', 'NestJsPdf')
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
        const buildId = await puppeteerBrowser.resolveBuildId(browser, browserPlatform, versionTag);
        const installedBrowserlist = await puppeteerBrowser.getInstalledBrowsers({
            cacheDir: this.cacheDir
        });
        console.log(installedBrowserlist)
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
}