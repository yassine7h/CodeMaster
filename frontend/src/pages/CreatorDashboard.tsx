import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { http } from '../utils/HttpClient';
import { useHttpErrorHandler } from '../hooks/httpErrorHandler';
import Layout from '../layouts/Layout';
import { AiOutlinePlus, AiOutlineEye, AiOutlineDelete } from 'react-icons/ai';

interface Problem {
   id: number;
   name: string;
   author: {
      id: number;
      username: string;
   };
}

export default function CreatorDashboard() {
   const [problems, setProblems] = useState<Problem[]>([
      { id: 1, name: 'Problem 1', author: { id: 1, username: 'user1' } },
      { id: 2, name: 'Problem 2', author: { id: 1, username: 'user1' } },
   ]);
   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
   const [selectedProblemId, setSelectedProblemId] = useState<number | null>(null);
   const handleHttpError = useHttpErrorHandler();
   const navigate = useNavigate();

   useEffect(() => {
      fetchProblems();
   }, []);

   const fetchProblems = () => {
      //   http.get('/problems/my-problems')
      //       .then(response => {
      //           setProblems(response.data);
      //       })
      //       .catch(handleHttpError);
   };

   const handleDelete = (id: number) => {
      setSelectedProblemId(id);
      setShowDeleteConfirm(true);
   };

   const confirmDelete = () => {
      if (selectedProblemId) {
         http
            .delete(`/problems/${selectedProblemId}`)
            .then(() => {
               fetchProblems();
               setShowDeleteConfirm(false);
            })
            .catch(handleHttpError);
      }
   };

   return (
      <Layout>
         <div className="bg-gray-900 p-8">
            <div className="max-w-6xl mx-auto">
               <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-white">My Problems</h1>
                  <button onClick={() => navigate('/creator/problems/0')} className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                     <AiOutlinePlus size={20} />
                     Add Problem
                  </button>
               </div>

               <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-700">
                     <thead className="bg-gray-700">
                        <tr>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                           <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {problems.map((problem) => (
                           <tr key={problem.id} className="hover:bg-gray-700">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{problem.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{problem.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                                 <button onClick={() => navigate(`/creator/problems/${problem.id}`)} className="text-blue-400 hover:text-blue-300 mx-2" title="View Details">
                                    <AiOutlineEye size={20} />
                                 </button>
                                 <button onClick={() => handleDelete(problem.id)} className="text-red-400 hover:text-red-300 mx-2" title="Delete">
                                    <AiOutlineDelete size={20} />
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
               <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                  <div className="bg-gray-800 p-6 rounded-md shadow-lg w-[400px]">
                     <h2 className="text-xl font-bold mb-4 text-white">Confirm Delete</h2>
                     <p className="text-gray-300">Are you sure you want to delete this problem?</p>
                     <div className="mt-6 flex justify-end gap-4">
                        <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                           Cancel
                        </button>
                        <button onClick={confirmDelete} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                           Delete
                        </button>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </Layout>
   );
}