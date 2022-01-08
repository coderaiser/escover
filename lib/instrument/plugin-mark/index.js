import {
    template,
    types,
    operator,
} from 'putout';
import {addMarkToReturn} from './return.js';
import {addMarkToArrowFunction} from './arrow.js';

const {
    NumericLiteral,
    SequenceExpression,
    BlockStatement,
} = types;

const {
    replaceWithMultiple,
    replaceWith,
    compareAny,
} = operator;

const LINE = '__c4.mark(__l, __c)';
const buildLineNode = template(LINE, {
    placeholderPattern: /^__[a-z]$/,
});

function getLineNode(__c4, {line, column}) {
    __c4.init(line, column);
    
    return buildLineNode({
        __l: NumericLiteral(line),
        __c: NumericLiteral(column),
    });
}

export const report = () => 'Mark line';

export const fix = (path, {options}) => {
    const {
        parentPath,
        node,
    } = path;
    
    const {start} = path.node.loc || parentPath.node.loc || {};
    
    if (!start)
        return;
    
    const {
        __c4 = {
            mark: () => {},
            init: () => {},
        },
    } = options;
    
    const lineNode = getLineNode(__c4, start);
    
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
            getLineNode(__c4, path.node.right.loc.start).expression,
            path.node.right,
        ]));
        return;
    }
    
    if (path.isAssignmentPattern()) {
        replaceWithMultiple(path.get('right'), [
            lineNode,
            node.left,
        ]);
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
    
    replaceWith(path, BlockStatement([
        node,
    ]));
};

const EXCLUDE = [
    LINE,
    `(${LINE}, __z)`,
    `return (${LINE}, __z)`,
    `return ${LINE}`,
];

export const exclude = () => EXCLUDE;

export const include = () => [
    'AssignmentPattern',
    'CallExpression',
    'NewExpression',
    'ReturnStatement',
];

export const traverse = ({push}) => ({
    ArrowFunctionExpression(path) {
        if (path.get('body').isBlockStatement())
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
        
        if (!consequentPath.isBlockStatement())
            push(consequentPath);
        
        if (!alternatePath.node)
            return;
        
        if (!alternatePath.isBlockStatement())
            push(alternatePath);
    },
});

