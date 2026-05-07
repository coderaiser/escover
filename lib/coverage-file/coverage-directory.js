import {join} from 'node:path';
import {cwd} from 'node:process';
import {mkdirSync} from 'node:fs';

const NAME = 'coverage';

export const getCoverageDirectory = () => join(cwd(), NAME);

export function createCoverageDirectory() {
    const name = join(cwd(), NAME);
    
    mkdirSync(name, {
        recursive: true,
    });
    
    return name;
}

