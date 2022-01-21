import {types} from 'putout';
const {SequenceExpression} = types;

export const addMarkToArgument = (path, lineNode) => {
    const {node} = path;
    const {expression} = lineNode;
    
    if (!node.argument) {
        node.argument = expression;
        return;
    }
    
    node.argument = SequenceExpression([
        expression,
        node.argument,
    ]);
};
