import { useState } from "react";
import { Link } from "react-router-dom";

type Difficulty = "Easy" | "Medium" | "Hard";

// Définir le type Problem
interface Problem {
   id: number;
   title: string;
   acceptance: number;
   difficulty: Difficulty;
}

const problems: Problem[] = [
   {
      id: 0,
      title: "Bitwise XOR of All Pairings",
      acceptance: 64.4,
      difficulty: "Hard",
   },
   {
      id: 1,
      title: "Two Sum",
      acceptance: 52.2,
      difficulty: "Easy",
   },
   {
      id: 2,
      title: "Add Two Numbers",
      acceptance: 44.1,
      difficulty: "Medium",
   },
   {
      id: 3,
      title: "Longest Substring Without Repeating Characters",
      acceptance: 44.1,
      difficulty: "Medium",
   },
];

// Composant pour chaque ligne du problème
const ProblemItem = ({ problem }: { problem: Problem }) => {
   const solutionLink = `/solutions/${problem.id}`;
   const problemLink = `/problems/${problem.id}`;

   // Define colors for difficulty
   const difficultyClass = {
      Easy: "text-green-400",
      Medium: "text-orange-400",
      Hard: "text-red-400",
   };

   return (
      <tr key={problem.id} className="hover:bg-gray-700">
         <td className="py-2 px-4 font-semibold">
            <Link to={problemLink} className="hover:text-yellow-400">
               {problem.id}
            </Link>
         </td>
         <td className="py-2 px-4">
            <Link to={problemLink} className="hover:text-yellow-400">
               {problem.title}
            </Link>
         </td>
         <td className="py-2 px-4">
            <Link to={solutionLink} className="hover:text-yellow-400">
               See solution
            </Link>
         </td>
         <td className="py-2 px-4">{problem.acceptance}%</td>
         <td className={`py-2 px-4 font-semibold ${difficultyClass[problem.difficulty]}`}>{problem.difficulty}</td>
      </tr>
   );
};

export default function ProblemsPage() {
   const [filterDifficulty, setFilterDifficulty] = useState<string>("All");
   const [filterAcceptanceRange, setFilterAcceptanceRange] = useState<string>("All");

   const filteredProblems = problems.filter((problem) => {
      const matchDifficulty = filterDifficulty === "All" || problem.difficulty === filterDifficulty;

      const [minAcceptance, maxAcceptance] = filterAcceptanceRange.split("-").map(Number);
      const matchAcceptance = filterAcceptanceRange === "All" || (problem.acceptance >= minAcceptance && problem.acceptance <= maxAcceptance);

      return matchDifficulty && matchAcceptance;
   });

   return (
      <div className="bg-gray-900 text-white min-h-screen p-6">
         {/* Study Plan Section */}
         <section className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Study Plan</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               {["Top Interview 150", "LeetCode 75", "SQL 50"].map((title) => (
                  <div key={title} className="bg-gray-800 p-4 rounded-lg hover:shadow-lg">
                     <h3 className="font-bold text-lg">{title}</h3>
                     <p className="text-sm text-gray-400">Ace Coding Interview</p>
                  </div>
               ))}
            </div>
         </section>

         {/* Topics Section */}
         <section className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Topics</h2>
            <div className="flex flex-wrap gap-4">
               {["Arrays", "Strings", "Hash Tables", "Algorithms"].map((topic) => (
                  <button key={topic} className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-yellow-400 hover:text-black">
                     {topic}
                  </button>
               ))}
            </div>
         </section>

         {/* Filters Section */}
         <section className="mt-6 flex gap-4">
            <div className="flex items-center">
               <label className="mr-2 text-gray-400">Difficulty:</label>
               <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="bg-gray-800 text-white px-4 py-2 rounded-md"
               >
                  <option value="All">All</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
               </select>
            </div>

            <div className="flex items-center">
               <label className="mr-2 text-gray-400">Acceptance Range:</label>
               <select
                  value={filterAcceptanceRange}
                  onChange={(e) => setFilterAcceptanceRange(e.target.value)}
                  className="bg-gray-800 text-white px-4 py-2 rounded-md"
               >
                  <option value="All">All</option>
                  <option value="0-10">0% - 10%</option>
                  <option value="10-20">10% - 20%</option>
                  <option value="20-30">20% - 30%</option>
                  <option value="30-40">30% - 40%</option>
                  <option value="40-50">40% - 50%</option>
                  <option value="50-60">50% - 60%</option>
                  <option value="60-70">60% - 70%</option>
                  <option value="70-80">70% - 80%</option>
                  <option value="80-100">80% - 100%</option>
               </select>
            </div>
         </section>

         {/* Problems Table Section */}
         <section className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Problems List</h2>
            <div className="overflow-x-auto">
               <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
                  <thead>
                     <tr>
                        <th className="text-left py-2 px-4 border-b border-gray-700">#</th>
                        <th className="text-left py-2 px-4 border-b border-gray-700">Title</th>
                        <th className="text-left py-2 px-4 border-b border-gray-700">Solution</th>
                        <th className="text-left py-2 px-4 border-b border-gray-700">Acceptance</th>
                        <th className="text-left py-2 px-4 border-b border-gray-700">Difficulty</th>
                     </tr>
                  </thead>
                  <tbody>
                     {filteredProblems.map((problem) => (
                        <ProblemItem key={problem.id} problem={problem} />
                     ))}
                  </tbody>
               </table>
            </div>
         </section>
      </div>
   );
}
