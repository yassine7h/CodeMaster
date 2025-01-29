import React, { useState, useEffect } from 'react';
import { AiOutlinePlus, AiOutlineDelete } from 'react-icons/ai';
import { FaPen } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { http } from '../utils/HttpClient';
import { useHttpErrorHandler } from '../hooks/httpErrorHandler';

interface TestCase {
   id: number;
   arguments: string;
   expected_output: string;
   problem: number;
}

interface TestCaseFormData {
   arguments: string;
   expected_output: string;
}

function TestCases({ problemId }: { problemId: number }) {
   const handleHttpError = useHttpErrorHandler();
   const [testCases, setTestCases] = useState<TestCase[]>([]);
   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [loading, setLoading] = useState(false);
   const [editingId, setEditingId] = useState<number | null>(null);

   const {
      register,
      handleSubmit,
      reset,
      setValue,
      formState: { errors },
   } = useForm<TestCaseFormData>({
      defaultValues: {
         arguments: '',
         expected_output: '',
      },
   });

   const fetchTestCases = async () => {
      setLoading(true);
      http
         .get(`/problems/${problemId}/testcases/`)
         .then((response) => {
            setTestCases(response.data as TestCase[]);
         })
         .catch((error) => {
            console.error('Error fetching test cases:', error);
         })
         .finally(() => {
            setLoading(false);
         });
   };

   useEffect(() => {
      fetchTestCases();
   }, [problemId]);

   const onSubmit = async (data: TestCaseFormData) => {
      setLoading(true);
      try {
         if (editingId) {
            await http.put(`/problems/${problemId}/testcases/${editingId}/`, data);
         } else {
            await http.post(`/problems/${problemId}/testcases/`, data);
         }
         setIsModalOpen(false);
         reset();
         setEditingId(null);
         fetchTestCases();
      } catch (error) {
         handleHttpError(error);
      } finally {
         setLoading(false);
      }
   };

   const handleDelete = () => {
      if (editingId) setLoading(true);
      http
         .delete(`/problems/${problemId}/testcases/${editingId}/`)
         .then(() => {
            fetchTestCases();
         })
         .catch(handleHttpError)
         .finally(() => {
            setLoading(false);
            setShowDeleteConfirm(false);
            setEditingId(null);
         });
   };

   const handleEdit = (testCase: TestCase) => {
      setValue('arguments', testCase.arguments);
      setValue('expected_output', testCase.expected_output);
      setEditingId(testCase.id);
      setIsModalOpen(true);
   };

   return (
      <div>
         <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-white">Test Cases</h2>
            <button
               onClick={() => {
                  reset();
                  setEditingId(null);
                  setIsModalOpen(true);
               }}
               className="text-sm flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
               disabled={loading}
            >
               <AiOutlinePlus size={20} />
               Add
            </button>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-300">
               <thead>
                  <tr className="border-b border-gray-700">
                     <th className="text-sm font-semibold px-6 py-3">#</th>
                     <th className="text-sm font-semibold px-6 py-3">Arguments</th>
                     <th className="text-sm font-semibold px-6 py-3">Expected Output</th>
                     <th className="text-sm font-semibold px-6 py-3"></th>
                  </tr>
               </thead>
               <tbody>
                  {testCases.map((testCase) => (
                     <tr key={testCase.id} className="hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{testCase.id}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                           <div className="bg-gray-900 text-gray-400 px-2 py-1 w-fit rounded-md italic">{testCase.arguments}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                           <div className="bg-gray-900 text-gray-400 px-2 py-1 w-fit rounded-md italic">{testCase.expected_output}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                           <button onClick={() => handleEdit(testCase)} className="text-blue-400 hover:text-blue-300 mx-2" title="Edit" disabled={loading}>
                              <FaPen size={17} />
                           </button>
                           <button
                              onClick={() => {
                                 setEditingId(testCase.id);
                                 setShowDeleteConfirm(true);
                              }}
                              className="text-red-400 hover:text-red-300 mx-2"
                              title="Delete"
                              disabled={loading}
                           >
                              <AiOutlineDelete size={20} />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
               <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
                  <h3 className="text-white font-semibold mb-4">{editingId ? 'Edit Test Case' : 'Add Test Case'}</h3>
                  <form onSubmit={handleSubmit(onSubmit)}>
                     <div className="mb-4">
                        <label className="block text-gray-300 mb-2">Arguments</label>
                        <input {...register('arguments', { required: 'Arguments are required' })} className="w-full bg-gray-700 text-white rounded px-3 py-2" />
                        {errors.arguments && <p className="text-red-400 text-sm mt-1">{errors.arguments.message}</p>}
                     </div>
                     <div className="mb-4">
                        <label className="block text-gray-300 mb-2">Expected Output</label>
                        <input {...register('expected_output', { required: 'Expected output is required' })} className="w-full bg-gray-700 text-white rounded px-3 py-2" />
                        {errors.expected_output && <p className="text-red-400 text-sm mt-1">{errors.expected_output.message}</p>}
                     </div>
                     <div className="flex justify-end gap-2">
                        <button
                           type="button"
                           onClick={() => {
                              setIsModalOpen(false);
                              reset();
                              setEditingId(null);
                           }}
                           className="px-4 py-2 text-gray-300 hover:text-white"
                           disabled={loading}
                        >
                           Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" disabled={loading}>
                           {editingId ? 'Update' : 'Add'}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}
         {/* Delete Confirmation Modal */}
         {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
               <div className="bg-gray-800 p-6 rounded-md shadow-lg w-[400px]">
                  <h2 className="text-xl font-bold mb-4 text-white">Confirm Delete</h2>
                  <p className="text-gray-300">Are you sure you want to delete this test case? #{0}?</p>
                  <div className="mt-6 flex justify-end gap-4">
                     <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                        Cancel
                     </button>
                     <button
                        onClick={() => {
                           handleDelete();
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                     >
                        Delete
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}

export default TestCases;
