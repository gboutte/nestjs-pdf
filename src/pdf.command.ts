import { Command, CommandRunner, Option } from 'nest-commander';
import {Logger} from "@nestjs/common";
import {BrowserService, BrowserTag} from "./browser.service";
import {Browser} from "@puppeteer/browsers";
interface InstallCommandOptions {
    browser: Browser;
    tag:BrowserTag;
}

@Command({ name: 'install', description: 'Install everything needed for the pdf generation' })
export class PdfCommand extends CommandRunner {
    constructor(private browserService:BrowserService) {
        super()
    }

    async run(
        passedParam: string[],
        options?: InstallCommandOptions,
    ): Promise<void> {
        Logger.log('Start installation command', 'NestJsPdf')
        if (options?.browser === undefined ) {
            Logger.error('No browser specified', 'NestJsPdf')
            return ;
        }
        if (options?.tag === undefined ) {
            Logger.error('No browser tag specified', 'NestJsPdf')
            return ;
        }
        this.browserService.setBrowser(options.browser)
        this.browserService.setBrowserTag(options.tag)

        await this.browserService.install()
    }

    @Option({
        flags: '-b, --browser [browser]',
        description: 'The browser to use for the pdf generation',
    })
    parseBrowser(val: string): Browser {
        return val as Browser;
    }
    @Option({
        flags: '-t, --tag [tag]',
        description: 'The browser version to use for the pdf generation',
    })
    parseBrowserTag(val: string): BrowserTag {
        return val as BrowserTag;
    }

}