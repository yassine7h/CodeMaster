import { useState } from 'react';

const TestsResults = ({ testResults, message }: { testResults: any[]; message: string | undefined }) => {
   const [expandedTest, setExpandedTest] = useState<number | null>(null);

   const handleCardClick = (index: number) => {
      setExpandedTest(expandedTest === index ? null : index);
   };

   return (
      <div className="w-full h-full bg-gray-800 text-white">
         <div className="font-semibold bg-gray-900 w-full px-3 py-2 border-b-2 border-black">Tests Results</div>
         <div className="w-full h-full p-4 overflow-x-scroll">
            {testResults.length > 0 ? (
               testResults.map((test, index) => (
                  <div
                     key={index}
                     className={`bg-gray-900 p-4 mb-4 rounded-lg cursor-pointer ${test.status ? 'border-2 border-green-600' : 'border-2 border-red-600'}`}
                     onClick={() => handleCardClick(index)} // Handle click to expand
                  >
                     <h4 className="text-sm font-semibold">
                        Test {index + 1} - {test.status ? 'Passed' : 'Failed'}
                     </h4>

                     {/* Minimal Information (only visible when not expanded) */}
                     {expandedTest !== index && (
                        <div className="mt-2 text-sm">
                           <span>Status: </span>
                           {test.status ? 'Passed' : 'Failed'}
                        </div>
                     )}

                     {/* Detailed Information (only visible when expanded) */}
                     {expandedTest === index && (
                        <div className="mt-2">
                           <div className="mt-2">
                              <span className="text-sm">stdin</span>
                              <pre className="bg-gray-600 px-2 rounded w-fit">{test.input}</pre>
                           </div>
                           <div className="mt-2">
                              <span className="text-sm">stdout</span>
                              <pre className="bg-gray-600 px-2 rounded w-fit">{test.actual_output}</pre>
                           </div>
                           <div className="mt-2">
                              <span className="text-sm">Expected output</span>
                              <pre className="bg-gray-600 px-2 rounded w-fit">{test.expected_output}</pre>
                           </div>
                        </div>
                     )}
                  </div>
               ))
            ) : message ? (
               <div>{message}</div>
            ) : (
               <div>No tests results yet.</div>
            )}
         </div>
      </div>
   );
};

export default TestsResults;
