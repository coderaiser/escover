import chalk from 'chalk';

import {readFileSync} from 'fs';

const {parse} = JSON;
const coverage = parse(readFileSync('./coverage.json', 'utf8'));

const files = [];

for (const {name, lines} of coverage) {
    const uncoveredLines = [];
    
    for (const [line, covered] of Object.entries(lines)) {
      if (covered)
          continue;

       uncoveredLines.push(line);
    }
    
    files.push({
        name,
        uncoveredLines,
    });
}

for (const {name, uncoveredLines} of files) {
    if (!uncoveredLines.length) {
        console.log(chalk.green(`☘️  ${name}`));
        continue;
    }
    console.log(chalk.red(`🧨 ${name}: ${uncoveredLines.join(',')}`));
}

