import {join} from 'path';
import {cwd} from 'process';
import {mkdirSync} from 'fs';

export function findCacheDir() {
    const name = join(cwd(), 'coverage');
    
    mkdirSync(name, {
        recursive: true,
    });
    
    return name;
}

