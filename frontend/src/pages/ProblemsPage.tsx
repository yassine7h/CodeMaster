import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { http } from '../utils/HttpClient';
import { useHttpErrorHandler } from '../hooks/httpErrorHandler';

type Difficulty = 'Easy' | 'Medium' | 'Hard';

interface Problem {
   id: number;
   name: string;
   category: Category;
   difficulty: Difficulty;
}
interface Category {
   id: number;
   name: string;
}

const ProblemItem = ({ problem }: { problem: Problem }) => {
   const navigate = useNavigate();
   const problemLink = `/problems/${problem.id}`;

   const difficultyClass = {
      Easy: 'text-green-400',
      Medium: 'text-orange-400',
      Hard: 'text-red-400',
   };

   return (
      <tr
         onClick={() => {
            navigate(problemLink);
         }}
         key={problem.id}
         className="hover:bg-gray-700 cursor-pointer"
      >
         <td className="py-2 px-4 font-semibold">{problem.id}</td>
         <td className="py-2 px-4">{problem.name}</td>
         <td className="py-2 px-4">{problem.category.name}</td>
         <td className={`py-2 px-4 font-semibold ${difficultyClass[problem.difficulty]}`}>{problem.difficulty}</td>
      </tr>
   );
};

export default function ProblemsPage() {
   const handleHttpError = useHttpErrorHandler();
   const [loading, setLoading] = useState(true);
   const [categories, setCategories] = useState<string[]>([]);
   const [problems, setProblems] = useState<Problem[]>([]);

   const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
   const [filterId, setFilterId] = useState<string>('');
   const [filterCategory, setFilterCategory] = useState<string[]>([]);

   const filteredProblems = problems.filter((problem) => {
      const matchDifficulty = filterDifficulty === 'All' || problem.difficulty === filterDifficulty;
      const matchId = problem.id.toString().toLowerCase().includes(filterId.toLowerCase());
      const matchCategories = filterCategory.includes(problem.category.name);
      return matchDifficulty && matchId && matchCategories;
   });

   useEffect(() => {
      http
         .get('/problems/categories/')
         .then((response) => {
            setCategories((response.data as Category[]).map((e) => e.name));
            setFilterCategory((response.data as Category[]).map((e) => e.name));
         })
         .catch(handleHttpError);
      http
         .get('/problems/')
         .then((response) => {
            setProblems(response.data as Problem[]);
         })
         .catch(handleHttpError);
   }, []);
   useEffect(() => {
      if (problems.length > 0 && categories.length > 0) setLoading(false);
   }, [problems, categories]);
   if (loading)
      return (
         <Layout>
            <div className="bg-gray-900 w-full h-full flex justify-center items-center text-xl text-white font-semibold">Loading...</div>
         </Layout>
      );
   return (
      <Layout>
         <div className="bg-gray-900 text-white py-8 px-14">
            {/* Topics Section */}
            <section className="">
               <h2 className="text-xl font-semibold mb-4">Topics</h2>
               <div className="flex flex-wrap gap-4">
                  {categories.map((topic) => (
                     <button
                        key={topic}
                        onClick={() => {
                           if (filterCategory.includes(topic)) setFilterCategory((arr) => arr.filter((e) => e !== topic));
                           else setFilterCategory((arr) => [...arr, topic]);
                        }}
                        className={
                           (filterCategory.includes(topic) ? 'bg-yellow-400 text-black hover:bg-yellow-600 hover:text-black ' : 'bg-gray-800 text-white hover:bg-yellow-400 hover:text-black ') +
                           'px-4 py-2 rounded-md'
                        }
                     >
                        {topic}
                     </button>
                  ))}
               </div>
            </section>

            {/* Filters Section */}
            <section className="mt-6 flex gap-4">
               <div className="flex items-center">
                  <label className="mr-2 text-gray-400">Difficulty:</label>
                  <select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)} className="bg-gray-800 text-white px-4 py-2 rounded-md">
                     <option value="All">All</option>
                     <option value="Easy">Easy</option>
                     <option value="Medium">Medium</option>
                     <option value="Hard">Hard</option>
                  </select>
               </div>
               <div className="flew items-center">
                  <label className="mr-2 text-gray-400">Number:</label>
                  <input
                     className="bg-gray-800 text-white px-4 py-2 rounded-md max-w-[130px]"
                     type="text"
                     value={filterId}
                     onChange={(e) => {
                        setFilterId(e.currentTarget.value);
                     }}
                  />
               </div>
            </section>

            {/* Problems Table Section */}
            <section className="mt-6 container max-w-screen-md">
               {/* <h2 className="text-xl font-semibold mb-4">Problems Set</h2> */}
               <div className="overflow-x-auto mx-auto">
                  <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
                     <thead>
                        <tr>
                           <th className="text-left py-2 px-4 border-b border-gray-700">#</th>
                           <th className="text-left py-2 px-4 border-b border-gray-700">Name</th>
                           <th className="text-left py-2 px-4 border-b border-gray-700">Topic</th>
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
      </Layout>
   );
}
