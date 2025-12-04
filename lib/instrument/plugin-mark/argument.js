import {types} from 'putout';

const {sequenceExpression} = types;

export const addMarkToArgument = (path, lineNode) => {
    const {node} = path;
    
    if (!node.argument) {
        node.argument = lineNode;
        return;
    }
    
    node.argument = sequenceExpression([
        lineNode,
        node.argument,
    ]);
};
