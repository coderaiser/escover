import {test, stub} from 'supertape';
import {tryCatch} from 'try-catch';
import istanbul from './istanbul.js';

test('@escover/istanbul: execute', (t) => {
    const coverageFile = [];
    const createCoverageMap = stub();
    const createContext = stub().returns('context');
    const execute = stub();
    
    const createReport = stub().returns({
        execute,
    });
    
    istanbul(coverageFile, {
        createReport,
        createContext,
        createCoverageMap,
    });
    
    t.calledWith(execute, ['context']);
    t.end();
});

test('@escover/istanbul: createCoverageMap', (t) => {
    const coverageFile = [];
    const createCoverageMap = stub();
    const createContext = stub().returns('context');
    const execute = stub();
    
    const createReport = stub().returns({
        execute,
    });
    
    istanbul(coverageFile, {
        createReport,
        createContext,
        createCoverageMap,
    });
    
    t.calledWith(createCoverageMap, [{}]);
    t.end();
});

test('@escover/istanbul: no overrides', (t) => {
    const coverageFile = {};
    const [error] = tryCatch(istanbul, coverageFile);
    
    t.equal(error.message, `☝️Looks like 'coverageFile' is not an array.`);
    t.end();
});

