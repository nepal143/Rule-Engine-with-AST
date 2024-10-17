import React, { useState } from "react";
import axios from "axios";

function App() {
  const [rule, setRule] = useState("");            // To hold rule input
  const [userData, setUserData] = useState("");     // To hold user data input
  const [evaluationResult, setEvaluationResult] = useState(null);  // Holds evaluation response

  // API Call to create a new rule
  const handleCreateRule = async () => {
    try {
      const response = await axios.post("http://localhost:5000/create_rule", { rule });
      console.log("Rule created:", response.data);
    } catch (error) {
      console.error("Error creating rule", error);
    }
  };

  // API Call to evaluate a rule using user data
  const handleEvaluateRule = async () => {
    try {
      const response = await axios.post("http://localhost:5000/evaluate_rule/<rule_id>", JSON.parse(userData));
      setEvaluationResult(response.data.result);  // Set the evaluation result (true/false)
    } catch (error) {
      console.error("Error evaluating rule", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Rule Engine with AST</h1>

      {/* Section for Creating a Rule */}
      <div className="mb-4">
        <h2 className="text-2xl">Create Rule</h2>
        <textarea
          className="border w-full p-2 mt-2 mb-2"
          value={rule}
          onChange={(e) => setRule(e.target.value)}
          placeholder="Enter your rule here (e.g., age > 30 AND salary > 50000)"
        />
        <button
          onClick={handleCreateRule}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Create Rule
        </button>
      </div>

      {/* Section for Evaluating a Rule */}
      <div className="mb-4">
        <h2 className="text-2xl">Evaluate Rule</h2>
        <textarea
          className="border w-full p-2 mt-2 mb-2"
          value={userData}
          onChange={(e) => setUserData(e.target.value)}
          placeholder='Enter user data as JSON (e.g., {"age": 35, "department": "Sales", "salary": 60000})'
        />
        <button
          onClick={handleEvaluateRule}
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          Evaluate Rule
        </button>
      </div>

      {/* Display Evaluation Result */}
      {evaluationResult !== null && (
        <div className="mt-4">
          <h2 className="text-xl">Evaluation Result: {evaluationResult ? "True" : "False"}</h2>
        </div>
      )}
    </div>
  );
}

export default App;
