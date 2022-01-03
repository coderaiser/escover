import {readFile} from 'fs/promises';
import {join} from 'path';

const {parse} = JSON;
const list = parse(await readFile('./superload.json'));

const promises = list
    .map((a) => join(process.cwd(), a))
    .map(async (a) => (await import(a)).load);

const loaders = await Promise.all(promises);

export async function load(url, context, defaultLoad) {
    const {format} = context;
    
    let {source} = await defaultLoad(url, { format });
    for (const load of loaders) {
        ({source} = await load(url, {source, format}, defaultLoad));
    }
    
    return {
      format: 'module',
      source,
    };
}

