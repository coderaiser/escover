const [error, {packageJson} = {}] = tryCatch(readPackageUpSync);
data += 'fix:' + '\n';
