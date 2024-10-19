const acorn = require('acorn');

// Define the Node class for AST structure
class Node {
    constructor(type, value = null, left = null, right = null) {
        this.type = type;    // e.g., "operator" or "operand"
        this.value = value;  // e.g., number for operands, operator for operators
        this.left = left;    // Left child (for binary operators)
        this.right = right;  // Right child (for binary operators)
    }
}

// Function to create AST from rule string
function createAST(ruleString) {
    const ast = acorn.parse(ruleString, { ecmaVersion: 2020 });
    return ast.body[0].expression; // Return the AST from the parsed rule
}

// Function to evaluate an AST
function evaluateAST(ast, context) {
    const evaluateNode = (node) => {
        switch (node.type) {
            case 'BinaryExpression':
                return applyOperator(node.operator, evaluateNode(node.left), evaluateNode(node.right));
            case 'Identifier':
                if (context[node.name] === undefined) {
                    throw new Error(`Missing attribute: ${node.name}`);
                }
                return context[node.name];
            case 'Literal':
                return node.value;
            default:
                throw new Error(`Unsupported AST Node type: ${node.type}`);
        }
    };

    return evaluateNode(ast);
}

// Function to combine multiple ASTs
function combineMultipleASTs(asts) {
    // Start with the first AST in the array
    return asts.reduce((combinedAST, currentAST) => {
        // If one AST is null, return the other
        if (!combinedAST) return currentAST;
        if (!currentAST) return combinedAST;

        // Avoid redundancy (e.g., combining A && A)
        if (JSON.stringify(combinedAST) === JSON.stringify(currentAST)) {
            return combinedAST;
        }

        // Combine with AND operator
        return new Node('BinaryExpression', '&&', combinedAST, currentAST);
    }, null);
}

// Function to apply operators
function applyOperator(operator, left, right) {
    switch (operator) {
        case '==':
            return left == right;
        case '===':
            return left === right;
        case '!=':
            return left != right;
        case '!==':
            return left !== right;
        case '>':
            return left > right;
        case '<':
            return left < right;
        case '>=':
            return left >= right;
        case '<=':
            return left <= right;
        case '&&':
            return left && right;
        case '||':
            return left || right;
        default:
            throw new Error(`Unsupported operator: ${operator}`);
    }
}

module.exports = { evaluateAST, createAST, combineMultipleASTs };
