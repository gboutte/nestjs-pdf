import * as puppeteerBrowser from "@puppeteer/browsers";
import {Browser} from "@puppeteer/browsers";
import {Inject, Injectable, Logger} from "@nestjs/common";
import * as path from "path";
import {PdfParameters} from "./pdf-parameters.interface";
export enum BrowserTag{
    LATEST = 'latest',
    BETA = 'beta',
    DEV = 'dev',
    STABLE = 'stable',
    CANARY = 'canary',
}
@Injectable()
export class BrowserService {
    private cacheDir: string;
    constructor( @Inject("PDF_PARAMETERS") private options: PdfParameters) {
        this.cacheDir = path.resolve(".cache/puppeteer-browser");
    }

    async install() {
        let versionTag:BrowserTag;
        let browser:Browser;

        if (this.options.browser === undefined) {
            browser = Browser.CHROMIUM;
        } else {
            browser = this.options.browser;
        }
        if(this.options.browserTag === undefined){
            if(browser === Browser.CHROMIUM){
                versionTag = BrowserTag.LATEST;
            }else{
                versionTag = BrowserTag.STABLE;
            }
        }else{
            versionTag = this.options.browserTag;
        }


        const browserPlatform = puppeteerBrowser.detectBrowserPlatform();

        const buildId = await puppeteerBrowser.resolveBuildId(browser,browserPlatform, versionTag);

        Logger.log(`Browser ${browser} ${versionTag} build id: ${buildId}`,'NestJsPdf')

        if(await this.hasBrowserInstalled(browser,buildId)){
            Logger.log('Browser already installed','NestJsPdf')
            return;
        }else{
            Logger.log('Starting browser installation','NestJsPdf')


            const installOption = {
                cacheDir: this.cacheDir,
                browser: browser,
                buildId: buildId,
                downloadProgressCallback: (downloadedBytes, totalBytes) => {
                    const progress = ((downloadedBytes / totalBytes) * 100).toFixed(2);
                    Logger.log(`Downloaded ${progress}%`,'NestJsPdf');
                }
            };

            if (puppeteerBrowser.canDownload(installOption)) {
                Logger.log(`Installing ${installOption.browser} ${installOption.buildId}`,'NestJsPdf')
                const installedBrowser = await puppeteerBrowser.install(installOption)
                if(await this.hasBrowserInstalled(browser,buildId)){
                    Logger.log('Browser installed successfully','NestJsPdf')
                }else{
                    Logger.error('Browser installation failed','NestJsPdf')
                }
            }else{
                Logger.error(`Error, can't install ${installOption.browser} ${installOption.buildId}`,'NestJsPdf')
            }
        }

    }

    async hasBrowserInstalled(browser,buildId){
        const installedBrowserlist = await puppeteerBrowser.getInstalledBrowsers({
            cacheDir: this.cacheDir
        })

        const installedBrowser = installedBrowserlist.find((installedBrowser) => {
            return installedBrowser.browser === browser && installedBrowser.buildId === buildId
        });
        return installedBrowser !== undefined;
    }
}