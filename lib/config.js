import {readFileSync} from 'fs';
import once from 'once';
import picomatch from 'picomatch';
import {findUpSync} from 'find-up';

const {parse} = JSON;

export const isExclude = (name, patterns) => {
    const isMatch = picomatch(patterns, {
        dot: true,
    });
    
    return isMatch(name);
};

const defaults = {
    exclude: [],
};

export const readConfig = once(() => {
    const name = findUpSync('.nycrc.json');
    
    if (!name)
        return defaults;
    
    const data = readFileSync(name, 'utf8');
    return {
        ...defaults,
        ...parse(data),
    };
});
