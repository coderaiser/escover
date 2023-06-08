import {types} from 'putout';

const {SequenceExpression} = types;

export const addMarkToArgument = (path, lineNode) => {
    const {node} = path;
    
    if (!node.argument) {
        node.argument = lineNode;
        return;
    }
    
    node.argument = SequenceExpression([
        lineNode,
        node.argument,
    ]);
};
