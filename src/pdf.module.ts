import {HandlebarsModule} from "@gboutte/nestjs-hbs";
import {DynamicModule, Global, Inject, Logger, Module} from "@nestjs/common";
import {PdfParameters} from "./pdf-parameters.interface";
import {PdfService} from "./pdf.service";
import {BrowserService} from "./browser.service";
import {PdfCommand} from "./pdf.command";
import {ConfigModule} from "@nestjs/config";

@Global()
@Module({
    imports: [],
    providers: [
        PdfService,
        BrowserService,
    ],
    exports: [PdfService],
})
export class PdfModule {
    constructor(private browserService: BrowserService,@Inject('PDF_PARAMETERS') pdfParams: PdfParameters) {
        browserService.install(pdfParams.useLockedBrowser !== undefined ? pdfParams.useLockedBrowser : false);
    }

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
            imports: [HandlebarsModule.forRoot(hbsOptions),ConfigModule.forRoot()],
        };
    }
}
