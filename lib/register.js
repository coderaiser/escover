import {registerHooks} from 'node:module';
import process from 'node:process';
import once from 'once';
import * as escoverLoader from './escover.js';
import {writeCoverage} from './coverage-file/coverage-file.js';

registerHooks(escoverLoader);

process.on('exit', once(() => {
    writeCoverage();
}));
