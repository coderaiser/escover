const [error, {packageJson} = {}] = tryCatch(readPackageUpSync);
data += 'fix:' + '\n';

const fn = (a, b = 'hello') => {}
