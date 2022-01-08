import {writeFileSync} from 'fs';
import {getFiles} from './c4.js';
import {parse} from './parse.js';
import {merge} from './merge.js';

const {stringify} = JSON;

export const save = () => {
    const files = getFiles();
    const parsed = parse(files);
    const merged = merge(parsed);
    
    writeFileSync('./coverage.json', stringify(merged, null, 4));
};
