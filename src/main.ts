#!/usr/bin/env node
import { CommandFactory } from 'nest-commander';
import { CliLogger } from './cli-logger';
import { PdfCliModule } from './pdf-cli.module';

const bootstrap = async () => {
  await CommandFactory.run(PdfCliModule, {
    logger: new CliLogger(),
  });
};

bootstrap();
