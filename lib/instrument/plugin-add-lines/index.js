const global = {};

global.__c4 = {
    lines: new Map()
};

global.__c4.setLine = (i) => {
    global.__c4.lines.set(i, true);
}

const lineNode = template('__c4.setLine(INDEX)');

function addLine(i) {
    global.__c4.lines.set(i, false);
    console.log(global.__c4.lines);
    
    return lineNode({
        INDEX: NumericLiteral(i),
    });
}

export const fix = ({path, line}) => {
    if (path.isBlockStatement()) {
        path.node.body.unshift(addLine(line));
        return;
    }
    
    const {node} = path;
    
    path.replaceWith(BlockStatement([
        node,
    ]));
}

export const traverse =({push}) => ({
    BlockStatement(path) {
        const {line} = path.node.loc.start;
        push({
            path,
            line,
        });
    },
    IfStatement(path) {
        const consequentPath = path.get('consequent');
        const alternatePath = path.get('alternate');
        if (!consequentPath.isBlockStatement())
            push({
                path: consequentPath
            });
        
        if (!alternatePath.isBlockStatement())
            push({
                path: alternatePath
            });
    }
});

