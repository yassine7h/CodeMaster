import ProblemCodeEditor from '../components/ProblemCodeEditor';
import Layout from '../layouts/Layout';

export default function ProblemCodingPage() {
   // Problem description parts as variables (content only)
   const problemStatement = 'Complete the function solveMeFirst to compute the sum of two integers.';
   const exampleContent = 'If the inputs are a = 2 and b = 3, the sum is 5.';
   const functionDescriptionContent =
      'Complete the solveMeFirst function in the editor below.\n' + 'solveMeFirst has the following parameters:\n' + '- int a: the first value\n' + '- int b: the second value\n' + 'Returns\n' + '+ int: the sum of a and b';
   const inputFormatContent = 'Two space-separated integers a and b.';
   const outputFormatContent = 'Print the sum of a and b as a single integer.';
   const sampleInputContent = 'a = 2\nb = 3';
   const sampleOutputContent = '5';
   const explanationContent = 'We calculate the sum: 2 + 3 = 5.';

   return (
      <Layout>
         <div className="w-full h-full overflow-y-clip grid grid-cols-2 grid-rows-1 bg-gray-900">
            <div className="row-span-1 col-span-1">
               <ProblemCodeEditor />
            </div>

            <div className="w-full h-full row-span-1 col-span-1 p-4 overflow-y-auto bg-gray-900">
               <h2 className="font-semibold mb-4 text-white">Problem Description</h2>
               <p className="text-sm mb-2 text-gray-400">{problemStatement}</p>

               <h3 className="font-medium mt-4 mb-2 text-white">Example</h3>
               <p className="text-sm text-gray-400">{exampleContent}</p>

               <h3 className="font-medium mt-4 mb-2 text-white">Function Description</h3>
               <div className="text-sm text-gray-400" style={{ whiteSpace: 'pre-wrap' }}>
                  {functionDescriptionContent}
               </div>

               <h3 className="font-medium mt-4 mb-2 text-white">Input Format</h3>
               <p className="text-sm text-gray-400">{inputFormatContent}</p>

               <h3 className="font-medium mt-4 mb-2 text-white">Output Format</h3>
               <p className="text-sm text-gray-400">{outputFormatContent}</p>

               <h3 className="font-medium mt-4 mb-2 text-white">Sample Input</h3>
               <pre className="bg-gray-800 p-2 rounded text-sm text-gray-400">{sampleInputContent}</pre>

               <h3 className="font-medium mt-4 mb-2 text-white">Sample Output</h3>
               <pre className="bg-gray-800 p-2 rounded text-sm text-gray-400">{sampleOutputContent}</pre>

               <h3 className="font-medium mt-4 mb-2 text-white">Explanation</h3>
               <p className="text-sm text-gray-400">{explanationContent}</p>
            </div>
         </div>
      </Layout>
   );
}
