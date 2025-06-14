import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PdfModule } from '@gboutte/nestjs-pdf';

@Module({
  imports: [
    PdfModule.forRoot({
      useLockedBrowser: true,
      buildId: '1188792',
      pdfOptions: {},
      hbsOptions: {},
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
