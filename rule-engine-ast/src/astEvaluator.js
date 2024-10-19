const acorn = require('acorn');

// Function to evaluate an AST
function evaluateAST(ruleString, context) {
  const ast = acorn.parse(ruleString, { ecmaVersion: 2020 });

  // Traverse the AST and evaluate it
  const evaluateNode = (node) => {
    switch (node.type) {
      case 'BinaryExpression':
        return applyOperator(node.operator, evaluateNode(node.left), evaluateNode(node.right));
      case 'Identifier':
        return context[node.name]; // Lookup values in the provided context (data)
      case 'Literal':
        return node.value;
      default:
        throw new Error(`Unsupported AST Node type: ${node.type}`);
    }
  };

  // Function to apply operators like +, -, *, /
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


  return evaluateNode(ast.body[0].expression);
}

module.exports = { evaluateAST };
