import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BrowserService } from './browser.service';
import { PdfCommand } from './pdf.command';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    BrowserService,
    PdfCommand,
    {
      provide: 'PDF_PARAMETERS',
      useValue: undefined,
    },
  ],
})
export class PdfCliModule {}
