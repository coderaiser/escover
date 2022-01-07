import {types} from 'putout';

const {SequenceExpression} = types;

export const addMarkToArrowFunction = (path, lineNode) => {
    const {node} = path;
    const {expression} = lineNode;
    
    node.body = SequenceExpression([
        expression,
        node.body,
    ]);
};

