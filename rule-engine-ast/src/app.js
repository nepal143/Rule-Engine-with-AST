const express = require('express');
const { evaluateAST } = require('./astEvaluator');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());

let rules = {};
app.use(cors({
    origin: 'http://localhost:5173', // Replace this with the address of your front-end
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

// Route to create and store a rule
app.post('/api/rules/create', (req, res) => {
  const { ruleString } = req.body;
  const ruleId = `rule_${Date.now()}`;
  rules[ruleId] = ruleString;
  res.json({ ruleId, ruleString });
});

// Route to evaluate a rule based on its ID and data
app.post('/api/rules/evaluate', (req, res) => {
  const { ruleId, data } = req.body;
  const ruleString = rules[ruleId];
    console.log(ruleString);
    console.log(data);
  if (!ruleString) {
    return res.status(404).json({ error: 'Rule not found' });
  }

  try {
    const result = evaluateAST(ruleString, data); // Evaluate the AST
    res.json({ result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error evaluating the rule', details: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
