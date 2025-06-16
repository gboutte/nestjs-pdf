# Installation

```shell
npm install @gboutte/nestjs-pdf
```

# Configuration

```ts
@Module({
  imports: [
    PdfModule.forRoot({
        pdfOptions: {},
        hbsOptions: {},
      }
    )
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```
|                    | Description                                                                                                                                                                                                                                                                                    |
|--------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `pdfOptions`       | The pdf options can be found on: https://pptr.dev/api/puppeteer.pdfoptions                                                                                                                                                                                                                     |
| `hbsOptions`       | The handlebars can be found on [@gboutte/nestjs-hbs](https://github.com/gboutte/nestjs-hbs)                                                                                                                                                                                                    |                                         |
| `browser` | The browser to use for the PDF generation. By default: `Browser.CHROMIUM`. Allowed values `Browser.CHROMIUM`, `Browser.CHROMEHEADLESSSHELL`, `Browser.CHROME`, `Browser.FIREFOX`, `Browser.CHROMEDRIVER` ([Official documentation of Browser](https://pptr.dev/browsers-api/browsers.browser)) |
| `browserTag` | The version of the browser to use for the PDF generation. By default: `BrowserTag.STABLE`. Allowed values `BrowserTag.STABLE`, `BrowserTag.LATEST`, `BrowserTag.BETA`, `BrowserTag.DEV`, `BrowserTag.CANARY`                                                                                   |
| `browserInstallBaseUrl` | The baseUrl used for the installation of the browser. This baseUrl is passed to the [`install`](https://pptr.dev/browsers-api/browsers.install) method of `@puppeteer/browsers`                                                                                                                |
| `headless`         | Define if you want to use chromium headless or not, or the old headless version (`shell`). By default it's `true`. Allowed values: `true`,`false`,`"shell"`                                                                                                                                      |
| `useLockedBrowser`         | Define if you want to use the locked version of the browser. By default it's `false`. Allowed values: `true`,`false`                                                                                                                                                                           |
| `extraPuppeteerArgs`         | It passes some extra arguments to Puppeteer's launch method. You can check the default args at bellow. Should be `string[]`                                                                                                                                                                    |
| `buildId`         | You can force the build id. Should be `string`                                                                                                                                                                                                                                                 |


## Default Puppeteer arguments

```ts
[
  "--autoplay-policy=user-gesture-required",
  "--disable-background-networking",
  "--disable-background-timer-throttling",
  "--disable-backgrounding-occluded-windows",
  "--disable-breakpad",
  "--disable-client-side-phishing-detection",
  "--disable-component-update",
  "--disable-default-apps",
  "--disable-dev-shm-usage",
  "--disable-domain-reliability",
  "--disable-extensions",
  "--disable-features=AudioServiceOutOfProcess",
  "--disable-hang-monitor",
  "--disable-ipc-flooding-protection",
  "--disable-notifications",
  "--disable-offer-store-unmasked-wallet-cards",
  "--disable-popup-blocking",
  "--disable-print-preview",
  "--disable-prompt-on-repost",
  "--disable-renderer-backgrounding",
  "--disable-setuid-sandbox",
  "--disable-speech-api",
  "--disable-sync",
  "--hide-scrollbars",
  "--ignore-gpu-blacklist",
  "--metrics-recording-only",
  "--mute-audio",
  "--no-default-browser-check",
  "--no-first-run",
  "--no-pings",
  "--password-store=basic",
  "--use-gl=swiftshader",
  "--use-mock-keychain",
  "--disabled-setupid-sandbox",
]
```

# Usage



You can use the `PdfService`, there is currently two methods

|            | Description                                                                                                                      | Parameters                                                                                                          |
|------------|----------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| `generatePdfFromHtml` | | - `html`: The html to use to generate the pdf|
| `generatePdfFromTemplateString` | | - `template`: The template string to give to the handlebars service.<br>- `parameters`: The parameters to use inside the template|
| `generatePdfFromTemplateFile` | |- `file`:The template file to give to the handlebars service. <br>- `parameters`: The parameters to use inside the template|

Here is an example 
```ts
@Controller()
export class AppController {
  constructor(private readonly pdfService: PdfService) {}

  @Get()
  @Header('Cache-Control', 'none')
  @Header('Content-Type', 'application/pdf')
  async getPdf() {
    const product = new Product();
    product.amount = 53;

    const pdf = await this.pdfService.generatePdfFromTemplateString(
      '<h1>Title</h1> Product price: {{product.amount}}€',
      { product },
    );

    return new StreamableFile(pdf)
  }
}
```

# Command

You can use the command `nestjs-pdf install` to install the browser you want to use.
You can specify 3 parameters:
- `--browser`: The browser to use for the PDF generation. Allowed values `chromium`, `chrome`, `chrome-headless-shell`, `firefox`, `chromedriver`([Official documentation of Browser](https://pptr.dev/browsers-api/browsers.browser))
- `--browser-tag`: The version of the browser to use for the PDF generation. Allowed values `stable`, `latest`, `beta`, `dev`, `canary`
- `--lock`: Define if you want to lock version of the browser. Allowed values `true`,`false`

# BaseUrl

Sometime you need to define the base url for the installation of the browser. You can use the `browserInstallBaseUrl` parameter to define it.
For example if you want to use `CHROMEHEADLESSSHELL` with `STABLE`, you may encounter an error like this:
```
Error: Download failed: server returned code 404. URL: https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/121.0.6167.184/mac-x64/chrome-headless-shell-mac-x64.zip
```
You can find the urls [here](https://googlechromelabs.github.io/chrome-for-testing/), and as you can the url are starting by `https://storage.googleapis.com/chrome-for-testing-public`.

So you can fix the error by adding the `browserInstallBaseUrl` parameter like this:
```ts
PdfModule.forRoot({
  browserInstallBaseUrl:
    'https://storage.googleapis.com/chrome-for-testing-public',
}),
```
