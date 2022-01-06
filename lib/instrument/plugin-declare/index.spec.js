import {createTest} from '@putout/test';
import declare from './index.js';

const test = createTest(import.meta.url, {
    declare,
});

test('c4: instrument: declare: report', ({report}) => {
    report('declare', `Declare '__c4'`);
});

test('c4: instrument: declare: transform', ({transform}) => {
    transform('declare');
});

