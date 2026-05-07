import {readFileSync} from 'node:fs';
import picomatch from 'picomatch';
import {findUpSync} from 'find-up';

const {parse} = JSON;

const addStars = (patterns) => {
    const result = [];
    
    for (const pattern of patterns) {
        result.push(...[
            `**/${pattern}/**`,
            pattern,
        ]);
    }
    
    return result;
};

export const isExclude = (name, patterns) => {
    const isMatch = picomatch(addStars(patterns), {
        dot: true,
    });
    
    return isMatch(name);
};

const defaults = {
    exclude: [],
};

export const readConfig = (overrides = {}) => {
    const {
        find = findUpSync,
        read = readFileSync,
    } = overrides;
    const name = find('.nycrc.json');
    
    if (!name)
        return defaults;
    
    const data = read(name, 'utf8');
    
    return {
        ...defaults,
        ...parse(data),
    };
};
