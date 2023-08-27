#!/usr/bin/env node
import {CommandFactory} from 'nest-commander';
import {Logger} from "@nestjs/common";
import {PdfCliModule} from "./pdf-cli.module";

const bootstrap = async () => {
    await CommandFactory.run(PdfCliModule, new Logger());
};

bootstrap();