import { HandlebarsModule } from "@gboutte/nestjs-hbs";
import { DynamicModule, Module } from "@nestjs/common";
import { PdfParameters } from "./pdf-parameters.interface";
import { PdfService } from "./pdf.service";

@Module({
  imports: [],
  providers: [PdfService],
  exports: [PdfService],
})
export class PdfModule {
  static forRoot(pdfParameters: PdfParameters): DynamicModule {
    let hbsOptions;
    if (pdfParameters.hbsOptions === undefined) {
      hbsOptions = {};
    } else {
      hbsOptions = pdfParameters.hbsOptions;
    }

    return {
      module: PdfModule,
      providers: [
        {
          provide: "PDF_PARAMETERS",
          useValue: pdfParameters,
        },
      ],
      imports: [HandlebarsModule.forRoot(hbsOptions)],
    };
  }
}
