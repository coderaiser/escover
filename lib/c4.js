export async function load(url, context, defaultLoad) {
    const {format, source} = context;
    
    return {
      format: 'module',
      source: `${source}\n console.log('🧨')`,
    };
}
