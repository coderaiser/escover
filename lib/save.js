import {writeFileSync} from 'fs';
import once from 'once';
import {getFiles} from './report.js';

const {stringify} = JSON;

export const save = once(() => {
    const files = getFiles();
    const report = [];
    for (const [name, places] of files.entries()) {
        const lines = {};
        const current = {
            name,
            lines,
        };
        for (const [place, covered] of places.entries()) {
            const [line] = place.split(':');
            
            lines[line] = covered;
        }
        
        report.push(current);
    }
    
    writeFileSync('./coverage.json', stringify(report, null, 4));
});

