import Editor from "@monaco-editor/react";
import React from "react";
import axios from "axios";

const defaultValue = `def solveMeFirst(a,b):
   return a + b

num1 = int(input())
num2 = int(input())
res = solveMeFirst(num1,num2)
print(res)
`;

const options = {
   minimap: { enabled: false },
   scrollBeyondLastLine: false,
};

export default function CodeEditor({ emptyConsole, appendToConsole, appendTestResults }: any) {
   const [codeValue, setCodeValue] = React.useState<string>(defaultValue);

   const handleEditorChange = (value: any) => {
      setCodeValue(value);
   };

   const runCode = async () => {
      try {
         const response = await axios.post("http://localhost:8000/submit", {
            code: codeValue,
         });

         // Clear the console before displaying new output
         emptyConsole();

         // Debugging logs to verify the response structure
         console.log("Response from server:", response.data);

         // If stdout is returned, display it
         if (response.data.stdout) {
            appendToConsole(`Output: ${response.data.stdout}`);
         }

         // If stderr is returned (error), display it
         if (response.data.stderr) {
            appendToConsole(`Error: ${response.data.stderr}`);
         }

         // If test results are available, display them
         const testResults = response.data.tests || [];
         console.log("Test Results:", testResults); // Debugging the test results
         appendTestResults(testResults); // Pass the test results to the Console component

      } catch (error) {
         emptyConsole();
         appendToConsole("Network Connection Error");
         console.error("Error:", error);
      }
   };

   return (
      <div className="h-full w-full border-2 relative">
         <div className="h-full w-full">
            <Editor
               className="rounded-md"
               options={options}
               height="100%"
               width="100%"
               defaultLanguage="python"  // Assuming Python as the language
               defaultValue={defaultValue}
               onChange={handleEditorChange}
            />
         </div>
         <div className="z-50 absolute bottom-0 right-0 p-3">
            <button
               onClick={runCode}
               className="bg-green-600 px-3 py-2 rounded-lg text-white font-semibold flex items-center justify-center"
            >
               Run
            </button>
         </div>
      </div>
   );
}
