import {
    types,
    operator,
} from 'putout';
const {SequenceExpression} = types;

const {replaceWith} = operator;

export const addMarkToThrow = (path, lineNode) => {
    const argumentPath = path.get('argument');
    
    return replaceWith(argumentPath, SequenceExpression([
        lineNode.expression,
        argumentPath.node,
    ]));
};

