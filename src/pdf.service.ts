import {HandlebarsService} from "@gboutte/nestjs-hbs";
import {Inject, Injectable, Logger} from "@nestjs/common";
import puppeteer from 'puppeteer';
import {PdfParameters} from "./pdf-parameters.interface";
import {BrowserService} from "./browser.service";

@Injectable()
export class PdfService {
    constructor(
        private readonly hbsService: HandlebarsService,
        private readonly browserService: BrowserService,
        @Inject("PDF_PARAMETERS") private options: PdfParameters
    ) {
    }

    async generatePdfFromHtml(html: string): Promise<Buffer> {
        if (this.options.chromiumRevision !== undefined) {
            Logger.warn('Using `chromiumRevision` is no longer supported since the puppeteer update.')
            // chromiumRevision = this.options.chromiumRevision;
        }

        let headless:boolean|'new' = true;
        if (this.options.headless !== undefined) {
            headless = this.options.headless;
        }

        //src: https://www.bannerbear.com/blog/ways-to-speed-up-puppeteer-screenshots/
        const minimal_args = [
            '--autoplay-policy=user-gesture-required',
            '--disable-background-networking',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-breakpad',
            '--disable-client-side-phishing-detection',
            '--disable-component-update',
            '--disable-default-apps',
            '--disable-dev-shm-usage',
            '--disable-domain-reliability',
            '--disable-extensions',
            '--disable-features=AudioServiceOutOfProcess',
            '--disable-hang-monitor',
            '--disable-ipc-flooding-protection',
            '--disable-notifications',
            '--disable-offer-store-unmasked-wallet-cards',
            '--disable-popup-blocking',
            '--disable-print-preview',
            '--disable-prompt-on-repost',
            '--disable-renderer-backgrounding',
            '--disable-setuid-sandbox',
            '--disable-speech-api',
            '--disable-sync',
            '--hide-scrollbars',
            '--ignore-gpu-blacklist',
            '--metrics-recording-only',
            '--mute-audio',
            '--no-default-browser-check',
            '--no-first-run',
            '--no-pings',
            '--password-store=basic',
            '--use-gl=swiftshader',
            '--use-mock-keychain',
            "--disabled-setupid-sandbox"
        ];
        const browser = await puppeteer.launch({
            headless: headless,
            executablePath: await this.browserService.getExecutablePath(),
            args: minimal_args
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
        await page.close();
        await browser.close();
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
