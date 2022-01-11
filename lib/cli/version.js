import {readFileSync} from 'fs';
const {parse} = JSON;

const packageJson = new URL('../../package.json', import.meta.url);

export const version = () => {
    const data = readFileSync(packageJson, 'utf8');
    const {version} = parse(data);
    
    return version;
};

