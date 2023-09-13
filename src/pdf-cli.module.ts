import {Module} from "@nestjs/common";
import {BrowserService} from "./browser.service";
import {PdfCommand} from "./pdf.command";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [ConfigModule.forRoot()],
    providers: [
        BrowserService,
        PdfCommand,
        {
            provide: "PDF_PARAMETERS",
            useValue: undefined,
        },
    ]
})
export class PdfCliModule {}