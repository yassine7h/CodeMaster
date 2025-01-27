// src/pages/AdminAddProblemPage.tsx
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { http } from '../utils/HttpClient';
import Layout from '../layouts/Layout';

interface ProblemFormInputs {
   title: string;
   description: string;
   difficulty: 'Easy' | 'Medium' | 'Hard';
   examples: { input: string; output: string; explanation: string; image?: File }[];
   testCases: { input: string; output: string }[];
   constraints: string[];
   hints: string[];
   topics: string[];
}

const CreatorDashboard = () => {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<ProblemFormInputs>({
      defaultValues: {
         examples: [],
         testCases: [],
         constraints: [],
         hints: [],
         topics: [],
      },
   });

   const [examples, setExamples] = useState<{ input: string; output: string; explanation: string; image?: File }[]>([]);
   const [testCases, setTestCases] = useState<{ input: string; output: string }[]>([]);
   const [constraints, setConstraints] = useState<string[]>([]);
   const [hints, setHints] = useState<string[]>([]);
   const [topics, setTopics] = useState<string[]>([]);

   const addExample = () => {
      setExamples([...examples, { input: '', output: '', explanation: '' }]);
   };

   const updateExample = (index: number, field: 'input' | 'output' | 'explanation' | 'image', value: string | File) => {
      const updatedExamples = [...examples];
      if (field === 'image') {
         updatedExamples[index][field] = value as File;
      } else {
         updatedExamples[index][field] = value as string;
      }
      setExamples(updatedExamples);
   };

   const removeExample = (index: number) => {
      setExamples(examples.filter((_, i) => i !== index));
   };

   const addTestCase = () => {
      setTestCases([...testCases, { input: '', output: '' }]);
   };

   const updateTestCase = (index: number, field: 'input' | 'output', value: string) => {
      const updatedTestCases = [...testCases];
      updatedTestCases[index][field] = value;
      setTestCases(updatedTestCases);
   };

   const removeTestCase = (index: number) => {
      setTestCases(testCases.filter((_, i) => i !== index));
   };

   const addConstraint = () => {
      setConstraints([...constraints, '']);
   };

   const updateConstraint = (index: number, value: string) => {
      const updatedConstraints = [...constraints];
      updatedConstraints[index] = value;
      setConstraints(updatedConstraints);
   };

   const removeConstraint = (index: number) => {
      setConstraints(constraints.filter((_, i) => i !== index));
   };

   const addHint = () => {
      setHints([...hints, '']);
   };

   const updateHint = (index: number, value: string) => {
      const updatedHints = [...hints];
      updatedHints[index] = value;
      setHints(updatedHints);
   };

   const removeHint = (index: number) => {
      setHints(hints.filter((_, i) => i !== index));
   };

   const addTopic = () => {
      setTopics([...topics, '']);
   };

   const updateTopic = (index: number, value: string) => {
      const updatedTopics = [...topics];
      updatedTopics[index] = value;
      setTopics(updatedTopics);
   };

   const removeTopic = (index: number) => {
      setTopics(topics.filter((_, i) => i !== index));
   };

   const onSubmit: SubmitHandler<ProblemFormInputs> = (data) => {
      // Attach additional data to the form
      data.testCases = testCases;
      data.examples = examples;
      data.constraints = constraints;
      data.hints = hints;
      data.topics = topics;

      // Send the data to the server
      http
         .post('/admin/problems', data)
         .then(() => {
            alert('Problem successfully added!');
         })
         .catch((err) => {
            console.error(err);
            alert('An error occurred while adding the problem.');
         });
   };

   return (
      <Layout>
         <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Add a New Problem</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-md shadow-md">
               <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input type="text" {...register('title', { required: 'Title is required' })} className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300" />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                     {...register('description', { required: 'Description is required' })}
                     className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  ></textarea>
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                  <select {...register('difficulty', { required: 'Difficulty is required' })} className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300">
                     <option value="">Select difficulty</option>
                     <option value="Easy">Easy</option>
                     <option value="Medium">Medium</option>
                     <option value="Hard">Hard</option>
                  </select>
                  {errors.difficulty && <p className="text-red-500 text-sm mt-1">{errors.difficulty.message}</p>}
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700">Examples</label>
                  {examples.map((example, index) => (
                     <div key={index} className="flex items-center space-x-4 mb-2">
                        <input
                           type="text"
                           placeholder="Input"
                           value={example.input}
                           onChange={(e) => updateExample(index, 'input', e.target.value)}
                           className="w-1/4 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        <input
                           type="text"
                           placeholder="Output"
                           value={example.output}
                           onChange={(e) => updateExample(index, 'output', e.target.value)}
                           className="w-1/4 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        <input
                           type="text"
                           placeholder="Explanation"
                           value={example.explanation}
                           onChange={(e) => updateExample(index, 'explanation', e.target.value)}
                           className="w-1/4 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        <input
                           type="file"
                           onChange={(e) => e.target.files && updateExample(index, 'image', e.target.files[0])}
                           className="w-1/4 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        <button type="button" onClick={() => removeExample(index)} className="text-red-500 hover:text-red-700">
                           Remove
                        </button>
                     </div>
                  ))}
                  <button type="button" onClick={addExample} className="text-blue-500 hover:text-blue-700">
                     Add Example
                  </button>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Cases</label>
                  <div className="flex items-center space-x-4 mb-2">
                     <label className="block text-sm font-medium text-gray-700">Upload JSON</label>
                     <input
                        type="file"
                        accept="application/json"
                        onChange={(e) => {
                           if (e.target.files) {
                              const fileReader = new FileReader();
                              fileReader.onload = () => {
                                 try {
                                    const parsedData = JSON.parse(fileReader.result as string);
                                    setTestCases(parsedData);
                                 } catch {
                                    alert('Invalid JSON format');
                                 }
                              };
                              fileReader.readAsText(e.target.files[0]);
                           }
                        }}
                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                     />
                  </div>

                  {testCases.map((testCase, index) => (
                     <div key={index} className="flex items-center space-x-4 mb-2">
                        <input
                           type="text"
                           placeholder="Input"
                           value={testCase.input}
                           onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                           className="w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        <input
                           type="text"
                           placeholder="Output"
                           value={testCase.output}
                           onChange={(e) => updateTestCase(index, 'output', e.target.value)}
                           className="w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        <button type="button" onClick={() => removeTestCase(index)} className="text-red-500 hover:text-red-700">
                           Remove
                        </button>
                     </div>
                  ))}
                  <button type="button" onClick={addTestCase} className="text-blue-500 hover:text-blue-700">
                     Add Test Case
                  </button>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Constraints</label>
                  {constraints.map((constraint, index) => (
                     <div key={index} className="flex items-center space-x-4 mb-2">
                        <input
                           type="text"
                           placeholder="Constraint"
                           value={constraint}
                           onChange={(e) => updateConstraint(index, e.target.value)}
                           className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        <button type="button" onClick={() => removeConstraint(index)} className="text-red-500 hover:text-red-700">
                           Remove
                        </button>
                     </div>
                  ))}
                  <button type="button" onClick={addConstraint} className="text-blue-500 hover:text-blue-700">
                     Add Constraint
                  </button>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hints</label>
                  {hints.map((hint, index) => (
                     <div key={index} className="flex items-center space-x-4 mb-2">
                        <input
                           type="text"
                           placeholder="Hint"
                           value={hint}
                           onChange={(e) => updateHint(index, e.target.value)}
                           className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        <button type="button" onClick={() => removeHint(index)} className="text-red-500 hover:text-red-700">
                           Remove
                        </button>
                     </div>
                  ))}
                  <button type="button" onClick={addHint} className="text-blue-500 hover:text-blue-700">
                     Add Hint
                  </button>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Topics</label>
                  {topics.map((topic, index) => (
                     <div key={index} className="flex items-center space-x-4 mb-2">
                        <input
                           type="text"
                           placeholder="Topic"
                           value={topic}
                           onChange={(e) => updateTopic(index, e.target.value)}
                           className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        <button type="button" onClick={() => removeTopic(index)} className="text-red-500 hover:text-red-700">
                           Remove
                        </button>
                     </div>
                  ))}
                  <button type="button" onClick={addTopic} className="text-blue-500 hover:text-blue-700">
                     Add Topic
                  </button>
               </div>

               <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">
                  Submit Problem
               </button>
            </form>
         </div>
      </Layout>
   );
};

export default CreatorDashboard;
