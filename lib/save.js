import {writeFileSync} from 'fs';
import {getFiles} from './c4.js';

const {stringify} = JSON;

export const save = () => {
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
};

