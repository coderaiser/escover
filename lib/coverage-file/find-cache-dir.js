import {join} from 'node:path';
import {cwd} from 'node:process';
import {mkdirSync} from 'node:fs';

export function findCacheDir() {
    const name = join(cwd(), 'coverage');
    
    mkdirSync(name, {
        recursive: true,
    });
    
    return name;
}
