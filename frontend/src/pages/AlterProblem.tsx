import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { http } from '../utils/HttpClient';
import { useHttpErrorHandler } from '../hooks/httpErrorHandler';
import Layout from '../layouts/Layout';

interface ProblemFormInputs {
   name: string;
   description: string;
   example: string;
   functionDescription: string;
   inputFormat: string;
   outputFormat: string;
   sampleInput: string;
   sampleOutput: string;
   explanation: string;
   difficulty: 'easy' | 'medium' | 'hard';
}

export default function AlterProblem() {
   const { id } = useParams();
   const isCreating = id === '0';
   const navigate = useNavigate();
   const handleHttpError = useHttpErrorHandler();
   const [loading, setLoading] = useState(!isCreating);

   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
   } = useForm<ProblemFormInputs>();

   useEffect(() => {
      if (!isCreating) {
         setLoading(true);
         http
            .get(`/problems/${id}`)
            .then((response) => {
               reset(response.data);
            })
            .catch(handleHttpError)
            .finally(() => setLoading(false));
      }
   }, [id, isCreating, reset]);

   const onSubmit = (data: ProblemFormInputs) => {
      const request = isCreating ? http.post('/problems', data) : http.put(`/problems/${id}`, data);

      request
         .then(() => {
            navigate('/creator/problems');
         })
         .catch(handleHttpError);
   };

   if (loading) {
      return (
         <Layout>
            <div className="bg-gray-900 p-8 flex justify-center items-center">
               <div className="text-white">Loading...</div>
            </div>
         </Layout>
      );
   }

   return (
      <Layout>
         <div className="bg-gray-900 p-8">
            <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
               <h1 className="text-2xl font-bold text-white mb-6">{isCreating ? 'Create New Problem' : 'Edit Problem'}</h1>

               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                     <label className="block text-sm font-medium text-gray-400">Name</label>
                     <input
                        {...register('name', { required: 'Name is required' })}
                        className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                     {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-400">Description</label>
                     <textarea
                        {...register('description', { required: 'Description is required' })}
                        rows={4}
                        className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                     {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>}
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-400">Example</label>
                     <textarea
                        {...register('example', { required: 'Example is required' })}
                        rows={3}
                        className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                     {errors.example && <p className="text-red-400 text-sm mt-1">{errors.example.message}</p>}
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-400">Function Description</label>
                     <textarea
                        {...register('functionDescription', { required: 'Function description is required' })}
                        rows={3}
                        className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                     {errors.functionDescription && <p className="text-red-400 text-sm mt-1">{errors.functionDescription.message}</p>}
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-400">Input Format</label>
                     <textarea
                        {...register('inputFormat', { required: 'Input format is required' })}
                        rows={2}
                        className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                     {errors.inputFormat && <p className="text-red-400 text-sm mt-1">{errors.inputFormat.message}</p>}
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-400">Output Format</label>
                     <textarea
                        {...register('outputFormat', { required: 'Output format is required' })}
                        rows={2}
                        className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                     {errors.outputFormat && <p className="text-red-400 text-sm mt-1">{errors.outputFormat.message}</p>}
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-400">Sample Input</label>
                     <textarea
                        {...register('sampleInput', { required: 'Sample input is required' })}
                        rows={2}
                        className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                     {errors.sampleInput && <p className="text-red-400 text-sm mt-1">{errors.sampleInput.message}</p>}
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-400">Sample Output</label>
                     <textarea
                        {...register('sampleOutput', { required: 'Sample output is required' })}
                        rows={2}
                        className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                     {errors.sampleOutput && <p className="text-red-400 text-sm mt-1">{errors.sampleOutput.message}</p>}
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-400">Explanation</label>
                     <textarea
                        {...register('explanation', { required: 'Explanation is required' })}
                        rows={3}
                        className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                     {errors.explanation && <p className="text-red-400 text-sm mt-1">{errors.explanation.message}</p>}
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-400">Difficulty</label>
                     <select
                        {...register('difficulty', { required: 'Difficulty is required' })}
                        className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                     >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                     </select>
                     {errors.difficulty && <p className="text-red-400 text-sm mt-1">{errors.difficulty.message}</p>}
                  </div>

                  <div className="flex gap-4 pt-4">
                     <button type="button" onClick={() => navigate('/creator/dashboard')} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition">
                        Cancel
                     </button>
                     <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                        {isCreating ? 'Create Problem' : 'Save Changes'}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </Layout>
   );
}
