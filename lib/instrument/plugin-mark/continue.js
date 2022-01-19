import {operator} from 'putout';
const {replaceWithMultiple} = operator;

export const addMarkToContinue = (path, lineNode) => {
    return replaceWithMultiple(path, [
        lineNode,
        path.node,
    ]);
};

