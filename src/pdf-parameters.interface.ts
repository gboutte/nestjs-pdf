import { HandlebarsOptions } from "@gboutte/nestjs-hbs/dist/handlebars-options.interface";
import { PDFOptions } from "puppeteer";

export interface PdfParameters {
  pdfOptions?: PDFOptions;
  hbsOptions?: HandlebarsOptions;
  chromiumRevision?: string;
}
