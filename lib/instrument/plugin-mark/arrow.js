import {types} from 'putout';

const {sequenceExpression} = types;

export const addMarkToArrowFunction = (path, lineNode) => {
    const {node} = path;
    
    node.body = sequenceExpression([
        lineNode,
        node.body,
    ]);
};
