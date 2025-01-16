import React from "react";
import { useNavigate } from "react-router-dom";

const ProblemsPage = () => {
  const navigate = useNavigate();

  // Sample problems list (this can be replaced with data from an API or context)
  const problems = [
    { id: "sort-array", title: "Sort an Array", difficulty: "Easy" },
    { id: "binary-search", title: "Binary Search", difficulty: "Medium" },
    { id: "knapsack-problem", title: "Knapsack Problem", difficulty: "Hard" },
  ];

  return (
    <div className="w-full h-full bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Problems</h1>
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="text-left py-3 px-4">Title</th>
              <th className="text-left py-3 px-4">Difficulty</th>
              <th className="text-center py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem, index) => (
              <tr
                key={problem.id}
                className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
              >
                <td className="py-3 px-4 font-semibold text-gray-800">{problem.title}</td>
                <td className="py-3 px-4 text-gray-600">{problem.difficulty}</td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => navigate(`/problems/${problem.id}`)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Solve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProblemsPage;