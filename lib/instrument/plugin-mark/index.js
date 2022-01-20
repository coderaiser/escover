import {
    template,
    types,
    operator,
} from 'putout';

import {addMarkToReturn} from './return.js';
import {addMarkToArrowFunction} from './arrow.js';
import {addMarkToThrow} from './throw.js';

const {
    NumericLiteral,
    SequenceExpression,
    BlockStatement,
} = types;

const {
    replaceWith,
    compareAny,
    compare,
    replaceWithMultiple,
} = operator;

const LINE = `__c4['🧨'](__l, __c)`;
const buildLineNode = template(LINE, {
    placeholderPattern: /^__[a-z]$/,
});

function getLineNode(c4, {line, column}) {
    c4.init(line, column);
    
    return buildLineNode({
        __l: NumericLiteral(line),
        __c: NumericLiteral(column),
    });
}

export const report = () => 'Mark line';

export const fix = (path, {options}) => {
    const {node} = path;
    
    const {start} = path.node.loc;
    
    const {
        c4 = {
            mark: () => {},
            init: () => {},
        },
    } = options;
    
    const lineNode = getLineNode(c4, start);
    
    if (path.isBlockStatement()) {
        path.node.body.unshift(lineNode);
        return;
    }
    
    if (path.isCallExpression()) {
        const {node} = path;
        replaceWith(path, SequenceExpression([
            lineNode.expression,
            node,
        ]));
        return;
    }
    
    if (path.isLogicalExpression()) {
        replaceWith(path.get('left'), SequenceExpression([
            lineNode.expression,
            path.node.left,
        ]));
        replaceWith(path.get('right'), SequenceExpression([
            getLineNode(c4, path.node.right.loc.start).expression,
            path.node.right,
        ]));
        return;
    }
    
    if (path.isAssignmentPattern() || path.isAssignmentExpression()) {
        replaceWith(path.get('right'), SequenceExpression([
            lineNode.expression,
            node.right,
        ]));
        return;
    }
    
    if (path.isNewExpression()) {
        replaceWith(path, SequenceExpression([
            lineNode.expression,
            node,
        ]));
        return;
    }
    
    if (path.isReturnStatement())
        return addMarkToReturn(path, lineNode);
    
    if (path.isArrowFunctionExpression())
        return addMarkToArrowFunction(path, lineNode);
    
    if (path.isThrowStatement())
        return addMarkToThrow(path, lineNode);
    
    if (path.isContinueStatement() || path.isBreakStatement())
        return replaceWithMultiple(path, [
            lineNode,
            path.node,
        ]);
    
    replaceWith(path, BlockStatement([
        node,
    ]));
};

const EXCLUDE = [
    LINE,
    `(${LINE}, __z)`,
    `return (${LINE}, __z)`,
    `return ${LINE}`,
    `throw (${LINE}, __z)`,
];

export const exclude = () => EXCLUDE;

export const include = () => [
    'CallExpression',
    'NewExpression',
    'ReturnStatement',
    'ThrowStatement',
];

export const traverse = ({push}) => ({
    'AssignmentPattern|AssignmentExpression'(path) {
        if (compareAny(path.get('right'), EXCLUDE))
            return;
        
        push(path);
    },
    ArrowFunctionExpression(path) {
        if (path.get('body').isBlockStatement())
            return;
        
        push(path);
    },
    'ContinueStatement|BreakStatement'(path) {
        if (!path.parentPath.isBlockStatement())
            return;
        
        const {body} = path.parentPath.node;
        
        if (compare(body[0], LINE))
            return;
        
        push(path);
    },
    LogicalExpression(path) {
        if (compareAny(path.get('left'), EXCLUDE))
            return;
        
        push(path);
    },
    BlockStatement(path) {
        if (path.node.body.length)
            return;
        
        push(path);
    },
    SequenceExpression(path) {
        const expressions = path.get('expressions');
        
        for (const expPath of expressions) {
            if (!expPath.isCallExpression())
                continue;
            
            push(expPath);
        }
    },
    IfStatement(path) {
        const consequentPath = path.get('consequent');
        const alternatePath = path.get('alternate');
        
        if (!consequentPath.isBlockStatement() && !compareAny(consequentPath, EXCLUDE))
            push(consequentPath);
        
        if (!alternatePath.node)
            return;
        
        if (!alternatePath.isBlockStatement())
            push(alternatePath);
    },
});

