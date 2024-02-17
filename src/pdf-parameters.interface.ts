import { HandlebarsOptions } from "@gboutte/nestjs-hbs/dist/handlebars-options.interface";
import { PDFOptions } from "puppeteer";
import {Browser} from "@puppeteer/browsers";
import {BrowserTag} from "./browser.service";

export interface PdfParameters {
  pdfOptions?: PDFOptions;
  hbsOptions?: HandlebarsOptions;
  chromiumRevision?: string;
  headless?: boolean|'new';
  browser?: Browser;
  browserTag?:BrowserTag;
  useLockedBrowser?: boolean;
  browserInstallBaseUrl?: string;
}
