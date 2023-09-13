#!/usr/bin/env node
import {CommandFactory} from 'nest-commander';
import {Logger} from "@nestjs/common";
import {PdfCliModule} from "./pdf-cli.module";
import {CliLogger} from "./cli-logger";

const bootstrap = async () => {
    await CommandFactory.run(PdfCliModule,{
        logger: new CliLogger(),
    });
};

bootstrap();