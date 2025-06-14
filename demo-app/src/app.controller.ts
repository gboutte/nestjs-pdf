import { Controller, Get, Header, StreamableFile } from '@nestjs/common';
import { PdfService } from '@gboutte/nestjs-pdf';

@Controller()
export class AppController {
  constructor(private readonly pdfService: PdfService) {}

  @Get()
  @Header('Cache-Control', 'none')
  @Header('Content-Type', 'application/pdf')
  async getPdf() {
    const price = 123.45;

    const pdf = await this.pdfService.generatePdfFromTemplateString(
      '<h1>Title</h1> Product price: {{price}}€',
      {
        price,
      },
    );

    return new StreamableFile(pdf);
  }
}
