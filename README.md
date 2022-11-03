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
|                   | Description                                                                                                                            |
|-------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| `pdfOptions` | The pdf options can be found on: https://pptr.dev/api/puppeteer.pdfoptions                                                                |
| `hbsOptions`    | The handlebars can be found on [@gboutte/nestjs-hbs](https://github.com/gboutte/nestjs-hbs) |


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

# Known issues

- Currently the pdf only works with fastify adapter