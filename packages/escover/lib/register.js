import {registerHooks} from 'node:module';
import process from 'node:process';
import * as escoverLoader from './escover.js';
import {writeCoverage} from './coverage-file/coverage-file.js';

registerHooks(escoverLoader);

process.once('exit', writeCoverage);
