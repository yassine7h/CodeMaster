import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { http } from '../utils/HttpClient';
import { useHttpErrorHandler } from '../hooks/httpErrorHandler';
import Layout from '../layouts/Layout';
import { useSnackbar } from 'notistack';
import { IoClose } from 'react-icons/io5';
import TestCases from '../components/TestCases';

interface ProblemFormInputs {
   name: string;
   description: string;
   example: string;
   function_description: string;
   input_format: string;
   output_format: string;
   sample_input: string;
   sample_output: string;
   explanation: string;
   category: number;
   difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface Category {
   id: number;
   name: string;
}

type TabType = 'problem' | 'testCases';

export default function AlterProblem() {
   const { id } = useParams();
   const [searchParams] = useSearchParams();
   const isCreating = id === '0';
   const navigate = useNavigate();
   const handleHttpError = useHttpErrorHandler();
   const { enqueueSnackbar } = useSnackbar();
   const [loading, setLoading] = useState(!isCreating);
   const [categories, setCategories] = useState<Category[]>([]);
   const [activeTab, setActiveTab] = useState<TabType>('problem');

   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
   } = useForm<ProblemFormInputs>({
      defaultValues: {
         category: categories[0]?.id,
      },
   });

   useEffect(() => {
      if (searchParams.get('tab') === 'testCases' && !isCreating) {
         setActiveTab('testCases');
      }
   }, []);

   useEffect(() => {
      http
         .get('/problems/categories/')
         .then((response) => {
            setCategories(response.data as Category[]);
         })
         .catch(handleHttpError);
   }, []);

   useEffect(() => {
      if (!isCreating) {
         setLoading(true);
         http
            .get(`/creator/problems/${id}/`)
            .then((response) => {
               const problem: any = response.data;
               problem.category = problem.category.id;
               reset(problem as ProblemFormInputs);
            })
            .catch(() => {
               navigate('/creator/dashboard');
               enqueueSnackbar(`Error fetching problem #${id}`, { variant: 'error' });
            })
            .finally(() => setLoading(false));
      }
   }, [id, isCreating, reset]);

