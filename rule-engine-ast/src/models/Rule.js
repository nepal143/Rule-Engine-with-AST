// models/Rule.js
const mongoose = require('mongoose');

// Schema for a single AST Node
const nodeSchema = new mongoose.Schema({
  type: String, // "operator" for AND/OR, "operand" for conditions
  left: { type: mongoose.Schema.Types.ObjectId, ref: 'Node' }, // left child
  right: { type: mongoose.Schema.Types.ObjectId, ref: 'Node' }, // right child
  value: String, // operand value (e.g., 'age > 30')
});

// Schema for Rule
const ruleSchema = new mongoose.Schema({
  ruleString: String, // Rule in string form
  astRoot: { type: mongoose.Schema.Types.ObjectId, ref: 'Node' }, // Root Node of AST
});

const Node = mongoose.model('Node', nodeSchema);
const Rule = mongoose.model('Rule', ruleSchema);

module.exports = { Node, Rule };
