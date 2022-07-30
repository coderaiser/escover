import {
    template,
    types,
    operator,
} from 'putout';

import {addMarkToArgument} from './argument.js';
import {addMarkToArrowFunction} from './arrow.js';

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
    const {start} = path.node.loc || path.parentPath.node.loc;
    
    const {
        c4 = {
            init: () => {},
        },
    } = options;
    
    const lineNode = getLineNode(c4, start);
    
    if (path.isBlockStatement()) {
        path.node.body.unshift(lineNode);
        return;
    }
    
    if (path.isCallExpression() || path.isNewExpression()) {
        const {node} = path;
        
        replaceWith(path, SequenceExpression([
            lineNode.expression,
            node,
        ]));
        
        return;
    }
    
    if (path.parentPath.isLogicalExpression())
        return replaceWith(path, SequenceExpression([
            lineNode.expression,
            path.node,
        ]));
    
    if (path.isAssignmentPattern() || path.isAssignmentExpression()) {
        replaceWith(path.get('right'), SequenceExpression([
            lineNode.expression,
            node.right,
        ]));
        return;
    }
    
    if (path.isArrowFunctionExpression())
        return addMarkToArrowFunction(path, lineNode);
    
    if (path.isReturnStatement() || path.isThrowStatement())
        return addMarkToArgument(path, lineNode);
    
    if (path.isContinueStatement() || path.isBreakStatement()) {
        return replaceWithMultiple(path, [
            lineNode,
            path.node,
        ]);
    }
    
    if (path.isExpression()) {
        const {node} = path;
        
        replaceWith(path, SequenceExpression([
            lineNode.expression,
            node,
        ]));
        
        return;
    }
    
    replaceWith(path, BlockStatement([
        node,
    ]));
};

const EXCLUDE = [
    LINE,
    `return (${LINE}, __z)`,
    `return ${LINE}`,
    `throw (${LINE}, __z)`,
];

const SEQUENCE = `(${LINE}, __z)`;
const isExclude = (node) => {
    const templates = [
        ...EXCLUDE,
        SEQUENCE,
    ];
    return compareAny(node, templates, {
        findUp: false,
    });
};

export const exclude = () => EXCLUDE;

export const traverse = ({push}) => ({
    'ThrowStatement|ReturnStatement'(path) {
        push(path);
    },
    'CallExpression|NewExpression'(path) {
        if (compare(path.parentPath.node, SEQUENCE))
            return;
        
        push(path);
    },
    'AssignmentPattern|AssignmentExpression'(path) {
        if (isExclude(path.get('right')))
            return;
        
        push(path);
    },
    ArrowFunctionExpression(path) {
        const bodyPath = path.get('body');
        
        if (bodyPath.isBlockStatement())
            return;
        
        if (isExclude(bodyPath))
            return;
        
        push(path);
    },
    'ContinueStatement|BreakStatement'(path) {
        if (compare(path.getPrevSibling(), LINE))
            return;
        
        push(path);
    },
    LogicalExpression(path) {
        const leftPath = path.get('left');
        const rightPath = path.get('right');
        
        if (!isExclude(leftPath))
            push(leftPath);
        
        if (!isExclude(rightPath))
            push(rightPath);
    },
    BlockStatement(path) {
        if (path.node.body.length)
            return;
        
        push(path);
    },
    SequenceExpression(path) {
        if (compare(path, `(${LINE}, __z)`)) {
            return;
        }
        
        const expressions = path.get('expressions');
        
        for (const expPath of expressions) {
            if (!expPath.isCallExpression())
                continue;
            
            push(expPath);
        }
    },
    UpdateExpression(path) {
        if (compare(path, `(${LINE}, __z)`)) {
            return;
        }
        
        push(path);
    },
    'IfStatement|ConditionalExpression'(path) {
        const consequentPath = path.get('consequent');
        const alternatePath = path.get('alternate');
        
        if (!consequentPath.isBlockStatement() && !isExclude(consequentPath))
            push(consequentPath);
        
        if (!alternatePath.node)
            return;
        
        if (alternatePath.isIfStatement())
            return;
        
        if (!alternatePath.isBlockStatement() && !isExclude(alternatePath)) {
            push(alternatePath);
        }
    },
});

