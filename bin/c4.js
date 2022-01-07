#!/usr/bin/env node

import chalk from 'chalk';

import {readFileSync} from 'fs';

const {parse} = JSON;
const coverageFile = parse(readFileSync('./coverage.json', 'utf8'));

const files = [];
const coverage = {
    files,
    coveredCount: 0,
    uncoveredCount: 0,
};

console.log('# TAP version 13');
console.log('');

for (const {name, lines} of coverageFile) {
    const uncoveredLines = [];
    
    for (const [line, covered] of Object.entries(lines)) {
        if (covered)
            continue;
        
        uncoveredLines.push(line);
    }
    
    const file = {
        name,
        covered: !uncoveredLines.length,
        uncoveredLines,
    };
    
    if (file.covered)
        ++coverage.coveredCount;
    
    if (!file.covered)
        ++coverage.uncoveredCount;
    
    files.push(file);
}

for (const {name, covered, uncoveredLines} of files) {
    if (!covered) {
        console.log(`# ${name}`);
        console.log('❌ should be covered');
        console.log('---');
        console.log(`lines: ${chalk.red(uncoveredLines.join(','))}`);
    }
}

if (coverage.uncoveredCount)
    console.log('');

console.log(`1..${files.length}`);
console.log(`# files: ${files.length}`);
console.log(`# covered: ${coverage.coveredCount}`);

if (!coverage.uncoveredCount) {
    console.log('');
    console.log('# ☘️  ok');
}

if (coverage.uncoveredCount) {
    console.log(`# 🧨 fail: ${coverage.uncoveredCount}`);
}

