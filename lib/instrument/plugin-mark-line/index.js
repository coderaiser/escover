import {
    template,
    types,
    operator,
} from 'putout';
const global = {};

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

global.__c4 = {
    lines: new Map(),
};

global.__c4.mark = ({line, column}) => {
    global.__c4.lines.set(`${line}:${column}`, true);
};

const LINE = '__c4.mark(__l, __c)';
const buildLineNode = template(LINE, {
    placeholderPattern: /^__[a-z]$/,
});

function getLineNode({line, column}) {
    global.__c4.lines.set(`${line}:${column}`, false);
    
    return buildLineNode({
        __l: NumericLiteral(line),
        __c: NumericLiteral(column),
    });
}

export const report = () => 'Mark line';

export const fix = (path) => {
    const {
        parentPath,
        node,
    } = path;
    
    const {start} = path.node.loc || parentPath.node.loc;
    const lineNode = getLineNode(start);
    
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
        replaceWithMultiple(path.get('left'), [
            lineNode,
            path.node.left,
        ]);
        replaceWithMultiple(path.get('right'), [
            lineNode,
            path.node.right,
        ]);
        return;
    }
    
    if (path.isAssignmentPattern()) {
        replaceWithMultiple(path.get('right'), [
            lineNode,
            path.node.left,
        ]);
        return;
    }
    
    replaceWith(path, BlockStatement([
        node,
    ]));
};

const EXCLUDE = [
    LINE,
    `(${LINE}, __z)`,
];

export const exclude = () => EXCLUDE;

export const include = () => [
    'AssignmentPattern',
    'CallExpression',
];

export const traverse = ({push}) => ({
    LogicalExpression(path) {
        if (compareAny(path.get('left'), EXCLUDE))
            return;
        
        if (compareAny(path.get('right'), EXCLUDE))
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

