# Installation

```shell
npm install @gboutte/nestjs-pdf
```

# Configuration

```ts
@Module({
  imports: [
    HandlebarsModule.forRoot({
      pdfOptions: {},
      hbsOptions: {}
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
| `headless`         | Define if you want to use chromium headless or not, or the new version. By default it's `true`. Allowed values: `true`,`false`,`"new"`                                                                                                                                                         |
| `useLockedBrowser`         | Define if you want use to locked version of the browser. By default it's `false`. Allowed values: `true`,`false`                                                                                                                                                                               |


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

    return pdf;
  }
}
```

# Command

You can use the command `nestjs-pdf install` to install the browser you want to use.
You can specify 3 parameters:
- `--browser`: The browser to use for the PDF generation. Allowed values `chromium`, `chrome`, `chrome-headless-shell`, `firefox`, `chromedriver`([Official documentation of Browser](https://pptr.dev/browsers-api/browsers.browser))
- `--browser-tag`: The version of the browser to use for the PDF generation. Allowed values `stable`, `latest`, `beta`, `dev`, `canary`
- `--lock`: Define if you want to lock version of the browser. Allowed values `true`,`false`
# Known issues

- Currently, the pdf only works with fastify adapter