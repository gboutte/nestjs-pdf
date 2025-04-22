import { Logger } from '@nestjs/common';
import { Browser } from '@puppeteer/browsers';
import { Command, CommandRunner, Option } from 'nest-commander';
import { BrowserService, BrowserTag } from './browser.service';

interface InstallCommandOptions {
  browser: Browser;
  tag: BrowserTag;
  buildId?: string;
  lock: boolean;
}

@Command({
  name: 'install',
  description: 'Install everything needed for the pdf generation',
})
export class PdfCommand extends CommandRunner {
  constructor(private browserService: BrowserService) {
    super();
  }

  async run(
    passedParam: string[],
    options?: InstallCommandOptions,
  ): Promise<void> {
    Logger.log('Start installation command', 'NestJsPdf');
    if (options?.browser === undefined) {
      Logger.error('No browser specified', 'NestJsPdf');
      return;
    }
    if (options?.tag === undefined) {
      Logger.error('No browser tag specified', 'NestJsPdf');
      return;
    }
    let lock = false;
    if (options?.lock !== undefined) {
      lock = options.lock;
    }

    if (options?.buildId !== undefined) {
      this.browserService.setBuildId(options.buildId);
    }

    this.browserService.setBrowser(options.browser);
    this.browserService.setBrowserTag(options.tag);

    await this.browserService.install(lock);
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

  @Option({
    flags: '-l, --lock [lock]',
  })
  parseLock(val: string): boolean {
    return val === 'true';
  }

  @Option({
    flags: '-i, --id [buildId]',
  })
  parseBuildId(buildId: string): string {
    return buildId;
  }
}
