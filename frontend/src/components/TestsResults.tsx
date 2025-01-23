import React, { forwardRef, useImperativeHandle, useState } from "react";

const TestsResults = forwardRef((props, ref) => {
   const consoleRef = React.useRef<HTMLDivElement>(null);
   const [lines, setLines] = React.useState<string[]>([]);
   const [testResults, setTestResults] = React.useState<any[]>([]);
   const [expandedTest, setExpandedTest] = useState<number | null>(null); // State to handle expanded card

   useImperativeHandle(ref, () => ({
      emptyConsole() {
         setLines([]);
         setTestResults([]);
      },
      appendToConsole(line: string) {
         setLines((prevLines) => [...prevLines, line]);
      },
      appendTestResults(testResults: any[]) {
         setTestResults(testResults);
      },
   }));

   const handleCardClick = (index: number) => {
      // Toggle expanded state of the card clicked
      setExpandedTest(expandedTest === index ? null : index);
   };

   return (
      <div className="w-full bg-gray-800 text-white">
         <div className="font-semibold bg-gray-900 w-full px-3 py-2">Tests Results</div>
         <div ref={consoleRef} className="w-full h-full p-4 overflow-x-scroll">
            {testResults.length > 0 ? (
               testResults.map((test, index) => (
                  <div
                     key={index}
                     className={`bg-gray-700 p-4 mb-4 rounded-lg cursor-pointer ${
                        test.status ? "border-2 border-green-500" : "border-2 border-red-500"
                     }`}
                     onClick={() => handleCardClick(index)} // Handle click to expand
                  >
                     <h4 className="text-lg font-semibold">
                        Test {index + 1} - {test.status ? "Passed" : "Failed"}
                     </h4>

                     {/* Minimal Information (only visible when not expanded) */}
                     {expandedTest !== index && (
                        <div className="mt-2 text-sm">
                           <strong>Status: </strong>
                           {test.status ? "Passed" : "Failed"}
                        </div>
                     )}

                     {/* Detailed Information (only visible when expanded) */}
                     {expandedTest === index && (
                        <div className="mt-4">
                           <div className="mt-2">
                              <strong>Input (stdin):</strong>
                              <pre className="bg-gray-600 p-2 rounded">{test.input}</pre>
                           </div>
                           <div className="mt-2">
                              <strong>Expected Output:</strong>
                              <pre className="bg-gray-600 p-2 rounded">{test.expected_output}</pre>
                           </div>
                           <div className="mt-2">
                              <strong>Your Output (stdout):</strong>
                              <pre className="bg-gray-600 p-2 rounded">{test.actual_output}</pre>
                           </div>
                        </div>
                     )}
                  </div>
               ))
            ) : (
               <div>No test results yet.</div>
            )}
         </div>
      </div>
   );
});

export default TestsResults;
