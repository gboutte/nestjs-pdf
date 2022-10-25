import { HandlebarsService } from "@gboutte/nestjs-hbs";
import { Injectable } from "@nestjs/common";

import * as puppeteer from "puppeteer";

@Injectable()
export class PdfService {
  constructor(private readonly hbsService: HandlebarsService) {}

  async generatePdfFromHtml(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "domcontentloaded",
    });

    // create a pdf buffer
    const pdfBuffer = await page.pdf({
      format: "A4",
    });
    return pdfBuffer;
  }

  async generatePdfFromTemplateString(template: string, parameters: any = {}) {
    const html = this.hbsService.render(template, parameters);
    return this.generatePdfFromHtml(html);
  }
  async generatePdfFromTemplateFile(template: string, parameters: any = {}) {
    const html = this.hbsService.renderFile(template, parameters);
    return this.generatePdfFromHtml(html);
  }
}
