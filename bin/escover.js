#!/usr/bin/env node

import {cli} from '../lib/cli/cli.js';
import {read} from '../lib/coverage-file.js';

cli({
    argv: process.argv,
    exit: process.exit,
    read,
});