   const onSubmit = (data: ProblemFormInputs) => {
      const request = isCreating ? http.post('/creator/problems/', data) : http.put(`/creator/problems/${id}/`, data);
      request
         .then((response) => {
            enqueueSnackbar(isCreating ? 'New problem is added' : `Problem #${id} is updated`, { variant: 'success' });
            if (isCreating) {
               navigate(`/creator/problems/${(response.data as { id: number }).id}?tab=testCases`);
            }
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
         <div className="bg-gray-900 relative p-8 flex flex-col items-center">
            <div className="absolute top-0 right-0 p-6">
               <button onClick={() => navigate('/creator/dashboard')} className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition">
                  <IoClose size={25} />
               </button>
            </div>

            <div className="w-full max-w-[1280px] mb-6">
               <h1 className="text-xl font-bold text-white mb-6">{isCreating ? 'New Problem' : 'Problem #' + id}</h1>

               {/* Tabs */}
               <div className="flex gap-4 border-b border-gray-700">
                  <button
                     onClick={() => setActiveTab('problem')}
                     className={`px-4 py-2 text font-medium transition ${activeTab === 'problem' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
                  >
                     Problem Details
                  </button>
                  <button
                     onClick={() => !isCreating && setActiveTab('testCases')}
                     className={`px-4 py-2 text font-medium transition ${activeTab === 'testCases' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'} ${
                        isCreating ? 'opacity-50 cursor-not-allowed' : ''
                     }`}
                     disabled={isCreating}
                  >
                     Test Cases
                  </button>
               </div>
            </div>

            <div className="w-full max-w-[880px]">
               {activeTab === 'problem' ? (
                  <div className="bg-gray-800 rounded-lg shadow-lg p-8">
                     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
                        <div className="flex gap-4">
                           <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-400">Name</label>
                              <input
                                 {...register('name', { required: 'Name is required' })}
                                 className="text-sm w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
                           </div>
                           <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-400">Category</label>
                              <select
                                 {...register('category', { required: 'Category is required' })}
                                 className="text-sm  w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                 {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                       {c.name}
                                    </option>
                                 ))}
                              </select>
                              {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>}
                           </div>
                           <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-400">Difficulty</label>
                              <select
                                 {...register('difficulty', { required: 'Difficulty is required' })}
                                 className="text-sm  w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                 <option value="Easy">Easy</option>
                                 <option value="Medium">Medium</option>
                                 <option value="Hard">Hard</option>
                              </select>
                              {errors.difficulty && <p className="text-red-400 text-sm mt-1">{errors.difficulty.message}</p>}
                           </div>
                        </div>

                        <div>
                           <label className="block text-sm font-medium text-gray-400">Description</label>
                           <textarea
                              {...register('description', { required: 'Description is required' })}
                              rows={2}
                              className="text-sm  w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                           />
                           {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>}
                        </div>

                        <div>
                           <label className="block text-sm font-medium text-gray-400">Example</label>
                           <textarea
                              {...register('example', { required: 'Example is required' })}
                              rows={2}
                              className="text-sm  w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                           />
                           {errors.example && <p className="text-red-400 text-sm mt-1">{errors.example.message}</p>}
                        </div>

                        <div>
                           <label className="block text-sm font-medium text-gray-400">Function Description</label>
                           <textarea
                              {...register('function_description', { required: 'Function description is required' })}
                              rows={2}
                              className="text-sm  w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                           />
                           {errors.function_description && <p className="text-red-400 text-sm mt-1">{errors.function_description.message}</p>}
                        </div>

                        <div>
                           <label className="block text-sm font-medium text-gray-400">Input Format</label>
                           <textarea
                              {...register('input_format', { required: 'Input format is required' })}
                              rows={2}
                              className="text-sm  w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                           />
                           {errors.input_format && <p className="text-red-400 text-sm mt-1">{errors.input_format.message}</p>}
                        </div>

                        <div>
                           <label className="block text-sm font-medium text-gray-400">Output Format</label>
                           <textarea
                              {...register('output_format', { required: 'Output format is required' })}
                              rows={2}
                              className="text-sm  w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                           />
                           {errors.output_format && <p className="text-red-400 text-sm mt-1">{errors.output_format.message}</p>}
                        </div>

                        <div>
                           <label className="block text-sm font-medium text-gray-400">Sample Input</label>
                           <textarea
                              {...register('sample_input', { required: 'Sample input is required' })}
                              rows={2}
                              className="text-sm  w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                           />
                           {errors.sample_input && <p className="text-red-400 text-sm mt-1">{errors.sample_input.message}</p>}
                        </div>

                        <div>
                           <label className="block text-sm font-medium text-gray-400">Sample Output</label>
                           <textarea
                              {...register('sample_output', { required: 'Sample output is required' })}
                              rows={2}
                              className="text-sm  w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                           />
                           {errors.sample_output && <p className="text-red-400 text-sm mt-1">{errors.sample_output.message}</p>}
                        </div>

                        <div>
                           <label className="block text-sm font-medium text-gray-400">Explanation</label>
                           <textarea
                              {...register('explanation', { required: 'Explanation is required' })}
                              rows={2}
                              className="text-sm  w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                           />
                           {errors.explanation && <p className="text-red-400 text-sm mt-1">{errors.explanation.message}</p>}
                        </div>

                        <div className="flex gap-4 pt-4">
                           <button type="button" onClick={() => navigate('/creator/dashboard')} className="text-sm px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition">
                              Cancel
                           </button>
                           <button type="submit" className="text-sm px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                              {isCreating ? 'Create Problem' : 'Save Changes'}
                           </button>
                        </div>
                     </form>
                  </div>
               ) : (
                  <div className="bg-gray-800 rounded-lg shadow-lg p-8">
                     <TestCases problemId={parseInt(id as string)} />
                  </div>
               )}
            </div>
         </div>
      </Layout>
   );
}
