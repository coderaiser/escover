#!/usr/bin/env node

import process from 'node:process';
import {cli} from '../lib/cli/cli.js';
import {readCoverage} from '../lib/coverage-file/coverage-file.js';
import {readConfig} from '../lib/config.js';

cli({
    argv: process.argv,
    exit: process.exit,
    readCoverage,
    readConfig,
});
