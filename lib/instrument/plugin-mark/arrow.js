import {types} from 'putout';

const {SequenceExpression} = types;

export const addMarkToArrowFunction = (path, lineNode) => {
    const {node} = path;
    
    node.body = SequenceExpression([
        lineNode,
        node.body,
    ]);
};
