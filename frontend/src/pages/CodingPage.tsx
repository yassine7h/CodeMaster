import React from "react";
import CodeEditor from "../components/CodeEditor";
import Console from "../components/Console";
import Split from "react-split";

interface ConsoleMethods {
   emptyConsole: () => void;
   appendToConsole: (line: string) => void;
   appendTestResults: (testResults: any[]) => void;
}

export default function CodingPage() {
   const consoleRef = React.useRef<ConsoleMethods>(null);

   const emptyConsole = () => {
      if (consoleRef.current) {
         consoleRef.current.emptyConsole();
      }
   };

   const appendToConsole = (line: string) => {
      if (consoleRef.current) {
         consoleRef.current.appendToConsole(line);
      }
   };

   const appendTestResults = (testResults: any[]) => {
      if (consoleRef.current) {
         consoleRef.current.appendTestResults(testResults);
      }
   };

   // Problem description parts as variables (content only)
   const problemStatement = "Complete the function solveMeFirst to compute the sum of two integers.";
   const exampleContent = "If the inputs are a = 2 and b = 3, the sum is 5.";
   const functionDescriptionContent =
      "Complete the solveMeFirst function in the editor below.\n" +
      "solveMeFirst has the following parameters:\n" +
      "- int a: the first value\n" +
      "- int b: the second value\n" +
      "Returns\n" +
      "+ int: the sum of a and b";
   const inputFormatContent = "Two space-separated integers a and b.";
   const outputFormatContent = "Print the sum of a and b as a single integer.";
   const sampleInputContent = "a = 2\nb = 3";
   const sampleOutputContent = "5";
   const explanationContent = "We calculate the sum: 2 + 3 = 5.";

   return (
      <div className="w-full h-full overflow-y-clip grid grid-cols-2 grid-rows-1">
         <div className="row-span-1 col-span-1">
            <Split
               className="flex flex-col w-full h-full"
               direction="vertical"
               sizes={[65, 35]}
               minSize={100}
               gutter={() => {
                  const gutterElement = document.createElement("div");
                  gutterElement.className = "custom-gutter";
                  gutterElement.innerHTML = `<div class="gutter-handle"></div>`;
                  return gutterElement as HTMLElement;
               }}
            >
               <div className="flex-grow flex">
                  <CodeEditor
                     emptyConsole={emptyConsole}
                     appendToConsole={appendToConsole}
                     appendTestResults={appendTestResults} // Pass the appendTestResults function
                  />
               </div>
               <div className="flex-grow flex">
                  <Console ref={consoleRef} />
               </div>
            </Split>
         </div>

         {/* Problem Description Section */}
         <div className="w-full h-full row-span-1 col-span-1 p-4 overflow-y-auto bg-gray-100">
            <h2 className="text-xl font-semibold mb-4">Problem Description</h2>
            <p className="mb-2">{problemStatement}</p>

            <h3 className="text-lg font-medium mt-4 mb-2">Example</h3>
            <p>{exampleContent}</p>

            <h3 className="text-lg font-medium mt-4 mb-2">Function Description</h3>
            <div style={{ whiteSpace: "pre-wrap" }}>{functionDescriptionContent}</div>

            <h3 className="text-lg font-medium mt-4 mb-2">Input Format</h3>
            <p>{inputFormatContent}</p>

            <h3 className="text-lg font-medium mt-4 mb-2">Output Format</h3>
            <p>{outputFormatContent}</p>

            <h3 className="text-lg font-medium mt-4 mb-2">Sample Input</h3>
            <pre className="bg-gray-200 p-2 rounded">{sampleInputContent}</pre>

            <h3 className="text-lg font-medium mt-4 mb-2">Sample Output</h3>
            <pre className="bg-gray-200 p-2 rounded">{sampleOutputContent}</pre>

            <h3 className="text-lg font-medium mt-4 mb-2">Explanation</h3>
            <p>{explanationContent}</p>
         </div>
      </div>
   );
}
