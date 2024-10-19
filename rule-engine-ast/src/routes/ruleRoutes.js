// routes/ruleRoutes.js
const express = require('express');
const router = express.Router();
const { Node, Rule } = require('../models/Rule');

// Helper function to parse rule string and convert to AST
const parseRuleString = (ruleString) => {
  // A dummy parser that creates a basic AST from rule string (to be expanded)
  // You can implement more robust parsing logic here.
  let rootNode = new Node({ type: 'operator', value: 'AND' });
  let leftNode = new Node({ type: 'operand', value: 'age > 30' });
  let rightNode = new Node({ type: 'operand', value: 'salary > 50000' });

  rootNode.left = leftNode;
  rootNode.right = rightNode;

  return rootNode;
};

// Create a new rule
router.post('/create', async (req, res) => {
  try {
    const { ruleString } = req.body;
    let astRoot = parseRuleString(ruleString); // Generate AST
    await astRoot.save();

    const rule = new Rule({ ruleString, astRoot: astRoot._id });
    await rule.save();

    res.status(201).json({ message: 'Rule created successfully', rule });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Evaluate a rule against provided data
router.post('/evaluate', async (req, res) => {
  const { ruleId, data } = req.body;

  try {
    const rule = await Rule.findById(ruleId).populate('astRoot');
    if (!rule) return res.status(404).json({ message: 'Rule not found' });

    const evaluateNode = (node, data) => {
      if (node.type === 'operand') {
        // Example: Parse simple operand (you can extend this logic for more complex conditions)
        const [attribute, operator, value] = node.value.split(' ');
        switch (operator) {
          case '>': return data[attribute] > parseInt(value);
          case '<': return data[attribute] < parseInt(value);
          case '=': return data[attribute] === value;
          default: return false;
        }
      } else if (node.type === 'operator') {
        if (node.value === 'AND') {
          return evaluateNode(node.left, data) && evaluateNode(node.right, data);
        } else if (node.value === 'OR') {
          return evaluateNode(node.left, data) || evaluateNode(node.right, data);
        }
      }
    };

    const result = evaluateNode(rule.astRoot, data);
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
