const express = require('express');
const { evaluateAST, createAST, combineMultipleASTs } = require('./astEvaluator');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// MongoDB connection string
const mongoURI = 'mongodb+srv://bharat:bharat@cluster0.e6qjf.mongodb.net/';
// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Define a Rule schema for MongoDB
const ruleSchema = new mongoose.Schema({
    ruleId: String,
    ruleString: String,
    ruleAST: Object, // Store AST as a JSON object
});

const Rule = mongoose.model('Rule', ruleSchema);

const app = express();
app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:5173', // Replace this with the address of your front-end
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

// Route to create and store a rule
app.post('/api/rules/create', async (req, res) => {
    const { ruleString } = req.body;
    const ruleId = `rule_${Date.now()}`; // Unique ID for the rule
    const ruleAST = createAST(ruleString); // Create AST from the rule string

    // Save the rule in MongoDB
    const rule = new Rule({ ruleId, ruleString, ruleAST });
    await rule.save();

    res.json({ ruleId, ruleString });
});

// Route to evaluate a rule based on its ID and data
app.post('/api/rules/evaluate', async (req, res) => {
    const { ruleId, data } = req.body;

    // Find the rule by its ID
    const rule = await Rule.findOne({ ruleId });

    if (!rule) {
        return res.status(404).json({ error: 'Rule not found' });
    }

    try {
        const result = evaluateAST(rule.ruleAST, data); // Evaluate the AST
        res.json({ result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error evaluating the rule', details: err.message });
    }
});

// Route to combine multiple rules into a single AST
app.post('/api/rules/combine', async (req, res) => {
    const { ruleIds } = req.body;

    try {
        const rules = await Rule.find({ ruleId: { $in: ruleIds } });
        const asts = rules.map(rule => rule.ruleAST);
        const combinedAST = combineMultipleASTs(asts);

        res.json({ combinedAST });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error combining rules', details: err.message });
    }
});

// Route to get all rules
app.get('/api/rules', async (req, res) => {
    try {
        const rules = await Rule.find({});
        res.json({ rules });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching rules', details: err.message });
    }
}); 

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
   