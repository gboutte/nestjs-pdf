import { HandlebarsOptions } from '@gboutte/nestjs-hbs/dist/handlebars-options.interface';
import { Browser } from '@puppeteer/browsers';
import { PDFOptions } from 'puppeteer';
import { BrowserTag } from './browser.service';

export interface PdfParameters {
  pdfOptions?: PDFOptions;
  hbsOptions?: HandlebarsOptions;
  chromiumRevision?: string;
  headless?: boolean | 'new';
  browser?: Browser;
  browserTag?: BrowserTag;
  useLockedBrowser?: boolean;
  browserInstallBaseUrl?: string;
  extraPuppeteerArgs?: string[];
}
