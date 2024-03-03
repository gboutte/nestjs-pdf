import { ConsoleLogger } from '@nestjs/common';

export class CliLogger extends ConsoleLogger {
  printMessages(messages, context) {
    if (context === 'NestJsPdf') {
      super.printMessages(messages, context);
    }
  }
}
