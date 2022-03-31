#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import handleError from './handleError';

yargs(hideBin(process.argv))
  .commandDir('commands')
  .command(
    '$0',
    'The cw-bench CLI usage',
    () => undefined,
    () => {
      yargs.showHelp();
    },
  )
  .strict()
  .alias({ h: 'help' })
  .fail(handleError)
  .argv;
