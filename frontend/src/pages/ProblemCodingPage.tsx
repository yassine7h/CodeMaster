import { useParams } from 'react-router-dom';
import ProblemCodeEditor from '../components/ProblemCodeEditor';
import Layout from '../layouts/Layout';
import { useEffect, useState } from 'react';
import { http } from '../utils/HttpClient';
import { useHttpErrorHandler } from '../hooks/httpErrorHandler';

// const problemStatement = 'Complete the function solveMeFirst to compute the sum of two integers.';
// const exampleContent = 'If the inputs are a = 2 and b = 3, the sum is 5.';
// const functionDescriptionContent =
//    'Complete the solveMeFirst function in the editor below.\n' +
//    'solveMeFirst has the following parameters:\n' +
//    '- int a: the first value\n' +
//    '- int b: the second value\n' +
//    'Returns\n' +
//    '+ int: the sum of a and b';
// const inputFormatContent = 'Two space-separated integers a and b.';
// const outputFormatContent = 'Print the sum of a and b as a single integer.';
// const sampleInputContent = 'a = 2\nb = 3';
// const sampleOutputContent = '5';
// const explanationContent = 'We calculate the sum: 2 + 3 = 5.';

interface Problem {
   id: number;
   name: string;
   description: string;
   example: string;
   function_description: string;
   input_format: string;
   output_format: string;
   sample_input: string;
   sample_output: string;
   explanation: string;
   category: Category;
   difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface Category {
   id: number;
   name: string;
}

export default function ProblemCodingPage() {
   const { id } = useParams();
   const handleHttpError = useHttpErrorHandler();
   const [problem, setProblem] = useState<Problem>();
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      http
         .get(`problems/${id}/`)
         .then((res) => {
            setProblem(res.data as Problem);
         })
         .catch(handleHttpError)
         .finally(() => {
            setLoading(false);
         });
   }, []);

   if (!problem) return null;
   if (loading) {
      return (
         <Layout>
            <div className="bg-gray-900 p-8 flex justify-center items-center">
               <div className="text-white">Loading...</div>
            </div>
         </Layout>
      );
   }
   const difficultyClass = {
      Easy: 'text-green-400',
      Medium: 'text-orange-400',
      Hard: 'text-red-400',
   };
   return (
      <Layout>
         <div className="w-full h-full overflow-y-clip grid grid-cols-2 grid-rows-1 bg-gray-900">
            <div className="row-span-1 col-span-1">
               <ProblemCodeEditor problemId={parseInt(id as string)} />
            </div>

            <div className="flex flex-col w-full max-h-full row-span-1 col-span-1 bg-gray-900">
               <div className="w-full flex justify-between items-end bg-gray-800 py-3 px-4 border-black">
                  <h2 className="border-2 border-white px-3 text-lg font-semibold text-white">{`${problem.name}`}</h2>
                  <div className="flex gap-4">
                     <div className="px-2 py-1 font-semibold rounded-md text-yellow-400">{problem.category.name}</div>
                     <div className={'px-2 py-1 font-semibold rounded-md ' + difficultyClass[problem.difficulty]}>{problem.difficulty}</div>
                  </div>
               </div>
               <div className="p-4 overflow-y-auto">
                  <h2 className="font-semibold mb-4 text-white">Problem Description</h2>
                  <p className="text-sm mb-2 text-gray-400 whitespace-pre-wrap">{problem.description}</p>

                  <h3 className="font-medium mt-4 mb-2 text-white">Example</h3>
                  <p className="text-sm text-gray-400 whitespace-pre-wrap">{problem.example}</p>

                  <h3 className="font-medium mt-4 mb-2 text-white">Function Description</h3>
                  <div className="text-sm text-gray-400 whitespace-pre-wrap">{problem.function_description}</div>

                  <h3 className="font-medium mt-4 mb-2 text-white">Input Format</h3>
                  <p className="text-sm text-gray-400 whitespace-pre-wrap">{problem.input_format}</p>

                  <h3 className="font-medium mt-4 mb-2 text-white">Output Format</h3>
                  <p className="text-sm text-gray-400 whitespace-pre-wrap">{problem.output_format}</p>

                  <h3 className="font-medium mt-4 mb-2 text-white">Sample Input</h3>
                  <pre className="bg-gray-800 p-2 rounded text-sm text-gray-400">{problem.sample_input}</pre>

                  <h3 className="font-medium mt-4 mb-2 text-white">Sample Output</h3>
                  <pre className="bg-gray-800 p-2 rounded text-sm text-gray-400">{problem.sample_output}</pre>

                  <h3 className="font-medium mt-4 mb-2 text-white">Explanation</h3>
                  <p className="text-sm text-gray-400 whitespace-pre-wrap">{problem.explanation}</p>
               </div>
            </div>
         </div>
      </Layout>
   );
}
