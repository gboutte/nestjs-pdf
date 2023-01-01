import { HandlebarsService } from "@gboutte/nestjs-hbs";
import { Inject, Injectable } from "@nestjs/common";

import * as puppeteer from "puppeteer";
import { PdfParameters } from "./pdf-parameters.interface";

@Injectable()
export class PdfService {
  constructor(
    private readonly hbsService: HandlebarsService,
    @Inject("PDF_PARAMETERS") private options: PdfParameters
  ) {}

  async generatePdfFromHtml(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "domcontentloaded",
    });
    let pdfopt;
    if (this.options.pdfOptions === undefined) {
      pdfopt = {
        format: "A4",
      };
    } else {
      pdfopt = this.options.pdfOptions;
    }
    // create a pdf buffer
    const pdfBuffer = await page.pdf(pdfopt);
    return pdfBuffer;
  }

  async generatePdfFromTemplateString(template: string, parameters: any = {}) {
    const html = this.hbsService.render(template, parameters);
    return this.generatePdfFromHtml(html);
  }
  async generatePdfFromTemplateFile(file: string, parameters: any = {}) {
    const html = this.hbsService.renderFile(file, parameters);
    return this.generatePdfFromHtml(html);
  }
}
